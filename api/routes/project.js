const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const mongoose = require('mongoose');


// Create project
router.post('/add', (req, res, next) => {
   
   const project = new Project({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      dateStart: new Date(req.body.dateStart),
      description: req.body.description,
      status: req.body.status
   });
   project.save()
      .then(result => {
         res.status(201).json({
            message: 'Project created',
            project: project
         })
      })
      .catch(err => {
         res.status(500).json({
            error: err
         })
      })
})


//get all projects
router.get('/all', (req, res, next) => {
   Project.find({}).exec()
      .then(projects => {
         return res.send(projects).status(200);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

// get project by name
router.get('/:name', (req, res, next) => {
   Project.find({ name: req.params.name }).exec()
      .then(project => {
         if (project.length >= 1) {
            return res.send(project).status(200);
         }
         else
            res.send('No project found').status(404)
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

//delete a project by name
router.delete("/:name", (req, res, next) => {
   const name = req.params.name;
   Project.remove({ name: name })
      .exec()
      .then(result => {
         if (result.deletedCount === 1) {
            res.status(200).json({
               message: 'Project deleted'
            });
         }
         else {
            res.send('Project not found').status(404)
         }

      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});

//edit project
router.post("/edit", (req, res, next) => {
   const name = req.body.name;
   const updateOps = {};
   updateOps.name = req.body.name;
   updateOps.dateStart = new Date(req.body.dateStart);
   updateOps.description = req.body.description;
   updateOps.status = req.body.status
   console.log(updateOps)
   Project.updateOne({ name: name }, { $set: updateOps })
      .exec()
      .then(result => {
         if (result.nModified === 1) {
            res.status(200).json({
               message: 'Project updated'
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


module.exports = router;