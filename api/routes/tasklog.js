const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/checkAuth');
const Tasklog = require('../models/tasklog');
const User = require('../models/user');
const moment = require('moment')



//get task by projectId
router.get('/:taskId', checkAuth, (req, res) => {
   Tasklog.find({ taskId: req.params.taskId }, 'messages').exec()
      .then(task => {
        res.status(200).json(task)
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

module.exports = router
