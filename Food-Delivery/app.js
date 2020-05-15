const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const router = require("./routes/routes");
const router2 = require("./routes/users");
const router3 = require("./routes/index");
const ejs = require("ejs");
app.set("view engine","ejs");
app.use(express.static("./views"));
//middlewares
app.use((req,res,next)=>{
    next()
})
app.use("/",router);
app.use("/",router2);
app.use("/",router3);
app.use(cookieParser());
app.use(morgan("dev"))
const port = 3000;
app.listen(port,()=>{
    console.log(`Server is up and running at port ${port}`)
})