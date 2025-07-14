const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  class: { type: String, required: true },
  subjects: [{ type: String, required: true }],
  attendance: { type: Number, required: true },
  flagged: { type: Boolean, default: false },
});

module.exports = mongoose.model("Employee", employeeSchema);
