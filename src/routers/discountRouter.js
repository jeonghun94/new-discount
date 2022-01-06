import express from "express";
import {
  history,
  main,
  searchInCarNo,
} from "../controllers/discountController";

const discountRouter = express.Router();
discountRouter.route("/main").get(main);
discountRouter.route("/search").post(searchInCarNo);
discountRouter.route("/history").get(history);

export default discountRouter;
