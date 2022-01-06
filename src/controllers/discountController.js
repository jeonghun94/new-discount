import { DISCOUNT_QUERY } from "../../query";
import { executeQuery } from "../server";

export const searchInCarNo = async (req, res) => {
  const { inCarNo } = req.body;
  console.log(inCarNo);
  const result = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_IN_CAR_NO(inCarNo)
  );

  res.send({ result });
};

export const main = (req, res) => {
  res.render("discount/main", { pageTitle: "차량조회" });
};

export const history = (req, res) => {
  res.send("할인내역");
};
