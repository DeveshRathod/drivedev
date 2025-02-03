import { Router } from "express";
import { checkMe, signin, signup } from "../controllers/user.controller.js";
import { middleware } from "../utils/verifyUser.js";

const router = Router();

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/checkMe", middleware, checkMe);

export default router;
