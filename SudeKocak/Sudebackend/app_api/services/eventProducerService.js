const rabbitmqService = require("./rabbitmqService");

const EVENT_TYPES = {
  USER_REGISTERED: "USER_REGISTERED",
  USER_LOGIN: "USER_LOGIN",
  FAVORITE_ADDED: "FAVORITE_ADDED",
};

const publishEvent = async (eventType, data) => {
  const event = {
    type: eventType,
    ...data,
    createdAt: data.createdAt || new Date().toISOString(),
  };

  try {
    const sent = await rabbitmqService.sendToQueue(event);
    if (!sent) {
      console.log(`Event gonderilemedi [${eventType}]`);
    }
  } catch (err) {
    console.log(`Event gonderilemedi [${eventType}]:`, err.message);
  }
};

module.exports = {
  EVENT_TYPES,
  publishEvent,
};
