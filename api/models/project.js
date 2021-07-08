const mongoose = require('mongoose');
const ProjectSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   name: { type: String },
   dateStart: { type: Date },
   description: { type: String },
   status: {
      type: String,
      enum: ['TO_DO', 'PROGRESS', 'DONE'],
      default: 'TO_DO'
   },
   users: [{ type: Object, ref: 'Users' }],
});


module.exports = mongoose.model('Project', ProjectSchema)