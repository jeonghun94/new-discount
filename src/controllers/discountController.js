import { DISCOUNT_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";
import { excelDownload } from "../util";

export const main = async (req, res) => {
  // const { user } = req.session;
  // console.log(user);
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

  const {
    shopDuplication,
    timeLimit,
    timeLimitMinutes,
    maxCnt,
    freeCnt: shopFreeCnt,
    payCnt: shopPayCnt,
  } = req.session.user;

  if (shopDuplication === "Y") {
  }

  // #########################################제약조건#########################################
  const result = await executeQuery(DISCOUNT_QUERY.CONDITION_CHECK(obj));

  const { payType, couponCnt, totalDcVal, totalCnt, freeCnt, payCnt } =
    result[0];

  console.log("설정값:", timeLimitMinutes, maxCnt, shopFreeCnt, shopPayCnt);
  console.log(
    "디비값",
    totalDcVal,
    totalCnt,
    freeCnt,
    payCnt,
    payType,
    couponCnt
  );

  // 분 단위 제한 확인 및 처리
  if (timeLimit === "Y") {
    if (totalDcVal > timeLimitMinutes) {
      res.send({
        result: "fail",
        msg: `할인등록을 못했습니다.\n사유: 최대 할인 시간(${timeLimitMinutes}분)을 초과합니다.`,
      });
      return;
    }
  }

  if (totalCnt >= maxCnt) {
    res.send({
      result: "fail",
      msg: `할인등록을 못했습니다.\n사유: 최대 가능 할인 횟수(${maxCnt}회)를 초과합니다.`,
    });
    return;
  }

  // 쿠폰 타입 검사
  if (payType === "01") {
    if (freeCnt >= shopFreeCnt) {
      res.send({
        result: "fail",
        msg: `할인등록을 못했습니다.\n사유: 무료 가능 할인 횟수(${shopFreeCnt}회)를 초과합니다.`,
      });
      return;
    }
  } else {
    if (couponCnt <= 0) {
      res.send({
        result: "fail",
        msg: `할인등록을 못했습니다.\n사유: 보유한 할인권 수량이 없습니다.`,
      });
      return;
    }

    if (payCnt >= shopPayCnt) {
      res.send({
        result: "fail",
        msg: `할인등록을 못했습니다.\n사유: 유료 가능 할인 횟수(${shopPayCnt}회)를 초과합니다.`,
      });
      return;
    }
  }

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
