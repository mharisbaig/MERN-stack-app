var express = require('express');
var router = express.Router();
var methodOverride = require('method-override')

var pdf = require('pdfkit');
var fs = require('fs');

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

//mongoose.connect(uri, options);
//mongoose.connection.on('error', err => console.error(`MongoDB connection error: ${err}`));

mongoose.connect('mongodb://localhost:27017/mbbs', { useMongoClient: true });

mongoose.connection.on('error', err => console.error('MongoDB connection error: ${err}'));
/*    ALL MODELS   */

var Student = require('../models/mbbs.model');
var Class =require('../models/class.model');

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method
      delete req.body._method
      return method
    }
  }))

router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/main', function(req, res, next){  
  Student.find(function(err, students){
        if(err){
            res.send(err);
        }
        else{
            //console.log(students);            
            res.render('index', { mydata: students});
        }
    });  
});


router.post('/', function(req, res, next) {
  
  var email = req.body.txtusername;
  var pwd = req.body.txtpwd;

  console.log(email);
  console.log(pwd);

  if(email === 'shahab' && pwd === '12345')
  {
    //res.send('Login Successfully');
    res.redirect('/main');
  }
  else {
    res.send('Invalid username or password');
  }
});

router.get('/mbbsaddnew', function(req, res, next){
  Class.find(function(err, classes){
    if(err){
        res.send(err);
    }
    else{
        //console.log(students);  
        res.render('mbbsadd', {my_class: classes});          
        //res.render('index', { mydata: students, myclasses:classes});
    }
  })
  
  //res.send('mbbs add data')
});


router.post('/mbbsaddnew', function(req, res){
  console.log('---------------------');
   
   var student_data = new Student();

   student_data.studentname = req.body.txtsname;
   student_data.fathername = req.body.txtfname,
   student_data.dobirth = req.body.dt_dob,

   student_data.doaddmission = req.body.dt_doad,
   student_data.email = req.body.txtemail,
   student_data.mobile = req.body.txtmobile,

   student_data.dograduate = req.body.dt_dograduate,
   student_data.enrolno = req.body.txtenroll,
   student_data.migrationdate = req.body.dt_migrate,
   student_data.migrationclass = req.body.txtmigrclass,

   student_data.migrationfrom = req.body.txtmigrfrom,
   student_data.bookno = req.body.txtbookno,
   student_data.bookcolor = req.body.txtbookcolor,
   student_data.seatno = req.body.txtseatno,
   student_data.certno = req.body.txtcertno,
   student_data.semester = req.body.txtsemester,
   student_data.address = req.body.txtaddress,
   student_data.classname = req.body.class_name

  
  console.log(student_data);

  var class_data = new Class();

/*
  const mongoose = require('mongoose');
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://...');*/
  
      
  student_data.save(function(error){
    if(error){
        console.log('Error is ' + error);
    }
    else{
        console.log('Data inserted...');
    }
  });   

  res.redirect('/mbbsaddnew');

});

// START EDIT STUDENT RECORD

router.get('/editstudent/:id', function(req, res, next){ 
  console.log('param id', req.params.id);

  Student.find({_id: req.params.id}, function(err, students){
        if(err){
            res.send(err);
        }
        else{
            //console.log(students);   

            res.render('editstudent', {studentdata: students});
        }
    });  
});
//edit fee record
router.get('/editfees/:sid/:feeid', function(req, res, next){ 

    let studentid = req.params.sid;
    let feesid = req.params.feeid;

    console.log('STUDENT KEY', studentid);
    console.log('FEEID', feesid);

    let fid;

    var feeRecord;

    Student.findOne({
        '_id': studentid
    }).populate('fees', '_id')
      .exec(
        function(err, company) {
          if (err) res.status(500).send(err);

          console.log('FEE LEN',company.fees.length);

          for(i = 0; i < company.fees.length; i++){
            if(feesid == company.fees[i]._id){
                fid = company.fees[i];
                //res.json(company.fees[i]);
            }
          }
          console.log(fid);
          res.json(fid);
          



          //res.json(company.fees);
        });

    /*
    Student.find({_id: studentid}, function(err, students){
        if(err){
            res.send(err);
        }
        else{
            console.log(students.length);
            
                feeRecord = students;

                var newData = [];

                
                console.log('feeRecord', feeRecord);
                res.end();
                //res.render('editfees', {mydata : feeRecord}); 
                
          
        }
        
    });
    */
    
  

            
    }
); 



 //end fee edit



 // UPDATE EDITED FORM DATA

router.post('/editstudent/:id', function(req, res){ 
  console.log('UPDATE KEY', req.params.id);
  var name = req.body.txtsname;

  console.log('UPDATE DOCUMENT', name);
  //res.send('UPDATE DOCUMENT');

  //res.send(name);


  Student.update({_id: req.params.id}, { $set: { studentname: req.body.txtsname, fathername: req.body.txtfname ,address:req.body.txtaddress,email: req.body.txtemail,enrolno :req.body.txtenroll,dobirth :req.body.dt_dob,doaddmission:req.body.dt_doad,mobile: req.body.txtmobile}}, function(err, students){
        if(err){
            res.send(err);
            console.log('if error', err);
        }
        else{
            console.log('else block', students);   

            //res.render('editstudent', {studentdata: students});


            res.redirect('/main');
        }
    });  
    
});

// REPORT CLASS WISE

router.get('/report/classwise', function(req, res, next){ 
  //console.log('param id', req.params.id);

  //START PDF

  var mydoc = new pdf;
    bufferPages: true;
  
  mydoc.pipe(fs.createWriteStream('c:/node.pdf'));
  
  //mydoc.font('Times-Roman');
  mydoc.fontSize(30);
  mydoc.text('Dow University of Health Sciences',50,50);
  
  mydoc.fontSize(24);
  mydoc.text('Current Student List');
  
  mydoc.fontSize(16);
  mydoc.text('_____________________');
  //mydoc.fontSize(36);
  
  //mydoc.addPage();
  //mydoc.text("Page Title2");
  //mydoc.underline(100, 100, 160, 27, {color: "#0000FF"})
  //mydoc.lineWidth(25);
  
  //mydoc.addPage();
  //mydoc.text("Page Title3");
  
  //mydoc.addPage();
  //mydoc.text("Page Title4");
  
  //range = mydoc.bufferedPageRange()
  
  
  
  

  // END PDF

  Student.find({}, null, {sort: {classname: 1}}, function(err, students){
        if(err){
            res.send(err);
        }
        else{
            console.log(students.length);
            var sname = '';

            for(i = 0; i < students.length; i++){
                
                mydoc.text(students[i].studentname);
                mydoc.text(students[i].fathername);
                console.log(students[i].fathername);
            }
            
            mydoc.end();

            res.render('report_classwise', {studentdata: students});
        }
    });
     
});

router.get('/fee/:id', function(req, res, next){ 

    let studentid = req.params.id;
    //console.log('STUDENT KEY', studentid);

    var feeRecord;

    /*
    Student.find((err, blogs) => {
        if (err) {
          console.log(err);
        } else {
          //res.render("index", { blogs: blogs });
          var s = blogs.fees.status.sort(function(a, b) {
            return (a.fees.status) - (b.fees.status);
        });


          res.json({ blogs: s })
        }
      });
      */

      // ------------  OK CODE FOR SORT  ----------------
      /*
      const bands = [ 
        { genre: 'Rap', band: 'Migos', albums: 2},
        { genre: 'Pop', band: 'Coldplay', albums: 4},
        { genre: 'Rock', band: 'Breaking Benjamins', albums: 1}
      ];

      function compare(a, b) {
        // Use toUpperCase() to ignore character casing
        const genreA = a.band.toUpperCase();
        const genreB = b.band.toUpperCase();
      
        let comparison = 0;
        if (genreA > genreB) {
          comparison = 1;
        } else if (genreA < genreB) {
          comparison = -1;
        }
        return comparison;
      }
      
      var finalFee = bands.sort(compare);
      res.json(finalFee);
      */

      //----------------------------------------

    
    Student.find({_id: studentid}, function(err, students){
        if(err){
            res.send(err);
        }
        else{
            console.log(students.length);
            
                feeRecord = students;

                var newData = [];

                for(i = 0; i < feeRecord.length; i++){
                    //newData.push(feeRecord[i].fees);
                    //console.log('fee record', feeRecord[i].fees);
                }

                console.log('feeRecord', feeRecord);
                //res.end();
                res.render('fee', {mydata : feeRecord}); 
                
          
        }
        
    });
    
  

    /*
Student.findByIdAndUpdate(
    {_id: '59fb1d1d4769350b38b6a496'},
    {$push: {"fees": { monthof: 'MongoDB in Urdu', amount: '900', paydate: (new Date), status: 'Paid'}}},
    {safe: true, upsert: true, new : true},
    function(err, model) {
        console.log(err);
        console.log(model.fees);
        feeRecord = model;
    }
);
*/


    
    //res.end();
        
    }
);

router.get('/addfee', function(req, res, next){
    //res.send('Fee Add');

    res.render('addfee');
});

router.get('/attendance', function(req, res, next){  
    Student.find({}, null, {sort: {classname: 1}},function(err, students){
          if(err){
              res.send(err);
          }
          else{
              console.log(students);            
              res.render('attendance', { mydata: students});
          }
      });  
  });

router.get('/genefee', function(req, res, next){
    //res.send('Fee Add');

    Student.update({}, function(err, students){
        if(err){
            res.send(err);
        }
        else{
            
            Student.update({},
                {$push: {"fees": { monthof: 'aaa', amount: '9', paydate: (new Date), status: 'UnPaid'}}},
                { multi: true},
                function(err, model) {
                    if(err){ console.log('update err', err); }
                    console.log('update model', model);                    
                }
            );
            
            
          
        }
    });

    res.send('generate fee');
});
router.get('/geneattendance', function(req, res, next){
    //res.send('Fee Add');

    Student.update({}, function(err, students){
        if(err){
            res.send(err);
        }
        else{
            
            Student.update({},
                {$push: {"attendance": { today: (new Date) , status: 'present' }}},
                { multi: true},
                function(err, model) {
                    if(err){ console.log('update err', err); }
                    console.log('update model', model);                    
                }
            );
            
            
          
        }
    });

    res.send('generate fee');
});

module.exports = router;
