import "dotenv/config";
import path from "path";
import express from "express";
import cors from "cors";
import routes from "./routes";

import "./database";

const app = express();

app.use(cors());

app.use(express.json());

app.use(
  "/attachments",
  express.static(path.resolve(__dirname, "..", "tmp", "uploads"))
);

app.use(routes);

const server = require("http").createServer(app);

export default server;
