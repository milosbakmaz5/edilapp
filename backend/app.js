const fs = require("fs");
const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const { getFileStream } = require("./util/s3");

const userRoutes = require("./routes/user-routes");
const supplierRoutes = require("./routes/supplier-routes");
const itemRoutes = require("./routes/item-routes");
const HttpError = require("./models/http-error");

const app = express();
const port = 5000;

app.use(bodyParser.json());

// app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.get("/uploads/images/:key", (req, res, next) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/users", userRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/items", itemRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {});
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qr5qn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    app.listen(process.env.PORT || port, () => console.log("listening..."));
  })
  .catch((err) => {
    console.log(err);
  });
