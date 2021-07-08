const mongoose = require('mongoose');

const Meeting = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   title: {type: String},
   date : {type : Date},
   description: {type: String},
   collaborators: [{type: Object, ref: 'user'}]
});

module.exports = mongoose.model('Meeting', Meeting)