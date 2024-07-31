const mongoose = require("mongoose");
const { Schema } = mongoose;

const jobSchema = Schema({
  language: {
    required: true,
    type: String,
    enum: ["Cpp", "Py"],
  },
  filePath: {
    required: true,
    type: String,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  startedAt: {
    type: Date,
  },
  completedAt: {
    type: Date,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "success", "error"],
  },
  output: {
    type: String,
  },
});

module.exports = mongoose.model("job", jobSchema);
