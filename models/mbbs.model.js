var mongoose = require('mongoose');

var FeeSchema = mongoose.Schema({
    monthof: String,
    amount:String,
    paydate:Date,
    status:String
});

var attendanceschema = mongoose.Schema({
    today: Date,
    status:String
    
});



var BookSchema = mongoose.Schema({
    seatno: String,    
    studentname: String,
    fathername: String,
    doaddmission: { type: Date },
    docompletion: { type: Date },    
    enrolno: String,   
    address: String,
    mobile: String,    
    email: String,
    nic: String,
    fphoneno: String,
    mphoneno: String,
    section :String,
    dobirth: { type: Date },    
    classname: String,
    createdOn: { type: Date, default: Date.now},
    fees: [FeeSchema],
    attendance:[attendanceschema]
});

module.exports = mongoose.model('Student', BookSchema);
