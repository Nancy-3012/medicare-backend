const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  disease: String,
  contact: String
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
