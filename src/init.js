import app from "./server";
import "regenerator-runtime";
require("dotenv").config();

app.listen(process.env.SERVER_PORT, console.log(`Server listen ${process.env.SERVER_PORT} ( •̀ ω •́ )`));
