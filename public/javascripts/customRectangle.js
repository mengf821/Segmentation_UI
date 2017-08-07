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
        console.log(pointer.x);
        console.log(pointer.y);
        var rect = this,
        w = rect.width * rect.scaleX,
        h = rect.height * rect.scaleY;
        //w = rect.getScaledWidth();
        //h = rect.getScaledHeight();
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

  setScalingRectangleOrigin(pointer)
  {

  }

  setOriginX(position)
  {
    if(position === "left")
    {
      if(this.originX === "right")
      this.set({
        "originX" : "left",
        "left"    :  this.left - this.width
      });
    }

    else if(position === "right")
    {
      if(this.originX === "left")
      {
        this.set({
          "originX" : "right",
          "left"    :  this.left + this.width
        });
      }
    }
    else
    {
      console.log("Incorrect X position value");
    }

    this.setCoords();
  }

  setOriginY(position)
  {
    if(position === "top")
    {
      if(this.originX === "bottom")
      this.set({
        "originY" : "top",
        "top"    :  this.top - this.height
      });
    }

    else if(position === "bottom")
    {
      if(this.originX === "top")
      {
        this.set({
          "originY" : "bottom",
          "top"    :  this.top + this.height
        });
      }
    }
    else
    {
      console.log("Incorrect Y position value");
    }
    this.setCoords();
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



  // static calculateAreaDifference(rectA, rectB)
  // {
  //   Math.abs(rectA.getArea() - rectB.getArea());
  // }
  //
  // static calculateDistance(pointA, pointB)
  // {
  //   var squareX = Math.pow((pointA.x - pointB.x), 2);
  //   var squareY = Math.pow((pointA.y - pointB.y), 2);
  //   var distance = Math.sqrt(squareX + squareY);
  //
  //   return distance;
  // }
  // static centreCoordDist(rectA, rectB)
  // {
  //   return this.calculateDistance(rectA.getCenterPoint(), rectB.getCenterPoint());
  // }
  //
  // //Returns whether area difference is less than the greatest allowable value
  // static compareArea(targetRect, comparisonRect)
  // {
  //   var allowedErrorFactor = 0.1;
  //   var areaDifference = Math.abs(targetRect.getArea() - comparisonRect.getArea());
  //
  //   return areaDifference <= comparisonRect.getArea() * allowedErrorFactor;
  // }
  //
  // static centreDistWithinAllowedError(rectA, rectB)
  // {
  //   var maxDist = 10;
  //   return this.centreCoordDist(rectA, rectB) <= maxDist;
  // }
  //
  // static widthWithinAllowedError(targetRect, comparisonRect)
  // {
  //   var allowedErrorFactor = 0.1;
  //   var widthDiff = Math.abs(targetRect.width - comparisonRect.width);
  //
  //   //console.log(widthDiff);
  //   return widthDiff <= (comparisonRect.width * allowedErrorFactor);
  // }
  //
  // static heightWithinAllowedError(targetRect, comparisonRect)
  // {
  //   var allowedErrorFactor = 0.1;
  //   var heightDiff = Math.abs(targetRect.height - comparisonRect.height);
  //
  //   //console.log(heightDiff);
  //   return heightDiff <= (comparisonRect.height * allowedErrorFactor);
  // }
  //
  // static matchRectangle(targetRect, comparisonRect)
  // {
  //   var centreWithinError = this.centreDistWithinAllowedError(targetRect, comparisonRect);
  //   var heightWithinError = this.heightWithinAllowedError(targetRect, comparisonRect);
  //   var widthWithinError = this.widthWithinAllowedError(targetRect, comparisonRect);
  //   return (centreWithinError && heightWithinError && widthWithinError);
  // }


}
