const mongoose = require('mongoose');
const TaskSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   name: { type: String },
   description: { type: String },
   status: {
      type: String,
      enum: ['TO DO', 'PROGRESS', 'TEST', 'APPROVED'],
      default: 'TO DO'
   },
   priority: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW']
   },
   createdAt: { type: Date },
   estimation: { type: Number },
   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   lastUpdated: { type: Date },
   lastUpdatedBy: { type: String }

});


module.exports = mongoose.model('Task', TaskSchema)