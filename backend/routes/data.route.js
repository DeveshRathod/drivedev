import { Router } from "express";
import { middleware } from "../utils/verifyUser.js";
import {
  addFile,
  createFolder,
  deleteFile,
  deleteFolder,
  getContent,
  getHome,
  search,
} from "../controllers/data.controller.js";

const router = Router();

router.post("/createFolder", middleware, createFolder);
router.delete("/deleteFolder", middleware, deleteFolder);
router.post("/addFile", middleware, addFile);
router.delete("/removeFile", middleware, deleteFile);
router.get("/homepage", middleware, getHome);
router.post("/getContent", middleware, getContent);
router.post("/search", middleware, search);

export default router;
