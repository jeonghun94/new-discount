import express from "express";
import { saleCoupon } from "../controllers/adminController";
import { protectorMiddleware, uploadFiles } from "../middleware";

const adminRouter = express.Router();
adminRouter
  .route("/sale-coupon")
  .all(protectorMiddleware)
  .get(saleCoupon)
  .post(uploadFiles.single("file"), saleCoupon);
export default adminRouter;
