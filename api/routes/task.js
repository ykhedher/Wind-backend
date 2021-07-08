const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth');
const Tasklog = require('../models/tasklog');
const User = require('../models/user');
const moment = require('moment')


//create a task
router.post('/', checkAuth, (req, res, next) => {
   //console.log(req.body)
   let now = moment(new Date()).format('MMMM Do YYYY, hh:mm');
   const task = new Task({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      createdAt: new Date(),
      estimation: req.body.estimation,
      createdBy: req.userData.userId,
      affectedTo: req.body.affectedTo,
      lastUpdated: new Date(),
      lastUpdatedBy: req.userData.userId,
      projectId: req.body.projectId
   });
   task.save()
      .then(() => {
         res.status(201).json({
            message: 'Task created successfully',
            task: task
         })
         const taskLog = new Tasklog({
            _id: new mongoose.Types.ObjectId(),
            messages: [{ message: `<p>Task created at <b>${now}</b> by <strong><Avatar size={30} src={http://localhost:3030/uploads/${req.userData.image}}/> @${req.userData.username}</strong></p>` }],
            taskId: task._id
         })
         taskLog.save()
            .then(() => {
               console.log('tasklog created');
            })
            .catch((err) => console.log(err))
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})

//get all tasks
router.get('/', checkAuth, (req, res, next) => {
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

//get a task
router.get('/getTask/:taskId', checkAuth, (req, res) => {
   Task.findById(req.params.taskId).exec()
      .then(task => {
         return res.send(task).status(200);
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})



//get task by projectId
router.get('/:projectId', checkAuth, (req, res, next) => {
   Task.find({ projectId: req.params.projectId }).exec()
      .then(tasks => {
         let promises = tasks.map((task) => {
            return User.find({
               $or: [{ username: task.affectedTo }, { _id: task.createdBy }]
            }, 'firstName username image')
               .then(user => {
                  task.createdBy = user[0];
                  task.affectedTo = user[1]
               })
         })
         Promise.all(promises).then(() => {
            return res.send(tasks).status(200)
         })
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})


// edit a task
router.post('/edit', checkAuth, (req, res, next) => {
   const taskId = req.body._id;
   let updateOps = {
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      priority: req.body.priority,
      estimation: req.body.estimation,
      affectedTo: req.body.affectedTo,
      lastUpdated: new Date(),
      lastUpdatedBy: req.userData.userId,
   }
   console.log(updateOps)
   Task.updateOne({ _id: taskId }, { $set: updateOps }).exec()
      .then(result => {
         console.warn(result)
         if (result.nModified === 1) {
            res.status(200).json({
               message: 'task updated'
            });
         }
         else {
            res.status(404).send('Operation faild task')
         }
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})

// delete task
router.delete("/:id", checkAuth, (req, res, next) => {
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
