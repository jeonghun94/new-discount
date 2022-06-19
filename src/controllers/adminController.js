import { ADMIN_QUERY, DISCOUNT_QUERY, LOCALS_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";
import { excelDownload, excelSaleCoupon, excelUpload } from "../util";

export const saleCoupon = async (req, res) => {
  const { method } = req;
  let resultMessage;

  if (method === "POST") {
    const {
      file,
      session: { user },
      body,
    } = req;

    if (file === undefined) {
      await executeUpdate(
        DISCOUNT_QUERY.ADD_DISCOUNT_COUPON({ ...user, ...body })
      );
      await executeUpdate(
        DISCOUNT_QUERY.ADD_DISCOUNT_COUPON_HISTORY({ ...user, ...body })
      );
    } else {
      console.log(file);
      const list = await excelUpload(file.originalname, user);
      console.log(list);
      resultMessage = await excelSaleCoupon(list, user);
    }

    const saleCouponList = await executeQuery(
      ADMIN_QUERY.SALE_COUPON_LIST({ ...body })
    );

    res.send({ saleCouponList, resultMessage });
  } else if (method === "GET") {
    const { type } = req.query;
    const saleCouponList = await executeQuery(
      ADMIN_QUERY.SALE_COUPON_LIST({ ...req.query })
    );
    const payCouponList = await executeQuery(
      DISCOUNT_QUERY.SEARCH_PAY_COUPON()
    );
    const shopList = await executeQuery(LOCALS_QUERY.USER_LIST);
    const tableHead = [
      "매장명",
      "할인권명",
      "등록개수",
      "등록금액",
      "등록일시",
    ];

    if (type === undefined) {
      res.render("admin/sale-coupon", {
        pageTitle: "관리자",
        saleCouponList,
        payCouponList,
        shopList,
        tableHead,
      });
    } else {
      res.send({ saleCouponList });
    }
  }
};

// 할인 내역 엑셀 다운로드
export const saleCouponExcel = async (req, res) => {
  const obj = {
    ...req.query,
    shopCode: req.session.user.shopCode,
    header: (style) => [
      { header: "매장명", key: "shopName", width: 20 },
      {
        header: "할인권명",
        key: "dcName",
        width: 15,
        style: { alignment: { horizontal: "left" } },
      },
      { header: "등록개수", key: "saleCouponQty", width: 15 },
      {
        header: "등록금액",
        key: "saleCouponAmt",
        width: 20,
        style,
      },
      {
        header: "출차일시",
        key: "insDate",
        width: 20,
        style,
      },
    ],
    fileName: "할인권판매내역",
  };
  const data = await executeQuery(
    ADMIN_QUERY.SALE_COUPON_LIST({ ...req.query })
  );
  await excelDownload(res, obj, data);
  console.log(`HISTORY EXCEL PS131 ${JSON.stringify(req.query)}`);
};

export const settingAccount = async (req, res) => {
  const tableHead = [
    "사용자",
    "전화번호",
    "아이디",
    "비밀번호",
    "등록일시",
    "수정일시",
  ];
  const userList = await executeQuery(ADMIN_QUERY.USER_LIST());

  res.render("admin/setting-account", { tableHead, userList });
};

export const userAuth = async (req, res) => {
  const {
    method,
    query: { shopCode, search },
  } = req;

  if (method === "GET") {
    const users = await executeQuery(LOCALS_QUERY.USER_LIST);
    const usersAuth = await executeQuery(ADMIN_QUERY.USERS_AUTH(shopCode));

    if (search === "Y") {
      return res.send(usersAuth);
    }

    const tableHead = [
      "매장 명",
      "타 매장 중복",
      "시간 제한",
      "시간 제한 분",
      "총 할인 수",
      "무료 할인 수",
      "유료 할인 수",
      "수정일시",
    ];

    res.render("admin/discount/user-auth", {
      pageTitle: "관리자",
      tableHead,
      usersAuth,
      users,
    });
  } else if (method === "POST") {
    const {
      shopCode,
      shopDuplication,
      timeLimit,
      timeLimitMinutes,
      maxCnt,
      freeCnt,
      payCnt,
    } = req.body;

    console.log(shopCode);

    for (let i = 0; i < shopCode.length; i++) {
      await executeUpdate(
        ADMIN_QUERY.USERS_AUTH_UPDATE({
          shopCode: shopCode[i],
          shopDuplication,
          timeLimit,
          timeLimitMinutes,
          maxCnt,
          freeCnt,
          payCnt,
          updId: req.session.user.userId,
        })
      );
      console.log(`${shopCode[i]} 업데이트 완료`);
    }

    const usersAuth = await executeQuery(ADMIN_QUERY.USERS_AUTH());
    return res.send(usersAuth);
  }
};

export const userCouponAuth = async (req, res) => {
  const {
    method,
    query: { shopCode, search },
  } = req;

  if (method === "GET") {
    const users = await executeQuery(LOCALS_QUERY.USER_LIST);
    const usersAuth = await executeQuery(ADMIN_QUERY.USERS_AUTH(shopCode));

    if (search === "Y") {
      return res.send(usersAuth);
    }

    const tableHead = [
      "매장 명",
      "타 매장 중복",
      "시간 제한",
      "시간 제한 분",
      "총 할인 수",
      "무료 할인 수",
      "유료 할인 수",
      "수정일시",
    ];

    res.render("admin/discount/user-auth", {
      pageTitle: "관리자",
      tableHead,
      usersAuth,
      users,
    });
  } else if (method === "POST") {
    const {
      shopCode,
      shopDuplication,
      timeLimit,
      timeLimitMinutes,
      maxCnt,
      freeCnt,
      payCnt,
    } = req.body;

    console.log(shopCode);

    for (let i = 0; i < shopCode.length; i++) {
      await executeUpdate(
        ADMIN_QUERY.USERS_AUTH_UPDATE({
          shopCode: shopCode[i],
          shopDuplication,
          timeLimit,
          timeLimitMinutes,
          maxCnt,
          freeCnt,
          payCnt,
          updId: req.session.user.userId,
        })
      );
      console.log(`${shopCode[i]} 업데이트 완료`);
    }

    const usersAuth = await executeQuery(ADMIN_QUERY.USERS_AUTH());
    return res.send(usersAuth);
  }
};
