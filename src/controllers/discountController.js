import { DISCOUNT_QUERY, LOCALS_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";

export const searchInCarNo = async (req, res) => {
  const { inCarNo } = req.body;
  const result = await executeQuery(DISCOUNT_QUERY.SEARCH_IN_CAR_NO(inCarNo));
  res.send({ result });
};

export const searchInSeqNo = async (req, res) => {
  const { inSeqNo } = req.body;

  const result = await executeQuery(DISCOUNT_QUERY.SEARCH_IN_SEQ_NO(inSeqNo));
  const freeCouponList = await executeQuery(DISCOUNT_QUERY.SEARCH_FREE_COUPON);
  const payCouponList = await executeQuery(DISCOUNT_QUERY.SEARCH_PAY_COUPON);
  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );
  res.send({ result, freeCouponList, payCouponList, discountList });
};

export const deleteList = async (req, res) => {
  const { idx, inSeqNo } = req.body;

  await executeUpdate(DISCOUNT_QUERY.DELETE_LIST(idx));
  console.log(`DELETE PS134 ${JSON.stringify(req.body)}`);

  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );

  res.send({ result: "success", list: discountList });
};

export const insertList = async (req, res) => {
  const { inSeqNo, couponType } = req.body;
  const { shopCode } = req.session.user;
  const obj = {
    shopCode,
    inSeqNo,
    couponType,
  };

  await executeUpdate(DISCOUNT_QUERY.INSERT_LIST(obj));
  console.log(`INSERT PS134 ${JSON.stringify(req.body)}`);

  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );

  res.send({ result: "success", list: discountList });
};

export const main = async (req, res) => {
  res.render("discount/main", { pageTitle: "할인 등록" });
};

export const history = (req, res) => {
  res.render("discount/history", { pageTitle: "할인 내역" });
};
