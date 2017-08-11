//ALWAYS REMEMBER TO ALL SETCOORDS
var canvas = new customCanvas('canvas', {selection: false});
const SELECTION_OVERLAP_THRESHOLD = 0.7;
const SNAP_OVERLAP_THRESHOLD = 0.9;
const MINIMUM_LENGTH_HEIGHT = 10;
const IMG_DIR ='/images/';
var canvasWidth = 0;
var canvasHeight = 0;
var isDown, origX, origY;
var tempRect;
var activeRect;
var selectedRect;
var rects = [];
var imgIndexArr = [];
var arrIndex = 0;


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

$( "#drawBtn" ).click(function() {
  //to be changed later
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
 	canvas.mode.setState('draw');
  canvas.setDrawingCursor();
});

$( "#selectBtn" ).click(function() {
  if(activeRect != null || activeRect != undefined)
  {
    //might want to change later
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

$( "#resizeBtn" ).click(function() {
  //to be changed later
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "lockMovementX": true,
      "lockMovementY": true
    });

  }
 	canvas.mode.setState('resize');
  canvas.setResizeCursor();
  activeRect = canvas.getActiveObject();

  //to be changed later
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "evented"      : true,
      "lockScalingX" : false,
      "lockScalingY" : false,
    });
  }

});

$( "#moveBtn" ).click(function() {
  //to be changed later
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
  if(activeRect != null || activeRect != undefined)
  {
    activeRect.set({
      "evented"      : true,
      "lockMovementX": false,
      "lockMovementY": false
    });

  }
});

$( "#deleteBtn" ).click(function() {
  //to be changed later
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
 	canvas.mode.setState('delete');
  activeRect = canvas.getActiveObject();
  rects = rects.filter(function(rect){
    return rect !== activeRect;
    //Not sure how much efficiency this will sacrifice
  });

  canvas.remove(activeRect);
  activeRect = null;
  canvas.setDeleteCursor();
});

$( "#submitBtn" ).click(function() {
  var final_result = [];
  rects.forEach(function(rect){
    rect.setCoords();//Just to make sure the coordinates are right
    var sides = rect.getSides();
    final_result.push(sides);
  });
  requestParam = {rectangle_data: final_result};
  $.post('/submitData',requestParam, function(data) {
    console.log(":)");
    //console.log(data);
    //  $('#results').html(data);
  });

  setNewBackground(IMG_DIR, canvas);
  rects = [];
  canvas.clear();
  canvas.discardActiveObject();

  //Probably shouldn't access 'private' varible, but canvas won't clear
  //if this is not done
  canvas._activeObject = null;

  canvas.renderAll();
  canvas.mode.setState('draw');
  //getImageString()
});

canvas.on("before:selection:cleared", function(event){
    selectedRect = event.target;
});

canvas.on("selection:cleared", function(event){
  if(canvas.mode.resize || canvas.mode.move || canvas.mode.delete)
  {
    canvas.setActiveObject(selectedRect);
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

canvas.on("after:render", function(){
    canvas.calcOffset();
});

canvas.on('mouse:up', function(event){
	isDown = false;

  if(canvas.mode.draw)
  {
    if(!snap())
    {
      rects.push(tempRect);//snap validation will be added later
    }

  }
  else if(canvas.mode.select)
  {
    var overlapRect = checkForOverlap(SELECTION_OVERLAP_THRESHOLD);
    canvas.remove(tempRect);

    if(overlapRect)
    {
      canvas.setActiveObject(overlapRect);
    }

  }
  else if(canvas.mode.resize)
  {
    var temp = canvas.getActiveObject();
  }
  else
  {
    //return;
  }

  tempRect = null;
});

canvas.on('mouse:down', function(event){
	isDown = true;

	var pointer = canvas.getPointer(event.e);
	origX = pointer.x;
	origY = pointer.y;
	if(canvas.mode.draw)
	{
		initDrawingRectangle(pointer);
	}
	else if(canvas.mode.select)
	{
		initSelectionRectangle(pointer);
	}
});

canvas.on('mouse:move', function(event){
	if (!isDown) return;
  if(canvas.mode.select || canvas.mode.draw)
  {
    var pointer = canvas.getPointer(event.e);

  	if(origX>pointer.x){
  		tempRect.set({"left": Math.abs(pointer.x)});
  	}
  	if(origY>pointer.y){
  		tempRect.set({"top": Math.abs(pointer.y)});
  	}

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
    evented            : false,//need to be true for resize, move and delete
    lockMovementX      : true,//need to be false for move
    lockMovementY      : true,//need to be false for move
    lockScalingX       : true,//need to be false for resize
    lockScalingY       : true,//need to be false for resize
    cornerStyle        : 'circle',
    cornerColor        : 'rgba(167, 66, 244, 0.5)',
    borderColor        : 'rgba(167, 66, 244, 0.5)',
    transparentCorners : false,
    objectCaching      : false,
    noScaleCahe        : true
    /*
    I might be wrong but I think the reason that scaling didn't work correctly
    is because things are cached.
    (for any previous version, it will result in weird lines and will sometimes
    remain like, this is especially a problem when you drag fast)
    */
	});

	canvas.add(tempRect);
  tempRect.addScalingEvent();
	/*The method of inseration might be changed depending on the
	implementation of selecting rectangle*/
}

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

  /*snap when the width or height or rectangle is smaller than a certain number,
  or when two rectangles overlap*/
}

function setNewBackground(dir, canvas){
  $.get('/getImage', {index:imgIndexArr[arrIndex]}, function(data, textStatus, jqXHR) {
  }, "json").done(function(result){
    var fileName = result.image;
    console.log(fileName);
    imgNum = result.imageNum;
    canvas.setBackground(dir+fileName);
    arrIndex = (arrIndex+1)%imgNum;
  }
  );

}

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

function initialSnap(threshold)
{

}
