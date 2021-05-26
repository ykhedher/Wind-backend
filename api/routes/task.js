const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const mongoose = require('mongoose');



//create a task
router.post('/add', (req, res, next) => {
   console.log(req.body)
   const task = new Task({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      createdAt: new Date(req.body.createdAt),
      estimation: req.body.estimation,
      createdBy: req.body.createdBy,
      lastUpdated: new Date(),
      lastUpdatedBy: req.body.updatedBy,
   });
   task.save()
      .then(result => {
         res.status(201).json({
            message: 'task created',
            task: task
         })
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})

//get all tasks
router.get('/all', (req, res, next) => {
   Task.find({}).exec()
      .then(tasks => {
         return res.send(tasks).status(200);
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})

//get task by id
router.get('/:id', (req, res, next) => {
   Task.find({ _id: req.params.id }).exec()
      .then(task => {
         if (task.length === 1) {
            return res.send(task).status(200);
         }
         else
            res.send('No task found').status(404)
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})


// edit a task
router.post('/edit', (req, res, next) => {
   const taskId = req.body.id;
   let updateOps = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      createdAt: new Date(req.body.createdAt),
      estimation: req.body.estimation,
      createdBy: req.body.createdBy,
      lastUpdated: new Date(),
      lastUpdatedBy: req.body.updatedBy,
   }
   Task.updateOne({ _id: taskId }, { $set: updateOps }).exec()
      .then(result => {
         if (result.nModified === 1) {
            res.status(200).json({
               message: 'task updated'
            });
         }
         else {
            res.status(404).send('Operation faild')
         }

      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})

// delete task
router.delete("/:id", (req, res, next) => {
   const id = req.params.id;
   Task.remove({ _id: id })
      .exec()
      .then(result => {
         if (result.deletedCount === 1) {
            res.status(200).json({
               message: 'Task deleted'
            });
         }
         else {
            res.send('Task not found').status(404)
         }

      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});


module.exports = router
