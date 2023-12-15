const express = require("express");
const memberDB = require("../models/memberSchema");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ answer: "guildMember" });
});

router.get("/member", async (req, res) => {
  const nickName = req.body.nickname;
  const ifexist = await memberDB.exists({ nickName: nickName });
  if (!ifexist) {
    res.send({ success: false, result: {} });
    return;
  }
  const doc = await memberDB.findOne({ nickName: nickName });
  const memberJob = doc.job;
  const memberGrade = doc.grade;
  const memberSubChar = doc.subChar;
  const result = {
    nickName: nickName,
    grade: memberGrade,
    job: memberJob,
    subChar: memberSubChar,
  };
  res.send({ success: true, result: result });
});

router.get("/all", async (req, res) => {
  let bom1 = 0,
    bom2 = 0,
    bom3 = 0,
    bom4 = 0,
    bom5 = 0,
    bom6 = 0;
  /*
  늘봄/돌봄 - 1
  가끔봄 - 2
  왕눈치봄 - 3
  눈치봄 - 4
  기다려봄 - 5
  플래그햇봄 - 6
   */
  for await (const doc of memberDB.find()) {
    if (doc.grade === "늘봄" || doc.grade === "돌봄") {
      bom1++;
    } else if (doc.grade === "가끔봄") {
      bom2++;
    } else if (doc.grade === "왕눈치봄") {
      bom3++;
    } else if (doc.grade === "눈치봄") {
      bom4++;
    } else if (doc.grade === "기다려봄") {
      bom5++;
    } else if (doc.grade === "플래그햇봄") {
      bom6++;
    }
  }
  const arr = {
    늘봄: bom1,
    가끔봄: bom2,
    왕눈치봄: bom3,
    눈치봄: bom4,
    기다려봄: bom5,
    플래그햇봄: bom6,
  };
  res.json(arr);
});

module.exports = router;
