import express from "express";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import { localsVariable } from "./middleware";
import globalRouter from "./routers/globalRouter";
import discountRouter from "./routers/discountRouter";
import sql from "mssql";
import cron from "node-cron";
import Stream from "node-rtsp-stream";
import { camelizeKeys } from "./util";
import config from "./mssqlConfig";
import ExcelJS from "exceljs";

// var path = require("path");
// var root = path.dirname(__dirname);
// console.log(path.join(root, "/uploads"));

const app = express();
const logger = morgan("dev");
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on("error", (err) => {
  console.log(`DB Connection Error: ${err}`);
});

cron.schedule("*/10 * * * * *", function () {
  // for (let i = 1; i <= Number(process.env.CCTV_CNT); i++) {
  //   new Stream({
  //     streamUrl: `rtsp://${process.env.CCTV_ID}:${process.env.CCTV_PW}@${process.env.CCTV_IP}:901${i}/Streaming/Channels/102/?transportmode=unicast`,
  //     wsPort: 9000 + i,
  //   });
  //   console.log(`${i}번 CCTV 시작`);
  // }
  // console.log("cron 실행");
});

export const executeQuery = async (query) => {
  await poolConnect;
  try {
    const request = pool.request();
    const result = await request.query(query);
    return camelizeKeys(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
  }
};

export const executeUpdate = async (query) => {
  await poolConnect;
  try {
    const request = pool.request();
    await request.query(query);
  } catch (err) {
    console.error("SQL error", err);
  }
};

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.static(process.cwd() + "/src/assets"));
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "Hello!",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(localsVariable);
app.use("/static", express.static("assets"));
app.use("/client", express.static("src/client"));
app.use("/", globalRouter);
app.use("/discount", discountRouter);

export default app;
