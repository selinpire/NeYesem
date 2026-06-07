const amqp = require("amqplib");

const QUEUE_NAME = "neyesem.events";

let connection = null;
let channel = null;

const getRabbitUrl = () => {
  return (
    process.env.RABBITMQ_URL ||
    `amqp://${process.env.RABBITMQ_USER || "guest"}:${process.env.RABBITMQ_PASS || "guest"}@${process.env.RABBITMQ_HOST || "localhost"}:${process.env.RABBITMQ_PORT || "5672"}`
  );
};

const connect = async () => {
  if (channel) return channel;

  try {
    connection = await amqp.connect(getRabbitUrl());
    channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log("RabbitMQ baglantisi basarili");
    return channel;
  } catch (err) {
    console.log("RabbitMQ baglantisi kurulamadi:", err.message);
    return null;
  }
};

const sendToQueue = async (message) => {
  try {
    const ch = await connect();
    if (!ch) return false;

    const payload = Buffer.from(JSON.stringify(message));
    ch.sendToQueue(QUEUE_NAME, payload, { persistent: true });
    return true;
  } catch (err) {
    console.log("RabbitMQ mesaj gonderilemedi:", err.message);
    return false;
  }
};

const startConsumer = async (onMessage) => {
  try {
    const ch = await connect();
    if (!ch) return;

    await ch.consume(QUEUE_NAME, (msg) => {
      if (!msg) return;

      try {
        const content = JSON.parse(msg.content.toString());
        onMessage(content);
      } catch (err) {
        console.log("RabbitMQ mesaj islenemedi:", err.message);
      }

      ch.ack(msg);
    });
  } catch (err) {
    console.log("RabbitMQ consumer baslatilamadi:", err.message);
  }
};

const isConnected = () => channel !== null;

module.exports = {
  QUEUE_NAME,
  connect,
  sendToQueue,
  startConsumer,
  isConnected,
};
