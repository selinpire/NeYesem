const { createClient } = require("redis");

let client = null;

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  return "redis://localhost:6379";
};

const connect = async () => {
  if (client?.isOpen) return client;

  client = createClient({
    url: getRedisUrl(),
    socket: {
      connectTimeout: 5000,
      reconnectStrategy: (retries) => (retries > 2 ? false : Math.min(retries * 500, 2000)),
    },
  });
  client.on("error", (err) => console.log("Redis hatasi:", err.message));
  await client.connect();
  console.log("Redis baglantisi basarili");
  return client;
};

const setWithTTL = async (key, value, ttlSeconds) => {
  const c = await connect();
  const payload = typeof value === "string" ? value : JSON.stringify(value);
  await c.setEx(key, ttlSeconds, payload);
};

const get = async (key) => {
  const c = await connect();
  return c.get(key);
};

const del = async (key) => {
  const c = await connect();
  await c.del(key);
};

const lPush = async (key, value) => {
  const c = await connect();
  await c.lPush(key, value);
};

const lRem = async (key, count, value) => {
  const c = await connect();
  await c.lRem(key, count, value);
};

const lTrim = async (key, start, stop) => {
  const c = await connect();
  await c.lTrim(key, start, stop);
};

const lRange = async (key, start, stop) => {
  const c = await connect();
  return c.lRange(key, start, stop);
};

const expire = async (key, ttlSeconds) => {
  const c = await connect();
  await c.expire(key, ttlSeconds);
};

const isConnected = () => Boolean(client?.isOpen);

module.exports = {
  connect,
  setWithTTL,
  get,
  del,
  lPush,
  lRem,
  lTrim,
  lRange,
  expire,
  isConnected,
};
