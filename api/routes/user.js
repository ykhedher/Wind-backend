const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const multer = require('multer')
const jwt = require('jsonwebtoken');
const {sendMail} = require('../services/emailSender')
const checkAuth = require('../middleware/checkAuth');

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, 'uploads/')
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '.jpg') //Appending .jpg
   }
})

const upload = multer({ storage: storage })

// Create user
router.post('/signup', upload.single('image'), (req, res, next) => {
   let password = req.body.password
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
            .then(() => {
               const token = jwt.sign({
                  email: user.email,
                  userId: user._id
               },
                  process.env.TOKEN_SECRET_KEY_SIGNUP,
                  {
                     expiresIn: '8h'
                  },

               )
               sendMail(user.email, user.firstName, password, token);
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
         if (user.isVerified) {
            bcrypt.compare(req.body.password, user.password, (err, result) => {
               if (!result) {
                  return res.status(401).json({
                     message: 'Password is not correct'
                  })
               }
               if (result) {
                  const token = jwt.sign({
                     email: user.email,
                     userId: user._id,
                     image: user.image,
                     firstName: user.firstName,
                     lastName: user.lastName,
                     username: user.username,
                     userType: user.userType,
                     projects: user.projects
                  },
                     process.env.TOKEN_SECRET_KEY_LOGIN,
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
         }
         else {
            return res.status(401).json({
               message: 'Please verify your email',
            })
         }

      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         })
      })
})

//get all users
router.get('/', checkAuth, (req, res, next) => {
   // console.log(req.userData)
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
router.get('/:username', checkAuth, (req, res, next) => {
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
router.delete("/:id", checkAuth, (req, res, next) => {
   const id = req.params.id;
   User.deleteOne({ _id: id })
      .exec()
      .then(result => {
         if (result.deletedCount === 1) {
            res.status(200).json({
               message: 'User deleted',
               result
            });
         }
         else {
            res.status(404).json({
               message: 'User not found'
            })
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
router.post("/edit", checkAuth, upload.single('avatar'), (req, res, next) => {
    console.log(req.body);
   const id = req.body._id
   const updateOps = req.body;
   if (req.body.ops == 'password') {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
         updateOps.password = hash;
         User.updateOne({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
               if (result.nModified === 1) {
                  User.findOne({ _id: id }).exec()
                     .then((result) => {
                        res.status(200).json({
                           result: result,
                           message: 'User updated Succefully',

                        });
                     }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                           error: err
                        });
                     });
               }
               else {
                  res.status(404).json({
                     message: 'Operation faild'
                  })
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
      User.updateOne({ _id: id }, { $set: req.body })
         .exec()
         .then(result => {
            if (result.nModified === 1) {
               res.status(200).json({
                  message: 'User updated Successfully'
               });
            }
            else {
               res.status(404).send('Operation faild');
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
router.post('/assign', checkAuth, (req, res, next) => {
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
router.post('/removeProject', checkAuth, (req, res, next) => {
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

router.get('/verify/:token', (req, res) => {
   const token = req.params.token
   try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY_SIGNUP);
      User.findOne({ _id: decoded.userId }).then(user => {
         if (!user) return res.status(404).json('Link expired');
         if (user.isVerified) return res.status(404).json('Email is already verifed');
         User.updateOne({ _id: decoded.userId }, { isVerified: true, isActive: true }).then(() => {
            return res.status(201).json('Your email is verified !')
         })
      })

   } catch (error) {
      return res.status(401).json({
         message: 'Error',
         error
      })
   }
})

module.exports = router