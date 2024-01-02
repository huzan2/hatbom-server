const express = require("express");
const memberDB = require("../models/memberSchema");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ answer: "gradeHelper" });
});

// 직위조정 결과 반영
router.post("/autosave", async (req, res) => {
  try {
    for await (const doc of memberDB.find()) {
      const targetIndex = doc.guildContents.findIndex(
        (e) => e.time === req.body.time
      );
      if (!doc.guildContents[targetIndex].participated) {
        if (doc.grade === "늘봄" || doc.grade === "돌봄") {
          doc.grade = "왕눈치봄";
          doc.warned++;
          doc.save();
        } else if (doc.grade === "가끔봄") {
          doc.grade = "눈치봄";
          doc.warned++;
          doc.save();
        } else if (doc.grade === "왕눈치봄" || doc.grade === "눈치봄") {
          doc.warned++;
          doc.save();
        }
      } else {
        if (doc.grade === "왕눈치봄") {
          doc.grade = "늘봄";
          doc.warned = 0;
          doc.save();
        } else if (doc.grade === "눈치봄") {
          doc.grade = "가끔봄";
          doc.warned = 0;
          doc.save();
        }
      }
    }
  } catch {
    res.send({ success: false });
    return;
  }
  res.send({ success: true });
});

// 자동직위조정
router.post("/auto", async (req, res) => {
  try {
    console.log(req.body);
    let mainFarr = []; // 본캐 중 길컨 미참
    let subFarr = []; // 부캐 중 길컨 미참
    let mainTarr = []; // 왕눈치봄에서 길컨 참여
    let subTarr = []; // 눈치봄에서 길컨 참여
    let elseArr = []; // 2회 이상 연속 미참
    for await (const doc of memberDB.find()) {
      const targetIndex = doc.guildContents.findIndex(
        (e) => e.time === req.body.time
      );
      if (targetIndex === -1) {
        console.log("index not found");
        res.send({ success: false });
        return;
      }
      if (!doc.guildContents[targetIndex].participated) {
        if (doc.grade === "늘봄" || doc.grade === "돌봄") {
          mainFarr.push(doc.nickName);
        } else if (doc.grade === "가끔봄") {
          subFarr.push(doc.nickName);
        } else {
          elseArr.push(doc.nickName);
        }
      } else {
        if (doc.grade === "왕눈치봄") {
          mainTarr.push(doc.nickName);
        } else if (doc.grade === "눈치봄") {
          subTarr.push(doc.nickName);
        }
      }
    }
    res.send({
      success: true,
      time: req.body.time,
      arr1: mainFarr,
      arr2: subFarr,
      arr3: mainTarr,
      arr4: subTarr,
      arr5: elseArr,
    });
  } catch (e) {
    console.log(e);
    res.send({ success: false, req: req });
    return;
  }
});

module.exports = router;
