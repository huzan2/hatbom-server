const express = require("express");
const memberDB = require("../models/memberSchema");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ answer: "memberManage" });
});

// 신규 길드원 생성
router.post("/newMember", async (req, res) => {
  const ifexist = await memberDB.exists({ nickName: req.body.nickname });
  if (ifexist) {
    return;
  }
  try {
    const newMember = new memberDB({
      nickName: req.body.nickname,
      grade: req.body.grade,
      job: req.body.job,
    });
    await newMember.save().then(() => {
      res.send({ success: true });
    });
  } catch {
    res.send({ success: false });
    return;
  }
});

// 길드원 정보 삭제
router.post("/deleteMember", async (req, res) => {
  try {
    //await memberDB.deleteMany({ subChar: [req.body.nickname] });
    await memberDB.deleteOne({ nickName: req.body.nickname });
    res.send({ success: true });
  } catch {
    res.send({ success: false });
    return;
  }
});

// 직위변경
router.post("/editGrade", async (req, res) => {
  const nickname = req.body.nickname;
  const gradeTo = req.body.gradeTo;
  try {
    await memberDB.updateOne({ nickName: nickname }, { grade: gradeTo });
    res.send({ success: true });
  } catch {
    res.send({ success: false });
    return;
  }
});

// 닉네임 변경
router.post("/editNickname", async (req, res) => {
  const nickname = req.body.nickname;
  const nicknameTo = req.body.nicknameTo;
  try {
    await memberDB.updateOne({ nickName: nickname }, { nickName: nicknameTo });
    res.send({ success: true });
  } catch {
    res.send({ success: false });
    return;
  }
});

// 직업 변경
router.post("/editJob", async (req, res) => {
  const nickname = req.body.nickname;
  const jobTo = req.body.jobTo;
  try {
    await memberDB.updateOne({ nickName: nickname }, { job: jobTo });
    res.send({ success: true });
  } catch {
    res.send({ success: false });
    return;
  }
});

module.exports = router;
