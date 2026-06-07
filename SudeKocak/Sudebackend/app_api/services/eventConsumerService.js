const rabbitmqService = require("./rabbitmqService");

const start = async () => {
  await rabbitmqService.startConsumer((event) => {
    console.log("[RabbitMQ Event]", JSON.stringify(event, null, 2));
  });
};

module.exports = {
  start,
};
