const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user-routes");

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.use(cors());

app.use("/api/users", userRoutes);

mongoose
  .connect(
    "mongodb+srv://admin:Kj1jicLxxj5GGoHV@cluster0.qr5qn.mongodb.net/edil?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(port, () => console.log("listening..."));
  })
  .catch((err) => {
    console.log(err);
  });
