import { DISCOUNT_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";
import { excelDownload } from "../util";

export const main = async (req, res) => {
  res.render("discount/main", { pageTitle: "할인 등록" });
};

// 키패드 테스트
export const main2 = async (req, res) => {
  res.render("discount/main2", { pageTitle: "할인 등록" });
};

// 차량번호 4자리 조회
export const searchInCarNo = async (req, res) => {
  const { inCarNo } = req.body;
  const result = await executeQuery(DISCOUNT_QUERY.SEARCH_IN_CAR_NO(inCarNo));
  res.send({ result });
};

// 차량의 정보, 할인권 정보, 할인내역 조회
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

// 할인 등록
export const insertList = async (req, res) => {
  const obj = {
    ...req.session.user,
    ...req.body,
  };

  console.log(process.env.MAX_CNT);
  console.log(process.env.FREE_CNT);
  console.log(process.env.PAY_CNT);
  console.log(process.env.TIME_LIMIT_USE);
  console.log(process.env.TIME_LIMIT_MINUTE);

  await executeUpdate(DISCOUNT_QUERY.INSERT_LIST(obj));
  console.log(`INSERT PS134 ${JSON.stringify(req.body)}`);

  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(obj.inSeqNo)
  );

  res.send({ result: "success", list: discountList });
};

// 할인 삭제
export const deleteList = async (req, res) => {
  const { idx, inSeqNo } = req.body;

  await executeUpdate(DISCOUNT_QUERY.DELETE_LIST(idx));
  console.log(`DELETE PS134 ${JSON.stringify(req.body)}`);

  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );

  res.send({ result: "success", list: discountList });
};

// 할인 내역
export const history = async (req, res) => {
  const { method } = req;

  if (method === "POST") {
    const obj = {
      ...req.session.user,
      ...req.body,
    };

    const result = await executeQuery(
      DISCOUNT_QUERY.SEARCH_DISCOUNT_HISTORY(obj)
    );

    console.log(`HISTORY PS134 ${JSON.stringify(req.body)}`);
    res.send({ result });
  } else {
    res.render("discount/history", { pageTitle: "할인 내역" });
  }
};

// 할인 내역 엑셀 다운로드
export const historyExcel = async (req, res) => {
  const obj = {
    ...req.query,
    shopCode: req.session.user.shopCode,
    header: (style) => [
      { header: "차량번호", key: "inCarNo", width: 15 },
      {
        header: "주차시간",
        key: "totParkTime",
        width: 15,
        style: { alignment: { horizontal: "left" } },
      },
      { header: "할인종류", key: "dcName", width: 15 },
      {
        header: "할인일시",
        key: "dcTime",
        width: 20,
        style,
      },
      {
        header: "입차일시",
        key: "inTime",
        width: 20,
        style,
      },
      {
        header: "출차일시",
        key: "outTime",
        width: 20,
        style,
      },
    ],
    fileName: "웹할인내역",
  };

  const data = await executeQuery(DISCOUNT_QUERY.SEARCH_DISCOUNT_HISTORY(obj));
  await excelDownload(res, obj, data);
  console.log(`HISTORY EXCEL PS134 ${JSON.stringify(req.query)}`);
};
