var mongoose = require('mongoose');
var fs = require('fs');
//dependency: mongoose and file-system, please install with npm install

var inputDB = 'mongodb://127.0.0.1/generated_rectangle_info';
var outputDB = 'mongodb://127.0.0.1/output_rectangle_info';
var inputConnection = mongoose.connect(inputDB, {useMongoClient: true});
var outputConnection = mongoose.connect(outputDB, {useMongoClient: true});

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
var inputRectangle = [];
//var outputRectangle = [];

//console.log(inputConnection);

var imgFiles = [];
//I don't think reading this synchonously would be a big problem???...
//But I might change this later
fs.readdirSync('images').forEach(file =>{
  if(file.charAt(0) != '.')
  {
    imgFiles.push(file.replace('.png',''));
  }

});
//console.log(imgFiles);
// var InputRectModel = input.model("InputRectangle", RectangleSchema);
// var OutputRectModel = output.model("OutRectangle", RectangleSchema);
//console.log(RectModel);

imgFiles.forEach(function(imgName){
  var InputRectModel = inputConnection.model(imgName+"_Input", RectangleSchema);
  var OutputRectModel = outputConnection.model(imgName+"_Output", RectangleSchema);
  // var tempInputCollection = inputConnection.collection(imgName+'_input');
  // console.log(tempInputCollection.model);
  for(var i = 0; i < 20; i++)
  {
    var left, right, bottom, top;
    left = Math.floor(Math.random()*600);
    right = Math.floor(Math.random()*150 + left);
    top = Math.floor(Math.random()*300);
    bottom = Math.floor(Math.random()*130 + top);

    var tempRect = new InputRectModel({nodeId: i,
                                      left: left,
                                      right: right,
                                      bottom: bottom,
                                      top: top});
    tempRect.save(function(error){
      console.log("saved");
      if(error)
      {
        console.log(error);
      }
    });
  }
});
console.log(inputConnection.collection('wikipedia_input'));

//console.log(inputConnection);

//console.log(inputRect);
//console.log(inputConnection);
//console.log(outputRectangle);
