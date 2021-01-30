const express = require("express");
const router = express.Router();
const { checkAPIAvailability } = require("../middlewares/apiLimit");

// we use express middleware to check API limiting

router.get("/", checkAPIAvailability, (req, res) => {
  res.send("GET api/test/ worked");
});

router.post("/", checkAPIAvailability, (req, res) => {
  res.send("POST api/test/ worked");
});

module.exports = router;
