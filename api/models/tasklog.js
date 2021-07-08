const mongoose = require('mongoose');

const Tasklog = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   messages : [{message : String}],
   taskId: {type: mongoose.Schema.Types.ObjectId, ref: 'Task'}
});

module.exports = mongoose.model('Tasklog', Tasklog)