const express = require("express");
const memberDB = require("../models/memberSchema");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ answer: "guildContents" });
});

// 길컨 테이블 목록 불러오기
router.get("/gclist", async (req, res) => {
  try {
    const doc = await memberDB.findOne({ nickName: "페달튜너" });
    let gclist = [];
    for await (const item of doc.guildContents) {
      gclist.push(item.time);
    }
    res.send({ success: true, gclist: gclist });
  } catch (e) {
    console.log(e);
    res.send({ success: false });
  }
});

// 길컨 테이블 삭제
router.post("/delete", async (req, res) => {
  const ifexist = await memberDB.exists({
    guildContents: {
      $elemMatch: { time: req.body.time },
    },
  });
  if (!ifexist) {
    res.send({ success: false });
    return;
  } else {
    try {
      for await (const doc of memberDB.find()) {
        const targetIndex = doc.guildContents.findIndex(
          (e) => e.time === req.body.time
        );
        doc.guildContents.splice(targetIndex, 1);
        doc.save();
      }
    } catch {
      res.send({ success: false });
      return;
    }
    res.send({ success: true });
  }
});

// 길컨 테이블 생성
router.post("/create", async (req, res) => {
  const ifexist = await memberDB.exists({
    guildContents: {
      $elemMatch: { time: req.body.time },
    },
  });
  if (ifexist) {
    res.send({ success: false });
  } else {
    try {
      for await (const doc of memberDB.find()) {
        doc.guildContents.push({
          time: req.body.time,
          participated: true,
        });
        doc.save();
      }
    } catch {
      res.send({ success: false });
      return;
    }
    res.send({ success: true });
  }
});

// 길컨 미참 캐릭터 일괄입력
router.post("/inputfalse", async (req, res) => {
  try {
    console.log(req.body);
    for (const nick of req.body.nickname) {
      const doc = await memberDB.findOne({ nickName: nick });
      const targetIndex = doc.guildContents.findIndex(
        (e) => e.time === req.body.time
      );
      doc.guildContents.splice(targetIndex, 1, {
        time: req.body.time,
        participated: false,
      });
      doc.save();
    }
  } catch {
    res.send({ success: false });
    return;
  }
  res.send({ success: true, list: req.body.nickname });
});

// 길컨 참여 캐릭터 입력
router.post("/inputtrue", async (req, res) => {
  try {
    for (const nick of req.body.nickname) {
      const doc = await memberDB.findOne({ nickName: nick });
      const targetIndex = doc.guildContents.findIndex(
        (e) => e.time === req.body.time
      );
      doc.guildContents.splice(targetIndex, 1, {
        time: req.body.time,
        participated: true,
      });
      doc.save();
    }
  } catch {
    res.send({ success: false });
    return;
  }
  res.send({ success: true, list: req.body.nickname });
});

module.exports = router;
