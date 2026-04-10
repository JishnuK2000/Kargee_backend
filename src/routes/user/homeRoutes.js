import express from "express";
import { getCarousels, getHomeGrids } from "../../controllers/homeController.js";

const router = express.Router();

router.get("/carousel", getCarousels);
router.get("/4grid", getHomeGrids);

export default router;
