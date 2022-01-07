import { DISCOUNT_QUERY, LOCALS_QUERY } from "../../query";
import { camelizeKeys } from "../../util";
import { executeQuery } from "../server";

export const searchInCarNo = async (req, res) => {
  const { inCarNo } = req.body;

  const result = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_IN_CAR_NO(inCarNo)
  );

  res.send({ result });
};

export const main = async (req, res) => {
  const result = await executeQuery(LOCALS_QUERY.SEARCH_IN_CAR());

  // result.map((x) => {
  //   console.log(`${JSON.stringify(camelizeKeys(x))}`);
  // });

  result.map((x, idx) => {
    console.log(`${idx}: ${x.inCarNo}`);
  });

  res.render("discount/main", { pageTitle: "차량조회" });
};

export const history = (req, res) => {
  res.send("할인내역");
};
