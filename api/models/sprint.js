const mongoose = require('mongoose');

const SprintSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   dateStart: { type: Date },
   dateEnd: { type: Date },
   isActive: { type: Boolean },
   projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
   tasks : [{type: Object, ref: 'Task'}]
});


module.exports = mongoose.model('Sprint', SprintSchema)