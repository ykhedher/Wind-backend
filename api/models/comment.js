const mongoose = require('mongoose');
const CommentSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   
});


module.exports = mongoose.model('Comment', CommentSchema)