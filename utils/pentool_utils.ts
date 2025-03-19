import { FreeHandDrawing, LayerType, ShapeColor } from "@/types/canvasRawTypes";

export const createPathLayerFromStroke = (
  coordinates: number[][],
  LastUsedColor: ShapeColor
): FreeHandDrawing => {
  if (coordinates.length < 2) {
    throw new Error("Cannot transform points");
  }

  let left = coordinates[0][0],
    top = coordinates[0][1],
    right = left,
    bottom = top;

  for (const [x, y] of coordinates) {
    if (x < left) left = x;
    if (y < top) top = y;
    if (x > right) right = x;
    if (y > bottom) bottom = y;
  }

  return {
    type: LayerType.PenTool,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    backgroundColor: LastUsedColor,
    coordinates: coordinates.map(([x, y, pressure = 1]) => [x - left, y - top, pressure]),
  };
};

export const convertStrokeToSvgPath  = (stroke: number[][]): string => {
  if (stroke.length < 2) return "";

  let path = `M ${stroke[0][0]} ${stroke[0][1]}`;
  for (let i = 1; i < stroke.length - 1; i++) {
    const [x0, y0] = stroke[i];
    const [x1, y1] = stroke[i + 1];
    path += ` Q ${x0} ${y0} ${(x0 + x1) / 2} ${(y0 + y1) / 2}`;
  }

  const lastPoint = stroke[stroke.length - 1];
  path += ` L ${lastPoint[0]} ${lastPoint[1]} Z`;
  
  return path;
};
