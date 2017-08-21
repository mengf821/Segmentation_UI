class customRect extends fabric.Rect
{
  /*
  Constructor: customRect(optionsopt)
  Parameters: Object optionsopt - to set the properties of the canvas
  Return value: an instance of the customRect class
  Description: This is a constructor for customRect, the optionsopt
  values can be found in http://fabricjs.com/docs/fabric.Rect.html.
  The value should be in the form of {key1: value1, key2: value2...}
  */
  constructor(optionsopt)
  {
    super(optionsopt);
  }

  /*
  Method: getArea()
  Parameters:
  Return value: Number area
  Description: get the area of the rectangle
  */
  getArea()
  {
    return this.width * this.height;
  }

  /*
  Method: getSides()
  Parameters:
  Return value: Object sides
  Description: get the sides of a rectangle. The return object will have "left",
  "right", "top", and "bottom" values
  */
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
  Method: calculateIntersectionArea
  Parameters:
  Return value: Number intersectionArea
  Description: static method to get the intersection area between two rectangles
  */
  static calculateIntersectionArea(rectA, rectB)
  {
    var overlapWidth = Math.max(0, (Math.min(rectA.aCoords.tr.x, rectB.aCoords.tr.x)-Math.max(rectA.aCoords.tl.x, rectB.aCoords.tl.x)));
    var overlapHeight = Math.max(0, (Math.min(rectA.aCoords.bl.y, rectB.aCoords.bl.y)-Math.max(rectA.aCoords.tl.y, rectB.aCoords.tl.y)));
    return overlapWidth*overlapHeight;
  }

  /*
  Method: calculateUnionArea
  Parameters:
  Return value: Number unionArea
  Description: static method to get the union area between two rectangles
  */
  static calculateUnionArea(rectA, rectB)
  {
    var totalArea = rectA.getArea()+rectB.getArea();
    return totalArea-this.calculateIntersectionArea(rectA, rectB);
  }

  /*
  Method: intersectionOverUnion
  Parameters:
  Return value: Number intersectionUnionRatio
  Description: static method to get ratio between intersection and union area
  of two rectangles
  */
  static intersectionOverUnion(rectA, rectB)
  {
    return this.calculateIntersectionArea(rectA, rectB)/this.calculateUnionArea(rectA, rectB);
  }

}
