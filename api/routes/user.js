const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const jwt = require('jsonwebtoken');
const sendMail = require('../services/emailSender')
const secretKey = 'wind-secret'
const checkAuth = require('../middleware/checkAuth')

// Create user
router.post('/signup',checkAuth, upload.single('image'), (req, res, next) => {
   let password = req.body.password
   console.log(req.file)
   bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
         return res.status(500).json({
            error: err
         });
      }
      else {
         const user = new User({
            _id: new mongoose.Types.ObjectId(),
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            userType: req.body.userType,
            image: req.file.filename
         });

         user.save()
            .then(result => {
               sendMail(user.email, user.firstName, password);
               res.status(201).json({
                  message: 'User created',
                  user: user
               })
            })
            .catch(err => {
               res.status(500).json({
                  error: err
               })
            })
      }
   })
})

router.post('/login', (req, res, next) => {
   User.findOne({ email: req.body.email }).exec()
      .then(user => {
         if (!user) {
            return res.status(401).json({
               message: 'Invalid Credentials'
            })
         }
         bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (!result) {
               return res.status(401).json({
                  message: 'Password is not correct'
               })
            }
            if (result) {
               const token = jwt.sign({
                  email: user.email,
                  userId: user._id
               },
                  secretKey,
                  {
                     expiresIn: '8h'
                  },

               )
               return res.status(200).json({
                  message: 'Succefully logged in',
                  token: token,
                  user
               })
            }
         })
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

//get all users
router.get('/', checkAuth,(req, res, next) => {
   User.find({}).exec()
      .then(users => {
         return res.send(users).status(200);
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

// get user by username
router.get('/:username',checkAuth, (req, res, next) => {
   User.findOne({ username: req.params.username }).exec()
      .then(user => {
         if (user) {
            return res.send(user).status(200);
         }
         else
            res.send('No user found').status(404)
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

//delete user by username
router.delete("/:id",checkAuth, (req, res, next) => {
   const id = req.params.id;
   User.deleteOne({ _id: id })
      .exec()
      .then(result => {
         if (result.deletedCount === 1) {
            res.status(200).json({
               message: 'User deleted'
            });
         }
         else {
            res.send('User not found').status(404)
         }

      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});

//edit user profile
router.post("/edit",checkAuth, upload.single('avatar'), (req, res, next) => {
   const username = req.body.username;
   const updateOps = {};
   if (req.body.ops == 'password') {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
         updateOps.password = hash;
         User.updateOne({ username: username }, { $set: updateOps })
            .exec()
            .then(result => {
               if (result.nModified === 1) {
                  res.status(200).json({
                     message: 'User updated'
                  });
               }
               else {
                  res.status(404).send('Operation faild')
               }

            }).catch(err => {
               console.log(err);
               res.status(500).json({
                  error: err
               });
            });
      })
   }
   else {
      updateOps[req.body.ops] = req.body[req.body.ops];
      User.updateOne({ username: username }, { $set: updateOps })
         .exec()
         .then(result => {
            if (result.nModified === 1) {
               res.status(200).json({
                  message: 'User updated'
               });
            }
            else {
               res.status(404).send('Operation faild')
            }

         }).catch(err => {
            console.log(err);
            res.status(500).json({
               error: err
            });
         });

   }
});


//Assign project to user
router.post('/assign',checkAuth, (req, res, next) => {
   console.log(req.body)
   const username = req.body.username;
   User.findOneAndUpdate({ username: username }, { $push: { projects: req.body.projectId } })
      .exec()
      .then((result) => {
         res.status(200).json({
            result
         })
      }).catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
})

//remove project from user
router.post('/removeProject',checkAuth, (req, res, next) => {
   const username = req.body.username;
   User.findOneAndUpdate({ username: username }, { $pull: { projects: req.body.projectId } })
      .exec()
      .then((result) => {
         res.status(200).json({
            message: 'project removed from user',
         })
      }).catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
})


module.exports = router