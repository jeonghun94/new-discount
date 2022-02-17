import express from "express";
import {
  main,
  searchInCarNo,
  searchInSeqNo,
  insertList,
  deleteList,
  history,
  historyExcel,
} from "../controllers/discountController";

const discountRouter = express.Router();
discountRouter.route("/main").get(main);
discountRouter.route("/list").post(insertList).delete(deleteList);
discountRouter.route("/search").post(searchInCarNo);
discountRouter.route("/search/inseqno").post(searchInSeqNo);
discountRouter.route("/history").get(history).post(history);
discountRouter.route("/history/excel").get(historyExcel);

export default discountRouter;
