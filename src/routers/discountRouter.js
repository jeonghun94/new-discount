<<<<<<< HEAD
import express from "express";
import {
  main,
  searchInCarNo,
  searchInSeqNo,
  insertList,
  deleteList,
  history,
  historyExcel,
  exchange,
} from "../controllers/discountController";

const discountRouter = express.Router();
discountRouter.route("/main").get(main);
discountRouter.route("/list").post(insertList).delete(deleteList);
discountRouter.route("/search").post(searchInCarNo);
discountRouter.route("/search/inseqno").post(searchInSeqNo);
discountRouter.route("/history").get(history).post(history);
discountRouter.route("/history/excel").get(historyExcel);
discountRouter.route("/exchange").get(exchange);

export default discountRouter;
=======
import express from "express";
import {
  main,
  searchInCarNo,
  searchInSeqNo,
  insertList,
  deleteList,
  history,
  historyExcel,
  exchange,
} from "../controllers/discountController";

const discountRouter = express.Router();
discountRouter.route("/main").get(main);
discountRouter.route("/list").post(insertList).delete(deleteList);
discountRouter.route("/search").post(searchInCarNo);
discountRouter.route("/search/inseqno").post(searchInSeqNo);
discountRouter.route("/history").get(history).post(history);
discountRouter.route("/history/excel").get(historyExcel);
discountRouter.route("/exchange").get(exchange);

export default discountRouter;
>>>>>>> c9d84b091ea547458fa74f9e2f81790c122b25bd
