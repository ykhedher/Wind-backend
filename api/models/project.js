const mongoose = require('mongoose');
const ProjectSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   name: { type: String },
   dateStart: { type: Date },
   description: { type: String },
   status: {
      type: String,
      enum: ['TO DO', 'PROGRESS', 'TEST', 'APPROVED'],
      default: 'TO DO'
   },
});


module.exports = mongoose.model('Project', ProjectSchema)