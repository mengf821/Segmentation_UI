class customCanvas extends fabric.Canvas
{
  /*
  Constructor: customCanvas(el, optionsopt)
  Parameters: HTMLElement or String el - to select HTML <canvas> element
              Object optionsopt - to set the properties of the canvas
  Return value: an instance of the customCanvas class
  Description: This is a constructor for customCanvas, the optionsopt
  values can be found in http://fabricjs.com/docs/fabric.Canvas.html.
  The value should be in the form of {key1: value1, key2: value2...}
  */
  constructor(el, optionsopt)
  {
    super(el, optionsopt);
    this.mode = new States();
  }

  /*
  Method: setCursorToDefault()
  Parameters:
  Return value:
  Description: set the cursor values to default (the original value for cursors)
  Note: cursorMap is not part of the documentation, I think this is supposed to
  be a private variable, but its only purpose is to set the cursor when it is
  on the corners
  */
  setCursorToDefault()
  {
    this.cursorMap = ['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'crosshair';
    this.hoverCursor = 'move';
    this.moveCursor = 'move';
    this.rotationCursor = 'crosshair';
  }

  /*
  Method: setDrawingCursor()
  Parameters:
  Return value:
  Description: set the cursor values for drawing mode
  */
  setDrawingCursor()
  {
    this.cursorMap = ['default','default','default','default','default','default','default','default'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'default';
    this.moveCursor = 'default';
    this.rotationCursor = 'default';
  }

  /*
  Method: setSelectCursor()
  Parameters:
  Return value:
  Description: set the cursor values for select mode
  */
  setSelectCursor()
  {
    this.cursorMap = ['crosshair','crosshair','crosshair','crosshair','crosshair','crosshair','crosshair','crosshair'];
    this.defaultCursor = 'crosshair';
    this.freeDrawingCursor = 'crosshair';
    this.hoverCursor = 'crosshair';
    this.moveCursor = 'crosshair';
    this.rotationCursor = 'crosshair';
  }

  /*
  Method: setResizeCursor()
  Parameters:
  Return value:
  Description: set the cursor values for resize mode
  */
  setResizeCursor()
  {
    this.cursorMap = ['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'default';
    this.moveCursor = 'default';
    this.rotationCursor = 'default';
  }

  /*
  Method: setMoveCursor()
  Parameters:
  Return value:
  Description: set the cursor values for move mode
  */
  setMoveCursor()
  {
    this.cursorMap = ['default','default','default','default','default','default','default','default'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'move';
    this.moveCursor = 'move';
    this.rotationCursor = 'default';
  }

  /*
  Method: setDeleteCursor()
  Parameters:
  Return value:
  Description: set the cursor values for delete mode
  */
  setDeleteCursor()
  {
    this.cursorMap = ['default','default','default','default','default','default','default','default'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'default';
    this.moveCursor = 'default';
    this.rotationCursor = 'default';
  }

  /*
  Method: setBackground(imgPath)
  Parameters: String imgPath - the path to the image intended to be used for
  background
  Return value:
  Description: sets the background image of the canvas and adjust the canvas
  side to be the size of the image. The maximum width or height is 0.8 of the
  widow width or height, and the minimum width or height is 0.3 of the width of
  height of the image(minWidth ~ 760, minHeight ~ 435)
  Note: the page is not responsive, if the window is resized after an image is
  loaded the size of the image will not change.
  */
  setBackground(imagePath)
  {
    var canvas = this;
    var tempImg = new Image();
    var tempFabricImg;
    tempImg.src = imagePath;


    //This is called after the image is loaded
    tempImg.onload = function() {

      /*
      Calculate the factor that the image is going to be scaled to,
      The width/height of the image will be 80% of the window's
      width and height if the window is big enough. To keep the image's original
      width to height ratio,the smaller of the widthRatio and heightRatio is
      taken as the final scale factor
      */
      var windowWidth = window.outerWidth;
      var windowHeight = window.outerHeight;
      var imgAdjustedWidth = windowWidth * 0.8;
      var imgAdjustedHeight = windowHeight * 0.8;
      var widthRatio = imgAdjustedWidth/tempImg.width;
      var heightRatio = imgAdjustedHeight/tempImg.height;
      if(heightRatio < widthRatio)
        widthRatio = heightRatio;
      else
        heightRatio = widthRatio;

      /*
      Set the dimensions of the image to be the maximum of 0.3*the dimensions
      of the image and the precalculatedRaio * the dimensions
      */
      tempImg.width = Math.max(tempImg.width * 0.3, tempImg.width * widthRatio);
      tempImg.height = Math.max(tempImg.height * 0.3, tempImg.height * heightRatio);
      canvasWidth = tempImg.width;
      canvasHeight= tempImg.height;

      /*
      Construct an instance of fabric.Image to be used as the background of the
      canvas
      */
      tempFabricImg = new fabric.Image(tempImg, {
        evented : false,
        originX : 'left',
        originY : 'top'
      });

      canvas.setBackgroundImage(tempFabricImg, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top'
      });

      /*
      reset the height and width of the canvas
      */
      canvas.setHeight(canvasHeight);
      canvas.setWidth(canvasWidth);
      canvas.calcOffset();
      //$('canvas').addClass('center');
    }
  }

  /*
  Method: addScalingEvent()
  Parameters:
  Return value:
  Description: this adds an event listener to the canvas for object:scaling
  event. When objects are scaled in canvas, by default, each dimension of the
  object is multiplied by a scaling factor. This might be the optimal scaling
  option for most of the objects. However, in this case, if the default option
  is used, the stoke width of the rectangles will increase. Therefore a custom
  method needs to be used to accommodate the design. With this event listener
  added, the rectangle will be resized without the stroke width being changed.
  This should be called right after the customCanvas is instantiated, and
  the method will only work for rectangles.
  */
  addScalingEvent()
  {
    this.on('object:scaling', function(event){

      var rect = event.target;

      //Get updated coordinate values for the rectangle
      rect.setCoords();

      //Get the information of the sides of the rectangle
      var sides = rect.getSides();

      /*
      Using sides to calculate the width and height is a much more accurate
      way of calcualting the width and height of the new rectangle than using
      rect.width * rect.scaleX and rect.height * rect.scaleY. Please note that
      in this case, with a stroke width of 1, the width is the difference
      between the right and left side minus 1 and the height is the difference
      between the bottom and top sides minus 1
      */
      var w = sides.right - sides.left - 1;
      var h = sides.bottom - sides.top - 1;

      /*
      Checks whether the sides of the rectangle are out of the boundaries of
      the canvas, if so, set restriction on the sides so that they are limited
      by the boundaries of the canvas.
      */
      if(sides.left<= 0)
      {
        //console.log('left');
        rect.set({"left" : 0 });
        w = sides.right - 1;
      }

      if(sides.right >= this.getWidth())
      {
        //console.log('right');
        w = this.getWidth() - sides.left - 1;
      }

      if(sides.top <= 0)
      {
        //console.log('top');
        rect.set({"top" : 0 });
        h = sides.bottom - 1;
      }

      if(sides.bottom >= this.getHeight())
      {
        //console.log('bottom');
        h = this.getHeight() - sides.top - 1;
      }

      /*
      Reset the properties of the rectangle
      */
      rect.set({
        'height': h,
        'width' : w,
        'scaleX': 1,
        'scaleY': 1
      });

      //Update the coordinates of the rectangle and renders the canvas again
      rect.setCoords();
      this.renderAll();
    });
  }

  /*
  Method: addMovingEvent()
  Parameters:
  Return value:
  Description: this adds an event listener to the canvas for object:moving
  event. The main purpose is to restrict the rectangle to be within the
  boundaries of the canvas. This should be called right after the customCanvas
  is instantiated, and the method will only work for rectangles.
  */
  addMovingEvent()
  {
    this.on('object:moving', function(event){
      var rect = event.target;

      //Update the coordinates of the rectangle

      rect.setCoords();
      var w = rect.width;
      var h = rect.height;
      var sides = rect.getSides();

      /*
      Set the position of the rectangle so that it is limited by the boundaries
      of the canvas
      */
      if(sides.left<= 0)
      {
        rect.set({"left" : 0 });
      }

      if(sides.right >= this.getWidth())
      {
        rect.set({"left" : this.getWidth() - w - 1});
      }

      if(sides.top <= 0)
      {
        rect.set({"top" : 0 });
      }

      if(sides.bottom >= this.getHeight())
      {
        rect.set({"top" : this.getHeight - h - 1});
      }

      rect.setCoords();
      this.renderAll();

    })
  }


}
