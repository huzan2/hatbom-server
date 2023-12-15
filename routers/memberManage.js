const express = require("express");
const memberDB = require("../models/memberSchema");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ answer: "memberManage" });
});

module.exports = router;
