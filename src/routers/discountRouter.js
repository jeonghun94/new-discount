import express from "express";
import { history, main } from "../controllers/discountController";

const discountRouter = express.Router();
discountRouter.route("/main").get(main);
discountRouter.route("/history").get(history);

export default discountRouter;
