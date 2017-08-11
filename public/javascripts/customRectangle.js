class customRect extends fabric.Rect
{
  constructor(optionsopt)
  {
    super(optionsopt);
  }

  getArea()
  {
    return this.width * this.height;
  }

  getSides()
  {
    //note this can only be used after setCoords
    var sides = new Object;
    sides.left = this.aCoords.tl.x;
    sides.top = this.aCoords.tl.y;
    sides.right = this.aCoords.br.x;
    sides.bottom = this.aCoords.br.y;

    return sides;
  }
  /*
  When objects are scaled in Canvas, their width and height don't change,
  but scaleX and scaleY are changed to adapt the change in size. I guess
  will work in a better way for things like pictures, since all elements
  in the picture will be scaled properly. However, this will make the border
  of a rectangle to be much thicker. Therefore the following method checks the
  scale and resets the width and height. This however will cause some problem -
  If you drag the upper left corner you will notice the lower right corner moves
  slightly. Not sure how big of a problem this will be. Not sure if this can be
  improved by chaging origX nd origY
  */
  addScalingEvent()
  {
    this.on(
      'scaling', function(event) {
        var pointer = canvas.getPointer(event.e);
        //using canvas might not be the best practice, might move to
        //interface.js later on
        var rect = this;
        rect.setCoords();
        var w = rect.aCoords.tr.x - rect.aCoords.tl.x - 1 ;
        var h = rect.aCoords.bl.y - rect.aCoords.tl.y - 1;
        var sides = rect.getSides();

        if(sides.left<= 0)
        {
          //console.log('left');
          rect.set({"left" : 0 });
          w = sides.right - 1;
        }

        if(sides.right >= canvas.getWidth())
        {
          //console.log('right');
          w = canvas.getWidth() - sides.left - 1;//might not need the -1
        }

        if(sides.top <= 0)
        {
          //console.log('top');
          rect.set({"top" : 0 });
          h = sides.bottom - 1;
        }

        if(sides.bottom >= canvas.getHeight())
        {
          //console.log('bottom');
          h = canvas.getHeight() - sides.top - 1;
        }



        rect.set({
          'height': h,
          'width' : w,
          'scaleX': 1,
          'scaleY': 1
        });

        rect.setCoords();
        canvas.renderAll();

      });
  }

  static calculateIntersectionArea(rectA, rectB)
  {
    var overlapWidth = Math.max(0, (Math.min(rectA.aCoords.tr.x, rectB.aCoords.tr.x)-Math.max(rectA.aCoords.tl.x, rectB.aCoords.tl.x)));
    var overlapHeight = Math.max(0, (Math.min(rectA.aCoords.bl.y, rectB.aCoords.bl.y)-Math.max(rectA.aCoords.tl.y, rectB.aCoords.tl.y)));
    return overlapWidth*overlapHeight;
  }

  static calculateUnionArea(rectA, rectB)
  {
    var totalArea = rectA.getArea()+rectB.getArea();
    return totalArea-this.calculateIntersectionArea(rectA, rectB);
  }

  static intersectionOverUnion(rectA, rectB)
  {
    return this.calculateIntersectionArea(rectA, rectB)/this.calculateUnionArea(rectA, rectB);
  }

}
