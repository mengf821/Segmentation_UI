class customCanvas extends fabric.Canvas
{
  constructor(el, optionsopt)
  {
    super(el, optionsopt);
    this.mode = new States();
  }

  // _setCursorFromEvent(e, target)
  // {
  //
  // }

  setCursorToDefault()
  {
    this.cursorMap = ['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'crosshair';
    this.hoverCursor = 'move';
    this.moveCursor = 'move';
    this.rotationCursor = 'crosshair';
  }

  setDrawingCursor()
  {
    this.cursorMap = ['default','default','default','default','default','default','default','default'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'default';
    this.moveCursor = 'default';
    this.rotationCursor = 'default';
  }

  setSelectCursor()
  {
    this.cursorMap = ['crosshair','crosshair','crosshair','crosshair','crosshair','crosshair','crosshair','crosshair'];
    this.defaultCursor = 'crosshair';
    this.freeDrawingCursor = 'crosshair';
    this.hoverCursor = 'crosshair';
    this.moveCursor = 'crosshair';
    this.rotationCursor = 'crosshair';
  }

  setResizeCursor()
  {
    this.cursorMap = ['n-resize', 'ne-resize', 'e-resize', 'se-resize', 's-resize', 'sw-resize', 'w-resize', 'nw-resize'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'default';
    this.moveCursor = 'default';
    this.rotationCursor = 'default';
  }

  setMoveCursor()
  {
    this.cursorMap = ['default','default','default','default','default','default','default','default'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'move';
    this.moveCursor = 'move';
    this.rotationCursor = 'default';
  }

  setDeleteCursor()
  {
    this.cursorMap = ['default','default','default','default','default','default','default','default'];
    this.defaultCursor = 'default';
    this.freeDrawingCursor = 'default';
    this.hoverCursor = 'default';
    this.moveCursor = 'default';
    this.rotationCursor = 'default';
  }

  setBackground(imagePath)
  {
    var canvas = this;
    var tempImg = new Image();
    var tempFabricImg;
    tempImg.src = imagePath;

    tempImg.onload = function() {
      tempImg.width = tempImg.width * 0.3;
      tempImg.height = tempImg.height * 0.3;
      canvasWidth = tempImg.width;
      canvasHeight= tempImg.height;
      tempFabricImg = new fabric.Image(tempImg, {
        evented : false,
        originX : 'left',
        originY : 'top'
      });
      canvas.setBackgroundImage(tempFabricImg, canvas.renderAll.bind(canvas), {
        originX: 'left',
        originY: 'top'
      });
      canvas.setHeight(canvasHeight);
      canvas.setWidth(canvasWidth);
      canvas.calcOffset();
    }
  }

}
