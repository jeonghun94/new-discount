import express from "express";
import { saleCoupon, saleCouponExcel } from "../controllers/adminController";
import { protectorMiddleware, uploadFiles } from "../middleware";

const adminRouter = express.Router();
adminRouter
  .route("/sale-coupon")
  .all(protectorMiddleware)
  .get(saleCoupon)
  .post(uploadFiles.single("file"), saleCoupon);
adminRouter
  .route("/sale-coupon/excel")
  .all(protectorMiddleware)
  .get(saleCouponExcel);
export default adminRouter;
