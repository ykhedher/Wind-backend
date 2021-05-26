const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   text: { type: String },
   createdAt: { type: Date },
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


module.exports = mongoose.model('Comment', CommentSchema)