const mongoose = require('mongoose');

const BacklogSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   createdAt: { type: Date },
   projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
   tasksId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
});

module.exports = mongoose.model('Backlog', BacklogSchema)