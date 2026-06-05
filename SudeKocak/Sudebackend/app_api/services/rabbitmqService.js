const amqp = require("amqplib");

const QUEUE_NAME = "neyesem.events";

let connection = null;
let channel = null;

const getRabbitUrl = () => {
  if (process.env.RABBITMQ_URL) {
    return process.env.RABBITMQ_URL;
  }

  const user = process.env.RABBITMQ_USER || "guest";
  const pass = process.env.RABBITMQ_PASS || "guest";
  const host = process.env.RABBITMQ_HOST || "rabbitmq";
  const port = process.env.RABBITMQ_PORT || "5672";

  return `amqp://${user}:${pass}@${host}:${port}`;
};

const connect = async () => {
  if (channel) return channel;

  connection = await amqp.connect(getRabbitUrl());
  channel = await connection.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  console.log("RabbitMQ baglantisi basarili");
  return channel;
};

const publishMessage = async (message) => {
  const ch = await connect();
  const payload = Buffer.from(JSON.stringify(message));

  ch.sendToQueue(QUEUE_NAME, payload, { persistent: true });

  return { queue: QUEUE_NAME, message };
};

const startConsumer = async (onMessage) => {
  const ch = await connect();

  await ch.consume(QUEUE_NAME, (msg) => {
    if (!msg) return;

    const content = JSON.parse(msg.content.toString());
    onMessage(content);
    ch.ack(msg);
  });
};

const isConnected = () => channel !== null;

module.exports = {
  QUEUE_NAME,
  connect,
  publishMessage,
  startConsumer,
  isConnected,
};
