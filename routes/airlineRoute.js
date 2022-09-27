const router = require("express").Router();
const Airline = require("../models/airlineModel");
const authMiddleware = require("../middlewares/authMiddleware");


router.post("/add-airline", authMiddleware, async (req, res) => {
  try {
    const existingAirline = await Airline.findOne({ number: req.body.number });
    if (existingAirline) {
      return res.status(200).send({
        success: false,
        message: "Airline already exists",
      });
    }
    const newAirline = new Airline(req.body);
    await newAirline.save();
    return res.status(200).send({
      success: true,
      message: "Airline added successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


router.post("/update-airline", authMiddleware, async (req, res) => {
  try {
    await Airline.findByIdAndUpdate(req.body._id, req.body);
    return res.status(200).send({
      success: true,
      message: "Airline updated successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


router.post("/delete-airline", authMiddleware, async (req, res) => {
  try {
    await Airline.findByIdAndDelete(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Airline deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


router.post("/get-all-airline", authMiddleware, async (req, res) => {
  try {
    const Airlinees = await Airline.find(req.body);
    return res.status(200).send({
      success: true,
      message: "Airlinees fetched successfully",
      data: Airlinees,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});


router.post("/get-airline-by-id", authMiddleware, async (req, res) => {
  try {
    const Airline = await Airline.findById(req.body._id);
    return res.status(200).send({
      success: true,
      message: "Airline fetched successfully",
      data: Airline,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
});

module.exports = router;
