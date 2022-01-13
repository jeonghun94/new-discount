import express from "express";
import morgan from "morgan";
import session from "express-session";
import cookieParser from "cookie-parser";
import { localsVariable, protectorMiddleware } from "./middleware";
import globalRouter from "./routers/globalRouter";
import discountRouter from "./routers/discountRouter";
import sql from "mssql";
import cron from "node-cron";
import { camelizeKeys } from "../util";

const app = express();
const logger = morgan("dev");

const config = {
  user: "sa",
  password: "key0123",
  server: "smcity.iptime.org",
  // server: "localhost",
  database: "PCMS",
  stream: true,
  encrypt: false,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on("error", (err) => {
  console.log(err, "WTF!!!");
});

cron.schedule("*/10 * * * * *", function () {
  console.log("executing cron");
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

// console.log(process.env.IMAGE_SERVER_ADDRESS);
// console.log(process.env.IMAGE_SERVER_PORT);
// console.log(process.env.MAX_CNT);
// console.log(process.env.FREE_CNT);
// console.log(process.env.PAY_CNT);
// console.log(process.env.SHOP_DUPLICATION);
// console.log(process.env.TIME_LIMIT_USE);
// console.log(process.env.TIME_LIMIT_MINUTE);

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

// app.use((req, res, next) => {
//   req.sessionStore.all((error, sessions) => {
//     console.log(sessions);
//     next();
//   });
// });

app.use("/static", express.static("assets"));
app.use("/client", express.static("src/client"));
app.use(localsVariable);
app.use("/", globalRouter);
app.use(protectorMiddleware);
app.use("/discount", discountRouter);

export default app;
