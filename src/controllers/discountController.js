import { DISCOUNT_QUERY, LOCALS_QUERY } from "../../query";
import { executeQuery } from "../server";

export const searchInCarNo = async (req, res) => {
  const { inCarNo } = req.body;
  const result = await executeQuery(DISCOUNT_QUERY.SEARCH_IN_CAR_NO(inCarNo));
  res.send({ result });
};

export const searchInSeqNo = async (req, res) => {
  const { inSeqNo } = req.body;
  console.log(inSeqNo);

  const result = await executeQuery(DISCOUNT_QUERY.SEARCH_IN_SEQ_NO(inSeqNo));
  res.send({ result });
};

export const main = async (req, res) => {
  res.render("discount/main", { pageTitle: "차량조회" });
};

export const history = (req, res) => {
  res.send("할인내역");
};
