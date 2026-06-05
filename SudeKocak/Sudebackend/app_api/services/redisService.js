const { createClient } = require("redis");

let client = null;

const getRedisUrl = () => {
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  const host = process.env.REDIS_HOST || "redis";
  const port = process.env.REDIS_PORT || "6379";

  return `redis://${host}:${port}`;
};

const connect = async () => {
  if (client?.isOpen) return client;

  client = createClient({ url: getRedisUrl() });
  client.on("error", (err) => console.log("Redis hatasi:", err.message));
  await client.connect();
  console.log("Redis baglantisi basarili");
  return client;
};

const set = async (key, value) => {
  const c = await connect();
  const payload = typeof value === "string" ? value : JSON.stringify(value);
  await c.set(key, payload);
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

const isConnected = () => Boolean(client?.isOpen);

module.exports = {
  connect,
  set,
  setWithTTL,
  get,
  isConnected,
};
