const { Schema, model } = require("mongoose");

const memberSchema = new Schema({
  nickName: {
    type: String,
    required: true,
    unique: true,
  },
  grade: {
    type: String,
    required: true,
  },
  job: {
    type: String,
    required: true,
  },
  subChar: [],
  guildContents: [],
  warned: {
    type: Number,
    default: 0,
  },
});

module.exports = model("memberDB", memberSchema);
