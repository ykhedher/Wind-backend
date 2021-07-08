const mongoose = require('mongoose');
const TaskSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   name: { type: String },
   description: { type: String },
   status: {
      type: String,
      enum: ['TO_DO', 'PROGRESS', 'DONE'],
      default: 'TO_DO'
   },
   priority: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW']
   },
   createdAt: { type: Date },
   estimation: { type: Number },
   createdBy: { type: Object, ref: 'User' },
   updatedAt: { type: Date },
   UpdatedBy: { type: String },
   sprintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint' },
   affectedTo: { type: Object, ref: 'User' },
   tasklog: { type: mongoose.Schema.Types.ObjectId, ref: 'Tasklog' },
   projectId: { type: String, ref: 'Project' },
});


module.exports = mongoose.model('Task', TaskSchema)