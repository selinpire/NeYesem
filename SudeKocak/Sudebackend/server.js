require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./app_api/routes/index");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
// Base64 tarif görseli JSON ile gönderildiği için limit yükseltilir (varsayılan ~100kb → 413)
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("NeYesem API çalışıyor");
});

async function startServer() {
  try {
    await mongoose.connect("mongodb+srv://asy:asy@cluster0.wtlbjp0.mongodb.net/neysem");
    //mongodb+srv://mekanbulUser:Neyesem123@cluster0.dqlktmq.mongodb.net/neyesem

    console.log("MongoDB bağlantısı başarılı");

    app.listen(3000, () => {
      console.log("Server 3000 portunda çalışıyor");
    });
  } catch (err) {
    console.log("MongoDB bağlantı hatası:", err.message);
  }
}

startServer();