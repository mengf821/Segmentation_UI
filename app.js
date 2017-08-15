var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongoose = require('mongoose');
// var index = require('./routes/index');
// var users = require('./routes/users');

var inputDB = 'mongodb://127.0.0.1/generated_rectangle_info';
var outputDB = 'mongodb://127.0.0.1/output_rectangle_info';
var inputConnection = mongoose.connect(inputDB, {useMongoClient: true});
var outputConnection = mongoose.connect(outputDB, {useMongoClient: true});


//console.log(inputConnection);

//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var RectangleSchema = new mongoose.Schema({
  nodeId:{
    type:Number,
    required: true
  },
  left:{
    type:Number,
    required: true
  } ,
  right:{
    type:Number,
    required: true
  } ,
  top:{
    type:Number,
    required: true
  } ,
  bottom:{
    type:Number,
    required: true
  }
});

var inputRectangle = inputConnection.model('Rectangle', RectangleSchema);
var outputRectangle = outputConnection.model('Rectangle',RectangleSchema);

console.log(inputConnection);



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', index);
// app.use('/users', users);

var imgFiles = [];
//I don't think reading this synchonously would be a big problem???...
//But I might change this later
fs.readdirSync(path.join(__dirname,'public/images/')).forEach(file =>{
  if(file.charAt(0) != '.')
  {
    imgFiles.push(file);
  }

});

// fs.readdir('/images/', (err, files)=>{
//   if(err)
//     throw err;
//   files.forEach(file =>{
//     imgFiles.push(file);
//   });
// });

app.get('/', function(req, res){
  res.render('index');
});

app.get('/getImages',function (req, res) {
  res.json({images: imgFiles});
});

app.get('/getImageNumber', function(req,res){
  res.json({imgNum: imgFiles.length});
});


app.get('/getImage',function (req, res) {

  // res.writeHead(200, {"Content-Type": "text/plain"});
  //   res.write(data); // You Can Call Response.write Infinite Times BEFORE response.end
  //   res.end("Hello World\n");
  //console.log(req.query.index);
  //console.log(imgFiles[6]);
  var imageName = imgFiles[req.query.index];
  var imageNum = imgFiles.length;
  console.log(imageName);
  res.json({image: imageName,
            imageNum: imageNum});
  //var image = imgFiles[]
  //res.json({image: 'wikipedia.png'});
  //res.send('wikipedia.png');
});

app.post('/submitData', function(req, res){
  console.log(req.body);
  res.send();
  //res.redirect('/');
  //res.render('index');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
