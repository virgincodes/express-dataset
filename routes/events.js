const express = require("express");
const router = express.Router();
const { addEvent, getByActor ,getAllEvents } = require("../controllers/events");
 // Routes related to event



router.post("/", async (req, res) => {
  const data = req.body;

  const { error, message } = await addEvent(data);

  if (error) {
    return res.status(400).json({
      message
    });
  }

  return res.status(201).json({
    message
  });
});

router.get("/", async (req, res) => {
  const { error, row, message } = await getAllEvents();



  return res.status(200).json(row);
});


router.get("/actors/:id", async (req, res) => {
    const {id} = req.params
    
    const { error, row, message } = await getByActor(id);
  
    if (error) {
      return res.status(404).json({
        message
      });
    }
  
    return res.status(200).json(row);
  });
  
  




module.exports = router;
