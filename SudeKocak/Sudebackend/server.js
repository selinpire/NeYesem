require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const routes = require("./app_api/routes/index");

const app = express();

app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("NeYesem API çalışıyor");
});

async function startServer() {
  try {
    await mongoose.connect("mongodb+srv://mekanbulUser:Neyesem123@cluster0.dqlktmq.mongodb.net/neyesem");
    console.log("MongoDB bağlantısı başarılı");

    app.listen(3000, () => {
      console.log("Server 3000 portunda çalışıyor");
    });
  } catch (err) {
    console.log("MongoDB bağlantı hatası:", err.message);
  }
}

startServer();