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
   isActive: { type: Boolean, default: false },
   isVerified: { type: Boolean, default: false },
   image: { type: String },
   projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
});


module.exports = mongoose.model('User', userSchema);