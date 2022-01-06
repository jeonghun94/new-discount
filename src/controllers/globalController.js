import { QUERY } from "../../query";
import { executeQuery } from "../server";

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

export const login = (req, res) => {
  const { method } = req;
  console.log(method);

  if (method === "GET") {
    res.render("login");
  } else if (method === "POST") {
    const { id, password } = req.body;
    console.log(id, password);
    res.redirect("/discount/main");
  }
};

export const logout = (req, res) => {
  res.send("로그아웃");
};

export const password = (req, res) => {
  res.send("비밀번호");
};

export const mypage = (req, res) => {
  res.send("마이페이지");
};
