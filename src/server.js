import globalRouter from "./routers/globalRouter";
import Stream from "node-rtsp-stream";
import express from "express";
import morgan from "morgan"
require("dotenv").config();

const app = express();
const logger = morgan("dev");

for (let i = 1; i <= process.env.CCTV_CNT; i++) {
    new Stream({
        streamUrl: `rtsp://${process.env.CCTV_ID}:${process.env.CCTV_PW}@${process.env.CCTV_IP}:900${i}/Streaming/Channels/102/?transportmode=unicast`,
        wsPort: 9000+i
    })

}

app.set("view engine", "pug");
app.set("views",process.cwd() + "/src/views");
app.use(express.static(process.cwd() + "/src/assets"));
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("assets"));
app.use("/client", express.static("src/client"));
app.use("/", globalRouter);

export default app;


