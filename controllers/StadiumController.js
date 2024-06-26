const Stadium = require("../models/Stadium");
const User = require("../models/User");

module.exports.addStadium = async (req, res) => {
  try {
    let { stadiumName, contactNumber, contactName, location, ownerUsername } =
      req.body;

    let stadiumIsExist = await Stadium.findOne({
      stadiumName,
    });

    if (stadiumIsExist)
      return res
        .status(403)
        .send("Forbidden...Stadium name is already exist...");

    let user = await User.findOne({
      username: ownerUsername,
      isHost: true,
    });

    if (!user)
      return res
        .status(404)
        .send(
          "Not Founded...Owner username didn't found or  this user isn't owner ..."
        );

    let stadium = new Stadium({
      stadiumName,
      contactName,
      contactNumber,
      location,
      ownerUsername,
    });
    stadium.rate = 0;

    if (req.files) {
      let path = "";

      for (const file of req.files) {
        path = path + file.path + ",";
      }

      path = path.substring(0, path.lastIndexOf(","));
      path = path.split(",");
      stadium.photos = path;
    }

    let stadiums = await Stadium.find({});
    stadium.id = stadiums.length + 1;

    await stadium.save();
    res.send("Stadium has been saved successfully...");
  } catch (error) {
    res.status(500).send("Server Error..." + error.message);
  }
};

module.exports.deleteStadium = async (req, res) => {
  try {
    let stadiumId = req.params.stadiumId;
    let stadium = await Stadium.findOneAndDelete({
      _id: stadiumId,
    });
    if (!stadium) return res.status(404).send("Stadium Not Found...");
    res.send("Stadium is deleted...");
  } catch (error) {
    res.status(500).send("Server Error..." + error.message);
  }
};

module.exports.getAllStadiums = async (req, res) => {
  try {
    let stadiums = await Stadium.find({});
    res.json(stadiums);
  } catch (error) {
    res.status(500).send("Server Error..." + error.message);
  }
};

module.exports.getHostStadiums = async (req, res) => {
  try {
    let stadiums = await Stadium.find({
      ownerUsername: req.body.ownerUsername,
    });
    res.json(stadiums);
  } catch (error) {
    res.status(500).send("Server Error..." + error.message);
  }
};

module.exports.editStadium = async (req, res) => {
  let {
    stadiumName,
    contactNumber,
    contactName,
    location,
    ownerUsername,
    rate,
  } = req.body;

  if (stadiumName || location || ownerUsername || rate || req.files) {
    return res
      .status(403)
      .send("Forbidden... There is specific data can not be changed...");
  }

  let stadium = await Stadium.findOneAndUpdate(
    { _id: req.params.stadiumId },
    { contactName, contactNumber },
    { returnOriginal: false }
  );

  if (!stadium) return res.status(404).send("Not Found... User not found...");

  res.send("Data is Updated...");
};

module.exports.editStadiumByAdmin = async (req, res) => {
  let { stadiumName, contactNumber, contactName, location, ownerUsername } =
    req.body;

  let stadium = await Stadium.findOneAndUpdate(
    { _id: req.params.stadiumId },
    { stadiumName, contactNumber, contactName, location, ownerUsername },
    { returnOriginal: false }
  );

  if (!stadium) return res.status(404).send("Not Found... User not found...");

  res.send("Data is Updated...");
};
