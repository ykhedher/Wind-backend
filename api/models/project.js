const mongoose = require('mongoose');
const ProjectSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
   
});


module.exports = mongoose.model('Project', ProjectSchema)