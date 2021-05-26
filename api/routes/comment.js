const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const mongoose = require('mongoose');
//add a comment
router.post('/add', (req, res, next) => {
   const comment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      text: req.body.text,
      createdAt: new Date(),
      userId: req.body.userId,
      taskId: req.body.taskId
   });
   comment.save()
      .then(result => {
         res.status(201).json({
            message: 'comment created',
            comment: comment
         })
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})


// edit a comment
router.post("/edit", (req, res, next) => {
   const id = req.body.id;
   Comment.updateOne({ _id: id }, { $set: { text: req.body.text, createdAt: new Date() } })
      .exec()
      .then(result => {
         if (result.nModified === 1) {
            res.status(200).json({
               message: 'comment updated'
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

//delete a comment
router.delete("/:id", (req, res, next) => {
   const id = req.params.id;
   console.log(id)
   Comment.remove({ _id: id })
      .exec()
      .then(result => {
         if (result.deletedCount === 1) {
            res.status(200).json({
               message: 'comment removed'
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

module.exports = router
