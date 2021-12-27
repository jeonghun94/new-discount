import globalRouter from "./routers/globalRouter";
import { localsVariable } from "./middleware";
import Stream from "node-rtsp-stream";
import express from "express";
import morgan from "morgan"

import sql from "mssql";

const app = express();
const logger = morgan("dev");

// for (let i = 1; i <= process.env.CCTV_CNT; i++) {
//     new Stream({
//         streamUrl: `rtsp://${process.env.CCTV_ID}:${process.env.CCTV_PW}@${process.env.CCTV_IP}:900${i}/Streaming/Channels/102/?transportmode=unicast`,
//         wsPort: 9000+i
//     })
// }


const config = { 
    user: 'sa',
    password: 'key0123', 
    server: 'localhost',
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

export const executeQuery = async() => {
    await poolConnect; // ensures that the pool has been created
    try {
        const request = pool.request(); // or: new sql.Request(pool1)
        const result = await request.query('select * from ps130')
        const arr = result.recordset;
        arr.map((x, idx) => {
            console.log(`${idx}: ${x.ShopName}`);
        })
        return result;
    } catch (err) {
        console.error('SQL error', err);
    }
}

app.set("view engine", "pug");
app.set("views",process.cwd() + "/src/views");
app.use(express.static(process.cwd() + "/src/assets"));
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(localsVariable);
app.use("/static", express.static("assets"));
app.use("/client", express.static("src/client"));
app.use("/", globalRouter);

export default app;


