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
      lastUpdated: new Date(req.body.lastUpdated),
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


// edit a comment
// router.post("/:id", (req, res, next) => {
//    const id = req.params.id;
//    Comment.updateOne({ _id: id }, { $set: { text: req.body.text, createdAt: new Date() } })
//       .exec()
//       .then(result => {
//          if (result.nModified === 1) {
//             res.status(200).json({
//                message: 'comment updated'
//             });
//          }
//          else {
//             res.status(404).send('Operation faild')
//          }

//       })
//       .catch(err => {
//          console.log(err);
//          res.status(500).json({
//             error: err
//          });
//       });
// });

// //delete a comment
// router.delete("/:id", (req, res, next) => {
//    const id = req.params.id;
//    console.log(id)
//    Comment.remove({ _id: id })
//       .exec()
//       .then(result => {
//          if (result.deletedCount === 1) {
//             res.status(200).json({
//                message: 'comment removed'
//             });
//          }
//          else {
//             res.status(404).send('Operation faild')
//          }

//       })
//       .catch(err => {
//          console.log(err);
//          res.status(500).json({
//             error: err
//          });
//       });
// });

module.exports = router
