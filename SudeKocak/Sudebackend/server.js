require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./app_api/routes/index");

const app = express();

app.use(cors());
app.options("*", cors());

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));

const MONGODB_URI = "mongodb+srv://asy:asy@cluster0.wtlbjp0.mongodb.net/neysem";

let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGODB_URI);
  cachedDb = mongoose.connection;
  console.log("MongoDB bağlantısı başarılı");
}

connectDB().catch((err) => console.log("İlk bağlantı hatası:", err.message));

app.get("/", (req, res) => {
  res.send("NeYesem API çalışıyor");
});

app.use("/api", routes);

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server 3000 portunda çalışıyor");
  });
}

module.exports = app;
