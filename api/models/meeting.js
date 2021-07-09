const mongoose = require('mongoose');

const Meeting = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   title: { type: String },
   date: { type: Date },
   projectId: { type: String },
   description: { type: String },
   collaborators: [{ type: Object, ref: 'User' }]
});

module.exports = mongoose.model('Meeting', Meeting)