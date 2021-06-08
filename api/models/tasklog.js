const mongoose = require('mongoose');

const Tasklog = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   messages : [{date : Date, message : String}]
});

module.exports = mongoose.model('Tasklog', Tasklog)