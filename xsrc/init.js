import "regenerator-runtime";
import "dotenv/config";
import app from "./server";

app.listen(process.env.SERVER_PORT, console.log(`Server listen ${process.env.SERVER_PORT} ( •̀ ω •́ )`));
