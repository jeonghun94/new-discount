import express from "express";
import {
  main,
  searchInCarNo,
  searchInSeqNo,
  insertList,
  deleteList,
  history,
  historyExcel,
  main2,
  saleCouponExcel,
} from "../controllers/discountController";
import { protectorMiddleware, uploadFiles } from "../middleware";

const discountRouter = express.Router();
discountRouter.route("/main").all(protectorMiddleware).get(main);
discountRouter
  .route("/main2")
  .all(protectorMiddleware)
  .get(main2)
  .post(uploadFiles.single("saleCoupon"), saleCouponExcel);
discountRouter
  .route("/list")
  .all(protectorMiddleware)
  .post(insertList)
  .delete(deleteList);
discountRouter.route("/search").all(protectorMiddleware).post(searchInCarNo);
discountRouter
  .route("/search/inseqno")
  .all(protectorMiddleware)
  .post(searchInSeqNo);
discountRouter
  .route("/history")
  .all(protectorMiddleware)
  .get(history)
  .post(history);
discountRouter
  .route("/history/excel")
  .all(protectorMiddleware)
  .get(historyExcel);

export default discountRouter;
