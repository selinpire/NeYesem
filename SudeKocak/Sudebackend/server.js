require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./app_api/routes/index");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));

const MONGODB_URI = "mongodb+srv://asy:asy@cluster0.wtlbjp0.mongodb.net/neysem";

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log("MongoDB bağlantısı başarılı");
  } catch (err) {
    console.log("MongoDB bağlantı hatası:", err.message);
    throw err;
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: "Veritabanı bağlantı hatası" });
  }
});

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
