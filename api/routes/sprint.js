const express = require('express');
const router = express.Router();
const Sprint = require('../models/sprint');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth')


// Create sprint
router.post('/', checkAuth, (req, res, next) => {
   const sprint = new Sprint({
      _id: new mongoose.Types.ObjectId(),
      dateStart: new Date(req.body.dateStart),
      dateEnd: new Date(req.body.dateEnd),
      isActive: req.body.isActive,
   });
   sprint.save()
      .then(result => {
         res.status(201).json({
            message: 'Sprint created',
            sprint: sprint
         })
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})


//get all sprints
router.get('/',checkAuth, (req, res, next) => {
   Sprint.find({}).exec()
      .then(sprints => {
         return res.send(sprints).status(200);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

//edit sprint
router.post('/edit',checkAuth, (req, res, next) => {
   const sprintId = req.body.sprintId;
   const updateOps = {};
   updateOps.dateStart = new Date(req.body.dateStart);
   updateOps.dateEnd = new Date(req.body.dateEnd);
   updateOps.isActive = req.body.isActive;
   Sprint.updateOne({ _id: sprintId }, { $set: updateOps })
      .exec()
      .then(result => {
         if (result.nModified === 1) {
            res.status(200).json({
               message: 'Sprint updated'
            });
         }
         else {
            res.status(404).send('Operation faild')
         }

      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});


// end a sprint
router.post('/end', checkAuth,(req, res, next) => {
   const sprintId = req.body.id;
   Sprint.updateOne({ _id: sprintId }, { $set: { isActive: false } })
      .exec()
      .then(result => {
         if (result.nModified === 1) {
            res.status(200).json({
               message: 'Sprint closed'
            });
         }
         else {
            res.status(404).send('Operation faild')
         }

      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });

})





module.exports = router;