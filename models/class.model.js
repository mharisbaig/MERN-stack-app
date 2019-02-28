var mongoose = require('mongoose');

var ClassSchema = mongoose.Schema({
    _id: String,    
    section: String,
    createdOn: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Class', ClassSchema);