require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./app_api/routes/index");
const eventConsumerService = require("./app_api/services/eventConsumerService");
const redisService = require("./app_api/services/redisService");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));

const MONGODB_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb+srv://asy:asy@cluster0.wtlbjp0.mongodb.net/neysem";

const PORT = process.env.PORT || 3000;

let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
  cachedDb = mongoose.connection;
  console.log("MongoDB bağlantısı başarılı");
}

connectDB().catch((err) => console.log("İlk bağlantı hatası:", err.message));

async function startRabbitMQ() {
  await eventConsumerService.start();
}

async function startRedis() {
  try {
    await redisService.connect();
  } catch (err) {
    console.log("Redis baglantisi kurulamadi:", err.message);
  }
}

app.get("/", (req, res) => {
  res.send("NeYesem API çalışıyor");
});

app.use("/api", routes);

if (!process.env.VERCEL) {
  startRabbitMQ();
  startRedis();
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
  });
}

module.exports = app;
