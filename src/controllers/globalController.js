import { LOCALS_QUERY, QUERY } from "../../query";
import { executeQuery } from "../server";

const cookieConfig = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 31 * 1000,
  // signed: true,
};

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

    console.log(id, password, saveUserInfo);

    if (result.length === 1) {
      // 로그인 성공
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

      console.log("Cookies: ", req.cookies);
      console.log(req.cookies.id);
      res.redirect("/discount/main");
    } else {
      // 로그인 실패
      res.render("login", { notValid: true });
    }
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

export const password = (req, res) => {
  res.send("비밀번호");
};

export const mypage = (req, res) => {
  res.send("마이페이지");
};

export const searchInCar = async (req, res) => {
  const result = await executeQuery(LOCALS_QUERY.SEARCH_IN_CAR());

  // result.map((x, idx) => {
  //   console.log(`${idx}: ${x.inCarNo}`);
  // });

  res.send({ result });
};
