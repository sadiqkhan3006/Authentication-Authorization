const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 4000;

//cookie parser//
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.json());
const { dbConnect } = require("./config/dataBase");
//console.log("dd connect => ", dbConnect);
dbConnect();
const { router } = require("./routes/user");
app.use("/api/v1", router);
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("hello ji");
});
