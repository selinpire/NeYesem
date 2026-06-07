const rabbitmqService = require("../services/rabbitmqService");

const getStatus = (req, res) => {
  res.json({
    connected: rabbitmqService.isConnected(),
    queue: rabbitmqService.QUEUE_NAME,
  });
};

const sendTestMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const message = {
      type: "test",
      text: text || "Merhaba RabbitMQ",
      sentAt: new Date().toISOString(),
    };

    const sent = await rabbitmqService.sendToQueue(message);

    if (!sent) {
      return res.status(503).json({
        message: "RabbitMQ baglantisi kurulamadi",
      });
    }

    res.status(200).json({
      message: "Mesaj kuyruga gonderildi",
      data: message,
    });
  } catch (error) {
    res.status(503).json({
      message: "RabbitMQ baglantisi kurulamadi",
      error: error.message,
    });
  }
};

module.exports = {
  getStatus,
  sendTestMessage,
};
