const express = require('express');
const router = express.Router();
const Sprint = require('../models/sprint');
const Task = require('../models/task');
const User = require('../models/user');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth')

// Create sprint
router.post('/', checkAuth, (req, res, next) => {
   const sprint = new Sprint({
      _id: new mongoose.Types.ObjectId(),
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      isActive: true,
      projectId: req.body.projectId,
      tasks: req.body.tasks
   });
   console.log(sprint);
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


//get ALL sprints
router.get('/all/:projectId', checkAuth, (req, res) => {
   Sprint.find({ projectId: req.params.projectId, isActive: false }).exec()
      .then(sprint => {
         res.status(200).send(sprint)
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

//get active sprint
router.get('/:projectId', checkAuth, (req, res) => {
   Sprint.find({ projectId: req.params.projectId, isActive: true }).exec()
      .then(sprint => {
         if (sprint.length > 0) {
            let list = []
            return Task.find({
               _id: { $in: sprint[0].tasks }
            }).then(tasks => {
               let promises = tasks.map(t => {
                  return User.find({
                     $or: [{ username: t.affectedTo }, { _id: t.createdBy }]
                  }, 'firstName username image').then(user => {
                     t.createdBy = user[0];
                     t.affectedTo = user[1];
                     list.push(t)
                  })
               })
               Promise.all(promises).then(() => {
                  sprint[0].tasks = list;
                  return res.send(sprint).status(200)
               })
            })
         }
         else res.send([]).status(404)
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

//edit sprint
router.post('/edit', checkAuth, (req, res, next) => {
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
router.post('/end', checkAuth, (req, res, next) => {
   const sprintId = req.body.id;
   Sprint.updateOne({ _id: sprintId }, { $set: { isActive: false } })
      .exec()
      .then(result => {
         if (result.nModified === 1) {
            console.log('changed')

            res.status(200).json({
               message: 'Sprint closed'
            });
         }
         else {
            console.log('not changed')
            res.status(404).json({
               message: 'Operation faild'
            })
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