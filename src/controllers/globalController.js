import { LOCALS_QUERY } from "../query";
import { executeQuery, executeUpdate } from "../server";

const cookieConfig = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 31 * 1000,
  // signed: true,
};

// 정보 없을시 접근 제한
const renderPage = (level, res) => {
  if (level === "1") {
    res.render("home");
  } else {
    res.render("permission");
  }
};

export const postRenderHome = async (req, res) => {
  const { level } = req.params;
  renderPage(level, res);
};

export const getRenderHome = async (req, res) => {
  const { level } = req.params;
  renderPage(level, res);
};

// 로그인 처리
export const login = async (req, res) => {
  const { method } = req;

  if (method === "GET") {
    if (req.session.loggedIn) {
      res.redirect("/discount/main");
    } else {
      res.render("login");
    }
  } else if (method === "POST") {
    const { id, password, saveUserInfo } = req.body;
    const result = await executeQuery(
      LOCALS_QUERY.USER_LOGGED_IN(id, password)
    );

    if (result.length === 1) {
      // 로그인 성공
      // PCMS 동기화 안되어 임의값 설정
      result[0].shopDuplication =
        result[0].shopDuplication === null
          ? process.env.DEFAULT_SHOP_DUPLICATION
          : result[0].shopDuplication;

      result[0].timeLimitMinutes =
        result[0].timeLimitMinutes === null
          ? process.env.DEFAULT_TIME_LIMIT_MINUTES
          : result[0].timeLimitMinutes;
      result[0].timeLimit =
        result[0].timeLimit === null
          ? process.env.DEFAULT_TIME_LIMIT
          : result[0].timeLimit;

      result[0].freeCnt =
        result[0].freeCnt === null
          ? process.env.DEFAULT_FREE_CNT
          : result[0].freeCnt;
      result[0].maxCnt =
        result[0].maxCnt === null
          ? process.env.DEFAULT_MAX_CNT
          : result[0].maxCnt;
      result[0].payCnt =
        result[0].payCnt === null
          ? process.env.DEFAULT_PAY_CNT
          : result[0].payCnt;
      req.session.user = result[0];
      req.session.loggedIn = true;

      if (saveUserInfo === "on") {
        res.cookie("saveUserInfo", "checked", cookieConfig);
        res.cookie("password", password, cookieConfig);
        res.cookie("id", id, cookieConfig);
      } else {
        res.clearCookie("saveUserInfo");
        res.clearCookie("password");
        res.clearCookie("id");
      }

      // res.redirect("/admin/discount/user-auth");
      // res.redirect("/admin/discount/user-coupon-auth");
      // res.redirect("/admin/setting-account");
      res.redirect("/discount/main");
      console.log(`USER LOGIN ${req.session.user.shopName}`);
    } else {
      // 로그인 실패
      res.render("login", { notValid: true });
    }
  }
};

// 마이페이지
export const mypage = async (req, res) => {
  const { shopCode } = req.session.user;
  let result = await executeQuery(
    LOCALS_QUERY.USER_COUPON_STOCK_INFO({ shopCode })
  );

  if (result.length === 0) {
    const obj = {
      shopCode,
      nullCheck: true,
    };
    result = await executeQuery(LOCALS_QUERY.USER_COUPON_STOCK_INFO(obj));
  }

  res.render("user/mypage", { pageTitle: "마이 페이지", result });
};

// 암호변경
export const password = async (req, res) => {
  const {
    method,
    body: { oldPassword, newPassword },
    session: {
      user: { shopCode, pwd },
    },
  } = req;
  if (method === "GET") {
    res.render("user/password", { pageTitle: "암호 변경" });
  } else if (method === "PUT") {
    if (oldPassword !== pwd) {
      res.status(400);
      res.send(
        JSON.stringify({
          result: "fail",
          msg: "현재 비밀번호가 일치하지 않습니다.",
        })
      );
    } else {
      try {
        await executeUpdate(
          LOCALS_QUERY.USER_PASSWORD_UPDATE(shopCode, newPassword)
        );
        res.status(200);
        res.send(JSON.stringify({ result: "success" }));
      } catch (error) {
        res.send(JSON.stringify({ result: "fail", msg: "DB 실행 오류" }));
      }
    }
  }
};

// 로그아웃
export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

// 관리자 계정일시 테스트 차량 검색
export const searchInCar = async (req, res) => {
  const level = Number(req.session.user.authLevel);

  if (level === 0 || level === 1) {
    const result = await executeQuery(LOCALS_QUERY.SEARCH_IN_CAR());
    res.send({ result });
  } else {
    res.send({ result: [] });
  }
};

// 익스플로러 접속 차단
export const notSupport = (req, res) => {
  res.render("not-support");
};
