require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const memberRouter = require("./routers/guildMemberInfo.js");
const contentsRouter = require("./routers/guildContents.js");
const memberManageRouter = require("./routers/memberManage.js");
const app = express();

const { PORT, DB_URI } = process.env;

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(DB_URI)
  .then(() => console.log("connected to DB"))
  .catch((e) => console.error(e));

app.use("/guildMember", memberRouter);
app.use("/guildContents", contentsRouter);
app.use("/memberManage", memberManageRouter);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
