require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const routes = require("./app_api/routes/index");
//const aiRoutes = require("./app_api/routes/aiRoutes");

const app = express();

app.use(express.json());

// MongoDB bağlantısı
mongoose.connect("mongodb://127.0.0.1:27017/neyesem");

mongoose.connection.on("connected", () => {
  console.log("MongoDB bağlantısı başarılı");
});

// API routes
app.use("/api", routes);


app.get("/", (req, res) => {
  res.send("NeYesem API çalışıyor");
});

app.listen(3000, () => {
  console.log("Server 3000 portunda çalışıyor");
});