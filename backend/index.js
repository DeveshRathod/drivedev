import express from "express";
import { connect } from "./database/connection.js";
import userRouter from "../backend/routes/user.route.js";
import folderRouter from "./routes/data.route.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

//DB connection
connect();

const __dirname = path.resolve();

//init express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//cors
app.use(cors());

//server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

//routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/data", folderRouter);

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
});
