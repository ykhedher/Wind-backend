const mongoose = require('mongoose');

const SprintSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   dateStart: { type: Date },
   dateEnd: { type: Date },
   isActive: { type: Boolean }
});


module.exports = mongoose.model('Sprint', SprintSchema)