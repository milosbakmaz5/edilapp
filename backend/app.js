const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/user-routes");
const HttpError = require("./models/http-error");

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.use(cors());

app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured!" });
});

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
