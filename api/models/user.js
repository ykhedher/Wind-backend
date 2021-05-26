const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   username: {
      type: String, 
      unique: true
   },
   firstName: { type: String },
   lastName: { type: String },
   email: {
      type: String,
      required: true,
      unique: true,
      match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
   },
   password: { type: String, required: true },
   userType: {
      type: String,
      enum: ['ADMIN', 'SCRUM_MASTER', 'COLLABORATOR'],
      default: 'COLLABORATOR'
   },
   image: { type: String }
});


module.exports = mongoose.model('User', userSchema);