import globalRouter from "./routers/globalRouter";
import { localsVariable } from "./middleware";
import express from "express";
import morgan from "morgan"

import sql from "mssql";

const app = express();
const logger = morgan("dev");

const config = { 
    user: 'sa',
    password: 'key0123', 
    server: '59.15.58.143',
    // server: 'localhost',
    database: 'PCMS', 
    stream: true,
    encrypt:false,
    pool: { 
        max: 10, 
        min: 0, 
        idleTimeoutMillis: 30000 
    }
}; 

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

pool.on('error', err => {
    console.log(err, 'WTF!!!');
});

export const executeQuery = async(query) => {
    await poolConnect; 
    try {
        const request = pool.request(); 
        const result = await request.query(query);
        console.log(query);
        // const arr = result.recordset;
        // arr.map((x, idx) => {
        //     console.log(`${idx}: ${x.ShopName}`);
        // })
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
    }
}

app.set("view engine", "pug");
app.set("views",process.cwd() + "/src/views");
app.use(express.static(process.cwd() + "/src/assets"));
app.use(logger);
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(localsVariable);
app.use("/static", express.static("assets"));
app.use("/client", express.static("src/client"));
app.use("/", globalRouter);

export default app;


