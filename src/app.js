import "dotenv/config";

import express from "express";
import routes from "./routes";

import "./database";

const app = express();

app.use(express.json());

app.use(routes);

const server = require("http").createServer(app);

export default server;
