/*
Declare a new canvas object, add listeners to object:scaling and object:moving
events
*/
var canvas = new customCanvas('canvas', {selection: false});
canvas.addScalingEvent();
canvas.addMovingEvent();

/*
Declare constants
SELECTION_OVERLAP_THRESHOLD: if the intersection/union value for the rectangle
drawn in select mode and an existing rectangle is lower than this threshold,
then the rectangle will not be selected
SNAP_OVERLAP_THRESHOLD: if the intersection/union value beween any rectangles
drawn in draw mode and an existing rectangle is greater than or equal to this
value, then the rectangle will bedeleted as it is considered to be a replica
of an existing rectangle
MINIMUM_LENGTH_HEIGHT: if the width or height of a newly drawn rectangle is
smaller than this value, the rectangle will be deleted. (the feature should
also be added to resizing rectangle)
IMG_DIR: the directory for all images
*/
const SELECTION_OVERLAP_THRESHOLD = 0.7;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const MINIMUM_LENGTH_HEIGHT = 10;
const IMG_DIR ='/images/';


//Variable declarations
var canvasWidth = 0;
var canvasHeight = 0;
var isDown, origX, origY;
var tempRect;
var activeRect;
var selectedRect;

/*
Stores the existing rectangles on the page. I think using this is better than
using canvas.getObjects() because all objects will be returned by that method,
regardless of whether the object will be deleted after mouse up event. The array
should only store rectangles drawn in "draw" mode or from the initially
generated segmentation that are considered to be valid(dosn't have a very
small height or width, doesn't get deleted after mouse up etc.)
*/
var rects = [];

/*
stores the order of index that the images is going to be returned from
the server
*/
var imgIndexArr = [];

/*tracks the number of images shown to the user, imgIndex[arrIndex] will be
used as the index of the image that the client requests from the server */
var arrIndex = 0;

/*
Ajax call to get the number of images in the images folder. An array will then
be generated with index from 0 to numberOfImage-1. The array will be suffled
so that each time the client will provide a different image index to the server
which ensures images are displayed in random order.
*/
$.get('/getImageNumber', {}, function(data) {
}, "json").done(function(result){
  var imgNum = result.imgNum;
  for(var i = 0; i < imgNum; i++)
  {
    imgIndexArr.push(i);
  }

  shuffle(imgIndexArr);
  setNewBackground(IMG_DIR, canvas);
});


/*Listens to the clicking event of draw button, change the mode to draw*/
$( "#drawBtn" ).click(function() {

  /*
  Reset the properties of active rectangles and discard any active object,
  so that no rectangles will be accidentally selected
  */
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "evented"      : false,
      "lockScalingX" : true,
      "lockScalingY" : true,
      "lockMovementX": true,
      "lockMovementY": true
    });
  }
  canvas.discardActiveObject();
  canvas._activeObject = null;
  canvas.renderAll();
 	canvas.mode.setState('draw');
  canvas.setDrawingCursor();
});

/*Listens to the the clicking event of select button, change the mode to select*/
$( "#selectBtn" ).click(function() {
  /*resets the property of active rectangle*/
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "evented"      : false,
      "lockScalingX" : true,
      "lockScalingY" : true,
      "lockMovementX": true,
      "lockMovementY": true
    });
  }
 	canvas.mode.setState('select');
  canvas.setSelectCursor();
});

/*Listens to the click of resize button, change the mode to resize*/
$( "#resizeBtn" ).click(function() {
  activeRect = canvas.getActiveObject();

  //sets the properties of the rectangle, so that is will not move
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "lockMovementX": true,
      "lockMovementY": true
    });

  }
 	canvas.mode.setState('resize');
  canvas.setResizeCursor();

  //Sets the properties of the rectangle so that resize is allowed
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "evented"      : true,
      "lockScalingX" : false,
      "lockScalingY" : false,
    });
  }

});

/*Listens to the clicking event of the move button, change the mode to move*/
$( "#moveBtn" ).click(function() {

  //Sets properties of rectangle so that it will not be resized by accident
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "lockScalingX" : true,
      "lockScalingY" : true,
    });

  }
 	canvas.mode.setState('move');
  canvas.setMoveCursor();
  activeRect = canvas.getActiveObject();

  //Sets properties of the rectangle to allow movement
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "evented"      : true,
      "lockMovementX": false,
      "lockMovementY": false
    });

  }
});

/*Listens to the clicking event of the delete button, deletes selected
rectangle*/
$( "#deleteBtn" ).click(function() {
  activeRect = canvas.getActiveObject();
  if(activeRect)
  {
    activeRect.set({
      "evented"      : false,
      "lockScalingX" : true,
      "lockScalingY" : true,
      "lockMovementX": true,
      "lockMovementY": true
    });
  }
  //sets the state to delete
 	canvas.mode.setState('delete');

  //deletes the selected rectangle from the rect array
  rects = rects.filter(function(rect){
    return rect !== activeRect;
  });

  //discard the active object on the canvas
  canvas.discardActiveObject();

  /*
  this is a supposed to be a private variable, but for some reason
  discardActiveObject may not work occasionally. There might be some problem
  with my implementation. This is really strange because discardActiveObejct()
  sets _activeObject = null interally.
  */
  canvas._activeObject = null;

  //removes the object from canvas
  canvas.remove(activeRect);
  activeRect = null;
  canvas.renderAll();
  canvas.setDeleteCursor();
});

/*Listens to the clicking event of the submit button, sends the segmentation
information to the server and resets the canvas*/
$( "#submitBtn" ).click(function() {
  var final_result = [];
  rects.forEach(function(rect){
    rect.setCoords();//update the coordinates of all rectangles
    var sides = rect.getSides();

    //store the information of the sides of the rectangles in an array
    final_result.push(sides);
  });

  requestParam = {rectangle_data: final_result};

  /*
  Ajax post request to send the segmentation information collected to the
  server
  */
  $.post('/submitData',requestParam, function(data) {
    console.log(":)");
    //console.log(data);
    //  $('#results').html(data);
  });

  //Sets new background for the canvas
  setNewBackground(IMG_DIR, canvas);
  rects = [];

  //clears the canvas
  canvas.clear();

  //discards all active objects
  canvas.discardActiveObject();

  /*
  Discards active objects. _activeObject is supposed to be a private variable,
  therefore this should probably not be done. But for some reason the canvas
  may not be cleared if this call is not made. I am not sure why because
  canvas.discardActiveObject() sets canvas._activeObject = null inside the
  method
  */
  canvas._activeObject = null;

  //renders new canvas and resets the state
  canvas.renderAll();
  canvas.mode.setState('draw');
});

/*
Adds event listener to before:selection:cleared, stores the target of the event
in a variable that is going to be used in the listener of selection:cleared
*/
canvas.on("before:selection:cleared", function(event){
    selectedRect = event.target;
});

/*
Addes event listener to event "selection:cleared". This will set the target
of before:selection:cleared to be active again in resize, move and delete
mode to prevent the target to be accidentally deselected
*/
canvas.on("selection:cleared", function(event){
  if(canvas.mode.resize || canvas.mode.move || canvas.mode.delete)
  {
    canvas.setActiveObject(selectedRect);
    canvas.renderAll();
  }
  else
  {
    selectedRect.set({
      "evented"      : false,
      "lockScalingX" : true,
      "lockScalingY" : true,
      "lockMovementX": true,
      "lockMovementY": true
    });
  }
});

/*
Listens to after:render event and calculates element offset relative to the
document
*/
canvas.on("after:render", function(){
    canvas.calcOffset();
});

/*listens for the mouse up event, and performs appropriate action depending
on the current mode*/
canvas.on('mouse:up', function(event){
	isDown = false;

  /*
  In draw mode, it checks whether the rectangle is deleted because it is too
  similar to an existing rectangle or has a very small width or height. If the
  rectangle is not deleted, it will be added to rects array.
  */
  if(canvas.mode.draw)
  {
    if(!snap())
    {
      rects.push(tempRect);
    }

  }

  /*
  In select mode, it checks whether the rectangle overlaps with another
  rectangle, deletes the rectangle used for selection purpose and set the
  target rectangle to be the active object
  */
  else if(canvas.mode.select)
  {
    var overlapRect = checkForOverlap(SELECTION_OVERLAP_THRESHOLD);
    canvas.remove(tempRect);

    if(overlapRect)
    {
      canvas.setActiveObject(overlapRect);
    }

  }

  //The following are implemented just in case it will be used in the future
  else if(canvas.mode.resize)
  {
    //var temp = canvas.getActiveObject();
  }
  else
  {
    //return;
  }

  tempRect = null;
});

/*Listens to the mouse down event and performs appropriate action*/
canvas.on('mouse:down', function(event){
	isDown = true;

  //Gets where the pointer is (where the cursor is pointing to)
	var pointer = canvas.getPointer(event.e);
	origX = pointer.x;
	origY = pointer.y;

  /*
  Initializes rectangles for draw and select mode, the rectangle will have
  different properties, and they will have height and width of 0 and positioned
  right at the pointer.
  */
	if(canvas.mode.draw)
	{
		initDrawingRectangle(pointer);
	}
	else if(canvas.mode.select)
	{
		initSelectionRectangle(pointer);
	}
});

/*Listens for mouse:move event and performs appropriate action*/
canvas.on('mouse:move', function(event){

  //checks whether the mouse is down
  if (!isDown) return;

  /*
  Rectangles will be drawn for selet and draw mode. This implementation is
  flawed because the corners that are not dragged will also sometimes change
  its position. It also doesn't limit the rectangle to the boundaries of the
  canvas
  */
  if(canvas.mode.select || canvas.mode.draw)
  {
    var pointer = canvas.getPointer(event.e);

    /*
    Resets the left or top value if the position of the cursor is greater
    than the initial left or top value
    */
  	if(origX>pointer.x){
  		tempRect.set({"left": Math.abs(pointer.x)});
  	}
  	if(origY>pointer.y){
  		tempRect.set({"top": Math.abs(pointer.y)});
  	}

    /*
    Set the width and height of the rectangle to be difference between the
    original x and y and the pointer values
    */
  	tempRect.set({"width": Math.abs(origX - pointer.x)});
  	tempRect.set({"height": Math.abs(origY - pointer.y)});

    tempRect.setCoords();

    //canvas.add(tempRect);
  	canvas.renderAll();
  	canvas.calcOffset();
  }
  if(tempRect != null && tempRect != undefined)
  {
    tempRect.setCoords();
  }
});

//initializes a rectangle for draw mode
function initDrawingRectangle(pointer)
{
	tempRect = new customRect({
		left               : pointer.x,
		top                : pointer.y,
		originX            : 'left',
		originY            : 'top',
		width              : 0,
		height             : 0,
		angle              : 0,
		fill               : 'rgba(0, 0, 0, 0)',
		stroke             : 'rgba(0, 255, 0, 1)',//'black'
		strokeWidth        : 1,
		lockRotation       : true,
    selectable         : true,
		padding            : 0,
		hasRotatingPoint   : false,
    /*
    If the object is not evented, it cannot be a target of events, and
    listeners for scaling and moving events will not work for the object if it
    is not evented
    */
    evented            : false,//need to be true for resize, move and delete
    lockMovementX      : true,//need to be false for move
    lockMovementY      : true,//need to be false for move
    lockScalingX       : true,//need to be false for resize
    lockScalingY       : true,//need to be false for resize
    cornerStyle        : 'circle',
    cornerColor        : 'rgba(167, 66, 244, 0.5)',
    borderColor        : 'rgba(167, 66, 244, 0.5)',
    transparentCorners : false,
    objectCaching      : false
    /*
    I am not certain why this is - but if f you delete "objectCaching: false"
    scaling will not work. (without it,  there will be weird lines during
    scaling)
    */
	});

  //adds the rectangle to canvas
	canvas.add(tempRect);
}

//initialize rectangle for selection mode
function initSelectionRectangle(pointer)
{
	tempRect = new customRect({
		left             : pointer.x,
		top              : pointer.y,
		originX          : 'left',
		originY          : 'top',
		width            : 0,
		height           : 0,
		angle            : 0,
		fill             : 'rgba(36, 115, 242, 0.2)',
		lockRotation     : true,
		selectable       : false,
		padding          : 0,
		hasRotatingPoint : false,
    evented          : false
	});
	canvas.add(tempRect);
}

//Function used to check for overlap. The returned value will be null if
//the intersectionOverUnion ratio is less than the threshold between
//the tempRect and any existing rectangle. Otherwise the rectangle that
//has the hightest intersectionOverUnion ratio will be returned
function checkForOverlap(threshold)
{
  var overlapRect = null;
  var maxOverlap = -1;
  rects.forEach(function(rect)
  {
    var overlapIndex = customRect.intersectionOverUnion(rect, tempRect);
    if(overlapIndex >= threshold && overlapIndex >= maxOverlap)
    {
      maxOverlap = overlapIndex;
      overlapRect = rect;
    }
  });
  return overlapRect;
}

/*
The snapping function currently doesn't snap the sides of two rectangles
together. It only checks if the new rectangle is too similar to another existing
rectangle or if the width or height of the new rectangle is too small. If either
of these criterias are met, then the new rectangle will be deleted.
*/
function snap()
{
  var threshold = MINIMUM_LENGTH_HEIGHT;

  if(tempRect.width <= threshold || tempRect.height <= threshold)
  {
    canvas.remove(tempRect);
    return true;
  }

  var overlapRect = checkForOverlap(SNAP_OVERLAP_THRESHOLD);

  if(overlapRect)
  {
    canvas.remove(tempRect);
    return true;
  }
  return false;

}

/*function that contains an Ajax call of a get request. The image index will
be returned from a shuffule array that contains distinct index values from 0
to numberOfImage - 1. The image name will then be returned from an array of
image names from the server. After the response gets to the client, the
background image will be reset. And getSegmentation(imgName) will also be called
*/
function setNewBackground(dir, canvas){
  $.get('/getImage', {index:imgIndexArr[arrIndex]}, function(data, textStatus, jqXHR) {
  }, "json").done(function(result){
    var fileName = result.image;
    console.log(fileName);
    imgNum = result.imageNum;
    canvas.setBackground(dir+fileName);
    arrIndex = (arrIndex+1)%imgNum;
    getSegmentation(fileName.replace('.png',''));
  }
  );

}

/*
This function contains an Ajax call from the server that is supposed to send
the segmentation read from the database as the response. However, the server
par is incomplete
*/
function getSegmentation(imgName){
  $.get('/getImageSegmentation', {imgName:imgName}, function(data) {
  }, "json").done(function(result){
    var segmentation = result.segmentation;
    console.log(segmentation);
  });
}


//function used to shuffle an array
function shuffle(arr)
{
  var curr = arr.length;
  var random;
  var temp;

  while(curr != 0)
  {
    random = Math.floor(Math.random() * curr);
    curr-=1;

    temp = arr[curr];
    arr[curr] = arr[random];
    arr[random] = temp;
  }

  return arr;
}

//Initial snapping of the rectangle after the rectangle is drawn, not
//implemented yet 
function initialSnap(threshold)
{

}
