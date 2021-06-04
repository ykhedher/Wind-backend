const mongoose = require('mongoose');

const Tasklog = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   message: { type: String },
});

module.exports = mongoose.model('Tasklog', Tasklog)