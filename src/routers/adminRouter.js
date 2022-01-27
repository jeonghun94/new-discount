import express from "express";
import { saleCoupon } from "../controllers/adminController";
import { protectorMiddleware, uploadFiles } from "../middleware";

const adminRouter = express.Router();
adminRouter
  .route("/sale-coupon")
  .all(protectorMiddleware)
  .get(saleCoupon)
  .post(saleCoupon);
// masterRouter
//   .route("/sale-coupon")
//   .all(protectorMiddleware)
//   .get(main2)
//   .post(uploadFiles.single("saleCoupon"), saleCouponExcel);

export default adminRouter;
