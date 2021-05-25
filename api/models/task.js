const mongoose = require('mongoose');
const TaskSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   text:{type: String},
   createdAt:{type: Date}
});


module.exports = mongoose.model('Task', TaskSchema)