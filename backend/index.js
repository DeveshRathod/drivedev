import express from "express";
import { connect } from "./database/connection.js";
import userRouter from "../backend/routes/user.route.js";
import folderRouter from "./routes/data.route.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

//DB connection
connect();

//init express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
app.use(cors());

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/data", folderRouter);

//server
app.listen(3000, () => {
  console.log("server running");
});
