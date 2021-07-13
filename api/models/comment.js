const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   text: { type: String },
   createdAt: { type: Date },
   taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
   username: {type: String },
   image: {type: String},
   firstName: { type: String },
   lastName: { type: String },
});


module.exports = mongoose.model('Comment', CommentSchema)