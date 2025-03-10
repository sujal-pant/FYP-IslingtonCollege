
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import {
  Camera,
  ShapeColor,
  Layer,
  LayerType,
  
  Point,
  RectEdge,
  ResizeCoordinate,
} from '@/types/canvasRawTypes'

// Array of predefined colors to be used for user avatars
const UserDisplayedColor = [
  '#34D399',  // Green
  '#10B981',  // Dark Green
  '#9333EA',  // Purple
  '#3B82F6',  // Blue
  '#E11D48',  // Red
  '#6D28D9',  // Violet
  '#F43F5E',  // Pink
  '#EF4444',  // Red 
  '#22D3EE',  // Light Blue
];

// Function to assign a color based on the connectionId
// It uses the % operator to cycle through the colors in the array based on the connectionId.
export const usercolor = (connectionId: number): string =>
  UserDisplayedColor[connectionId % UserDisplayedColor.length]; // Ensures the index stays within the bounds of the array

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

// Function to get the canvas coordinates from a pointer event, taking into account the camera's offset
export const getCanvasCoordinatesFromPointer  = (
  e: React.PointerEvent,
  camera: Camera
) => {
  return {
    // Calculate the X coordinate on the canvas by subtracting the camera's X offset from the pointer's X position
    x: Math.round(e.clientX) - camera.x,
    // Calculate the Y coordinate on the canvas by subtracting the camera's Y offset from the pointer's Y position
    y: Math.round(e.clientY) - camera.y,
  }
}

export function colors (color: ShapeColor) {

  return `#${color.r.toString(16).padStart(2, '0')}${color.g
    .toString(16)
    .padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

/**
 * This function calculates the new boundary (position and size) of a resizable element
 * based on the current position, the edge being resized, and the mouse pointer location.
 * It adjusts the boundary dynamically as the user drags the resize edge.
 */
export const calculateResizedBoundary = (
  CurrentPositionAndSize: ResizeCoordinate,
  edge: RectEdge, 
  point: Point
): ResizeCoordinate => {
  // Initializing the current result with the current position and size of the element
  const result = {
    x: CurrentPositionAndSize.x,
    y: CurrentPositionAndSize.y,
    width: CurrentPositionAndSize.width,
    height: CurrentPositionAndSize.height,
  }

  // Adjusting the boundary based on the left edge
  if ((edge & RectEdge.Left) === RectEdge.Left) {
    adjustBoundaryForResize(result, point, CurrentPositionAndSize, 'Left')
  }

  // Adjusting the boundary based on the right edge 
  if ((edge & RectEdge.Right) === RectEdge.Right) {
    adjustBoundaryForResize(result, point, CurrentPositionAndSize, 'Right')
  }

  // Adjusting the boundary based on the top edge 
  if ((edge & RectEdge.Top) === RectEdge.Top) {
    adjustBoundaryForResize(result, point, CurrentPositionAndSize, 'Top')
  }

  // Adjusting the boundary based on the bottom edge 
  if ((edge & RectEdge.Bottom) === RectEdge.Bottom) {
    adjustBoundaryForResize(result, point, CurrentPositionAndSize, 'Bottom')
  }

  // Returning the calculated updated boundary of the element
  return result
}

/**
 * This helper function adjusts the boundary for the specific edge being resized (left, right, top, or bottom).
 * It recalculates the position and size based on the mouse pointer location.
  */
const adjustBoundaryForResize = (
  result: ResizeCoordinate,
  point: Point,
  CurrentPositionAndSize: ResizeCoordinate,
  edge: string 
) => {
  // If the left edge is being resized
  if (edge === 'Left') {
    result.x = Math.min(point.x, CurrentPositionAndSize.x + CurrentPositionAndSize.width) // Updating the x position
    result.width = Math.abs(CurrentPositionAndSize.x + CurrentPositionAndSize.width - point.x) // Updating the width
  } 
  // If the right edge is being resized
  else if (edge === 'Right') {
    result.x = Math.min(point.x, CurrentPositionAndSize.x) // Updating the x position
    result.width = Math.abs(point.x - CurrentPositionAndSize.x) // Updating the width
  } 
  // If the top edge is being resized
  else if (edge === 'Top') {
    result.y = Math.min(point.y, CurrentPositionAndSize.y + CurrentPositionAndSize.height) // Updating the y position
    result.height = Math.abs(CurrentPositionAndSize.y + CurrentPositionAndSize.height - point.y) // Updating the height
  } 
  // If the bottom edge is being resized
  else if (edge === 'Bottom') {
    result.y = Math.min(point.y, CurrentPositionAndSize.y) // Updating the y position
    result.height = Math.abs(point.y - CurrentPositionAndSize.y) // Updating the height
  }
}
export const selectLayersWithinRect = (
  layerIds: readonly string[],
  layers: ReadonlyMap<string, Layer>,
  a: Point,
  b: Point
): string[] => {
  // Calculating the bounds of the selection rectangle.
  const x1 = Math.min(a.x, b.x);
  const y1 = Math.min(a.y, b.y);
  const x2 = Math.max(a.x, b.x);
  const y2 = Math.max(a.y, b.y);

  return layerIds.filter((id) => {
    const layer = layers.get(id);
    if (!layer) return false;

    const { x, y, width, height } = layer;
    const layerRight = x + width;
    const layerBottom = y + height;

    // Checking for intersection:
    return x2 > x && x1 < layerRight && y2 > y && y1 < layerBottom;
  });
};


export const getStickyNoteTextColor = (color: ShapeColor): 'black' | 'white' => {
  if (
    color.r < 0 || color.r > 255 ||
    color.g < 0 || color.g > 255 ||
    color.b < 0 || color.b > 255
  ) {
    throw new Error('Invalid RGB color values. Must be in the range [0, 255].');
  }

  const luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;

  
  return luminance > 182 ? 'black' : 'white';
};

