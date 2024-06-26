const express = require("express");
const stadiumController = require("../controllers/StadiumController");
const router = express.Router();

router.put("/editStadium/:stadiumId", stadiumController.editStadium);

module.exports = router;
