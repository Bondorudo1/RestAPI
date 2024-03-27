import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoUrl = process.env.MONGO_URL;

const app = express();

app.use(cors({ credentials: true }));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

mongoose
  .connect(mongoUrl, {
    serverSelectionTimeoutMS: 5000,
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to Mongo Database");
    app.listen(8081, () => {
      console.log("Server started on port 8081");
    });
  })
  .catch((err: Error) => {
    console.log(err);
  });
