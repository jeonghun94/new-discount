import app from "./server";
require("dotenv").config();

app.listen(process.env.PORT, console.log(`Server listen ${process.env.PORT} ( •̀ ω •́ )`));
