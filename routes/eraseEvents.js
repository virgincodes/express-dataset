var express = require('express');
var router = express.Router();
const {  eraseEvents } = require("../controllers/events");

// Route related to delete events



router.delete("/", async (req, res) => {
    const { error } = eraseEvents();
  
    if (error) {
      return res.status(400).json({
        message: "Error occured deleting items"
      });
    }
  
    return res.status(200).json({
      message: "Deleted all events"
    });
  });
  

module.exports = router;