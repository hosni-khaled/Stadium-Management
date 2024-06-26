const mongoose = require("mongoose");

let stadiumSchema = new mongoose.Schema({
  stadiumName: String,
  id: {
    type: Number,
    unique: true,
  },
  contactNumber: [String],
  contactName: [String],
  photos: [String],
  location: String,
  rate: Number,
  ownerUsername: String,
});

let Stadium = new mongoose.model("stadiums", stadiumSchema);

module.exports = Stadium;
