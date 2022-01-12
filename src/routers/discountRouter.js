import express from "express";
import {
  deleteList,
  history,
  insertList,
  main,
  searchInCarNo,
  searchInSeqNo,
} from "../controllers/discountController";

const discountRouter = express.Router();
discountRouter.route("/main").get(main);
discountRouter.route("/list").post(insertList).delete(deleteList);
discountRouter.route("/search").post(searchInCarNo);
discountRouter.route("/search/inseqno").post(searchInSeqNo);
discountRouter.route("/history").get(history);

export default discountRouter;
