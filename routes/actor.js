const express = require('express');
const router = express.Router();
const { updateActor,getAllActors,getStreak } = require('../controllers/actors')
// Routes related to actor.


router.put('/', async ( req,res ) =>{
    const data = req.body;

    const { error, message } = await updateActor(data);
  
    if (error) {
      return res.status(404).json({
        message
      });
    }
  
    return res.status(200).json({
      message
    });
})

router.get("/", async (req, res) => {
    const { error, row, message } = await getAllActors();
  
    if (error) {
      return res.status(400).json({
        message
      });
    }
  
    return res.status(200).json(row);
  });



  router.get("/streak", async (req, res) => {
    const { error, row, message } = await getStreak();
  
    if (error) {
      return res.status(400).json({
        message
      });
    }
  
    return res.status(200).json(row);
  });
 
module.exports = router;