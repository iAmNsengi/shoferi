import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import dbConnection from "./dbConfig/dbConnection.js";
import router from "./routes/index.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8800;

// MONGODB CONNECTION
dbConnection();

// middlewares
app.use(cors());
app.use(xss());
app.use(mongoSanitize());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.use(router);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shoferi.com API documentation",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:8800" }],
  },
  apis: ["./routes/*.js"],
};

//error middleware
app.use(errorMiddleware);

const spacs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spacs));

app.listen(PORT, () => {
  console.log(`Dev Server running on port: ${PORT}`);
});
