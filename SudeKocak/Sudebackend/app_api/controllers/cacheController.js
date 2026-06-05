const redisService = require("../services/redisService");

const getStatus = (req, res) => {
  res.json({
    connected: redisService.isConnected(),
  });
};

const setValue = async (req, res) => {
  try {
    const { key, value, ttl } = req.body;

    if (!key || value === undefined) {
      return res.status(400).json({ message: "key ve value zorunlu" });
    }

    if (ttl) {
      await redisService.setWithTTL(key, value, Number(ttl));
    } else {
      await redisService.set(key, value);
    }

    res.status(200).json({
      message: ttl ? "Veri TTL ile kaydedildi" : "Veri kaydedildi",
      key,
      value,
      ttl: ttl || null,
    });
  } catch (error) {
    res.status(503).json({
      message: "Redis baglantisi kurulamadi",
      error: error.message,
    });
  }
};

const getValue = async (req, res) => {
  try {
    const { key } = req.params;
    const value = await redisService.get(key);

    if (value === null) {
      return res.status(404).json({ message: "Anahtar bulunamadi", key });
    }

    res.status(200).json({ key, value });
  } catch (error) {
    res.status(503).json({
      message: "Redis baglantisi kurulamadi",
      error: error.message,
    });
  }
};

module.exports = {
  getStatus,
  setValue,
  getValue,
};
