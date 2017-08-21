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


//var inputDB = 'mongodb://127.0.0.1/generated_rectangle_info';

var outputDB = 'mongodb://localhost/output_rectangle_info';
// var inputConnection = mongoose.connect(inputDB, {useMongoClient: true},function(error)
// {
//   console.log('connected');
//   console.log(inputConnection);
//   if(error)
//     console.log(error);
// });
var inputDB = 'mongodb://localhost:27017/generated_rectangle_info';
var inputConnection;
var outputConnection = mongoose.connect(outputDB, {useMongoClient: true});
//console.log(inputConnection.collections);

//console.log(inputConnection);

//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'MongoDB connection error:'));

/*
Defines schema for rectangles in the database
*/
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

//var inputRectangle = inputConnection.model('Rectangle', RectangleSchema);
//var outputRectangle = outputConnection.model('Rectangle',RectangleSchema);


//console.log(inputConnection);

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


/*
Define an array of image names and read the name of the images from the
files synchronously (an asynchonous call would probably be better, I implemented
this way just to make it easier and I didn't have time to change it). The
asyncrhonous version is shown below the synchonous one in comments. I'm not sure
what kind of impact it will have.
*/
var imgFiles = [];
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

/**************Defining Routes*****************/

//reders index.ejs
app.get('/', function(req, res){
  res.render('index');
});

/*
This is supposed to get the segmentation information of rectangles from the
database. But it doesn't work. I think it is because find() is asynchronous.
Therefore Promise should be used to achieve the expected behaviour.
*/
app.get('/getImageSegmentation', function(req, res){
  //console.log(inputConnection.collections);

  var imgName = req.query.imgName;
  //console.log(imgName);
  var segmentation = [];

  //console.log(inputConnection);
  var InputRectModel = inputConnection.model(imgName.replace('.png','')+'_Input', RectangleSchema);
  InputRectModel.find({},function(error, rect)
  {
    //console.log(rect);
    segmentation.push(rect);
    console.log(rect);
  });
  console.log(segmentation);
  res.json({segmentation: segmentation});
  //  var imgSegmentationModel = inputConnection.model(imgName.replace('.png', '') +'_Intput', RectangleSchema);
  // //console.log(imgSegmentationModel);
  // //var imgSegmentation = imgSegmentationModel.find();
  // imgSegmentationModel.find({}, function(error, segs){
  //   console.log(segs);
  // });

  //res.send();
  //res.json({segmentation:imgSegmentation});
});

//Sends the images to the client as a response
app.get('/getImages',function (req, res) {
  res.json({images: imgFiles});
});

//sends the number of images to the client as the response
app.get('/getImageNumber', function(req,res){
  inputConnection = mongoose.connect(inputDB, {useMongoClient: true});
  //inputConnection = mongoose.connect(inputDB, {useMongoClient: true});
  res.json({imgNum: imgFiles.length});
});


//Sends the image in the image array with a certain index to the client,
//The index is part of the query string from the client
app.get('/getImage',function (req, res) {

  // res.writeHead(200, {"Content-Type": "text/plain"});
  //   res.write(data); // You Can Call Response.write Infinite Times BEFORE response.end
  //   res.end("Hello World\n");
  //console.log(req.query.index);
  //console.log(imgFiles[6]);
  var imageName = imgFiles[req.query.index];
  var imageNum = imgFiles.length;
  //console.log(imageName);
  res.json({image: imageName,
            imageNum: imageNum});
  //var image = imgFiles[]
  //res.json({image: 'wikipedia.png'});
  //res.send('wikipedia.png');
});

//This route method is supposed to write the final segmentation to the database,
//For now it just retrieves the body of the request from the client
app.post('/submitData', function(req, res){
  console.log(req.body);
  var outputRectangles = req.body;


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
