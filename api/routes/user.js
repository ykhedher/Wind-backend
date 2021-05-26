const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer')
var upload = multer({ dest: 'uploads/' })
const jwt = require('jsonwebtoken');
const secretKey = 'wind-secret'

// Create user
router.post('/signup', upload.single('avatar'), (req, res, next) => {
   bcrypt.hash(req.body.password, 10, (err, hash) => {
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
   User.find({ email: req.body.email }).exec()
      .then(user => {
         if (user.length < 1) {
            return res.status(401).json({
               message: 'User not found'
            })
         }
         bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (!result) {
               return res.status(401).json({
                  message: 'Password is not correct'
               })
            }
            if (result) {
               const token = jwt.sign({
                  email: user[0].email,
                  userId: user[0]._id
               },
                  secretKey,
                  {
                     expiresIn: '8h'
                  },

               )
               return res.status(200).json({
                  message: 'Succefully logged in',
                  token: token
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
router.get('/all', (req, res, next) => {
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
router.get('/:username', (req, res, next) => {
   User.find({ username: req.params.username }).exec()
      .then(user => {
         if (user.length === 1) {
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
router.delete("/:username", (req, res, next) => {
   const username = req.params.username;
   User.remove({ username: username })
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
router.post("/edit", upload.single('avatar'), (req, res, next) => {
   const username = req.body.username;
   const updateOps = {};
   for (const ops in req.body) {
      if (ops === 'password') {
         bcrypt.hash(req.body[ops], 10, (err, hash) => {
            password = hash;
            //updateOps.password= password
         })
      }
      else {
         updateOps[ops] = req.body[ops];
      }
   }
   console.log(updateOps)
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

      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});


module.exports = router;