import moment from "moment";
import { async } from "regenerator-runtime";
import { DISCOUNT_QUERY, LOCALS_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";
import { checkHoliday, excelDownload, excelUpload } from "../util";

const PAY_AFTER = process.env.PAY_AFTER;

export const main = async (req, res) => {
  res.render("discount/main", { pageTitle: "할인 등록" });
};

// 키패드 테스트
export const main2 = async (req, res) => {
  res.render("discount/main2", { pageTitle: "할인 등록" });
};

export const saleCouponExcel = async (req, res) => {
  const {
    file,
    session: { user },
  } = req;

  try {
    excelUpload(file.originalname, user);
    res.redirect("/discount/main2");
  } catch (error) {
    res.send(error.message);
  }
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
  const holidayCoupons = checkHoliday(
    moment(result[0].procDate).format("YYYY-MM-DD")
  );

  let freeCouponList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_FREE_COUPON({ ...req.session.user, holidayCoupons })
  );
  let payCouponList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_PAY_COUPON({ ...req.session.user, holidayCoupons })
  );
  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
  );

  if (freeCouponList.length === 0) {
    freeCouponList = await executeQuery(
      DISCOUNT_QUERY.SEARCH_FREE_COUPON({
        ...req.session.user,
        nullCheck: true,
        holidayCoupons,
      })
    );
  }

  if (payCouponList.length === 0) {
    payCouponList = await executeQuery(
      DISCOUNT_QUERY.SEARCH_PAY_COUPON({
        ...req.session.user,
        nullCheck: true,
        holidayCoupons,
      })
    );
  }

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

  const carInfo = await executeQuery(
    DISCOUNT_QUERY.SEARCH_IN_SEQ_NO(req.body.inSeqNo)
  );
  const holidayCoupons = checkHoliday(
    moment(carInfo[0].procDate).format("YYYY-MM-DD")
  );

  // 타 매장 중복 여부 확인
  // if (shopDuplication === "Y") {
  // }

  const parkingLotDayLimit = process.env.DAY_LIMIT;
  const parkingLotDayLimitCnt = process.env.DAY_LIMIT_CNT;

  // 현재 할인을 등록할 차량에 등록된 할인 정보
  const result = await executeQuery(DISCOUNT_QUERY.CONDITION_CHECK(obj));
  const {
    payType,
    couponCnt,
    totalDcVal,
    totalCnt,
    freeCnt,
    payCnt,
    dayLimitCnt,
    inCouponCnt,
    settingCouponCnt,
  } = result[0];

  if (parkingLotDayLimit === "Y") {
    if (dayLimitCnt >= parkingLotDayLimitCnt) {
      res.send({
        result: "fail",
        msg: "오늘 기존 입/출차한 정보에 적용된 할인내역이 있습니다.\n추가 할인은 불가 합니다.",
      });
      return;
    }
  }

  if (settingCouponCnt != null && inCouponCnt >= settingCouponCnt) {
    res.send({
      result: "fail",
      msg: `이 할인권은 ${settingCouponCnt}번까지만 사용 가능합니다.\n추가 할인은 불가 합니다.`,
    });
    return;
  }

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

  // 쿠폰 타입 검사 무료시 pass 유료시 잔고 확인
  if (payType === "01") {
    if (freeCnt >= shopFreeCnt) {
      res.send({
        result: "fail",
        msg: `할인등록을 못했습니다.\n사유: 무료 가능 할인 횟수(${shopFreeCnt}회)를 초과합니다.`,
      });
      return;
    }
  } else {
    // 유료권 타입일 경우
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

    if (PAY_AFTER === "N" && payType === "02") {
      await executeUpdate(DISCOUNT_QUERY.UPDATE_COUPON_CNT(obj));
    }
  }

  await executeUpdate(DISCOUNT_QUERY.INSERT_LIST(obj));

  const discountList = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(obj.inSeqNo)
  );

  let payCouponList =
    payType === "01"
      ? await executeQuery(
          DISCOUNT_QUERY.SEARCH_FREE_COUPON({
            ...req.session.user,
            holidayCoupons,
          })
        )
      : await executeQuery(
          DISCOUNT_QUERY.SEARCH_PAY_COUPON({
            ...req.session.user,
            holidayCoupons,
          })
        );

  console.log("payCouponList", payCouponList);

  if (payCouponList.length === 0) {
    payCouponList =
      payType === "01"
        ? await executeQuery(
            DISCOUNT_QUERY.SEARCH_FREE_COUPON({
              ...req.session.user,
              nullCheck: true,
              holidayCoupons,
            })
          )
        : await executeQuery(
            DISCOUNT_QUERY.SEARCH_PAY_COUPON({
              ...req.session.user,
              nullCheck: true,
              holidayCoupons,
            })
          );
  }

  console.log("payCouponList 아래", payCouponList);

  res.send({ result: "success", list: discountList, payCouponList, payType });
};

// 할인 삭제
export const deleteList = async (req, res) => {
  const {
    body: { idx, inSeqNo, couponType },
    session: {
      user: { shopCode },
    },
  } = req;

  const carInfo = await executeQuery(
    DISCOUNT_QUERY.SEARCH_IN_SEQ_NO(req.body.inSeqNo)
  );
  const holidayCoupons = checkHoliday(
    moment(carInfo[0].procDate).format("YYYY-MM-DD")
  );

  const [{ payType }] = await executeQuery(
    LOCALS_QUERY.SEARCH_PAY_TYPE(couponType)
  );

  const [{ registerCode }] = await executeQuery(
    DISCOUNT_QUERY.SEARCH_DISCOUNT_REGISTER_CODE(idx)
  );

  console.log(`{ registerCode: ${registerCode}, shopCode: ${shopCode} }`);

  if (shopCode !== registerCode) {
    res.send({
      result: "fail",
      msg: "다른 사용자의 할인은 삭제할 수 없습니다.",
    });
  } else {
    await executeUpdate(DISCOUNT_QUERY.DELETE_LIST(idx));
    console.log(`DELETE PS134 ${JSON.stringify(req.body)}`);
    if (PAY_AFTER === "N" && payType === "02") {
      await executeUpdate(
        DISCOUNT_QUERY.UPDATE_COUPON_CNT({
          ...req.body,
          shopCode,
        })
      );
    }

    const discountList = await executeQuery(
      DISCOUNT_QUERY.SEARCH_DISCOUNT_LIST(inSeqNo)
    );

    let payCouponList =
      payType === "01"
        ? await executeQuery(
            DISCOUNT_QUERY.SEARCH_FREE_COUPON({
              ...req.session.user,
              holidayCoupons,
            })
          )
        : await executeQuery(
            DISCOUNT_QUERY.SEARCH_PAY_COUPON({
              ...req.session.user,
              holidayCoupons,
            })
          );
    if (payCouponList.length === 0) {
      payCouponList =
        payType === "01"
          ? await executeQuery(
              DISCOUNT_QUERY.SEARCH_FREE_COUPON({
                ...req.session.user,
                nullCheck: true,
                holidayCoupons,
              })
            )
          : await executeQuery(
              DISCOUNT_QUERY.SEARCH_PAY_COUPON({
                ...req.session.user,
                nullCheck: true,
                holidayCoupons,
              })
            );
    }

    res.send({ result: "success", list: discountList, payCouponList, payType });
  }
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

export const exchange = async (req, res) => {
  const coupons = await executeQuery(
    DISCOUNT_QUERY.SEARCH_PAY_COUPON(req.session.user)
  );

  console.log(coupons);

  res.render("discount/exchange", { pageTitle: "할인권 교환", coupons });
};
