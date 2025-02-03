
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import {
  Camera,
  Color,
  Layer,
  LayerType,
  PathLayer,
  Point,
  RectEdge,
  ResizeCoordinate,
} from '@/types/canvas'

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

export const pointerEventToCanvasPoint = (
  e: React.PointerEvent,
  camera: Camera
) => {
  return {
    x: Math.round(e.clientX) - camera.x,
    y: Math.round(e.clientY) - camera.y,
  }
}

export function colors (color: Color) {


  return `#${color.r.toString(16).padStart(2, '0')}${color.g
    .toString(16)
    .padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`
}

export const resizeBoundary = (
  boundary: ResizeCoordinate,
  corner: RectEdge,
  point: Point
): ResizeCoordinate => {
  const result = {
    x: boundary.x,
    y: boundary.y,
    width: boundary.width,
    height: boundary.height,
  }

  if ((corner & RectEdge.Left) === RectEdge.Left) {
    result.x = Math.min(point.x, boundary.x + boundary.width)
    result.width = Math.abs(boundary.x + boundary.width - point.x)
  }

  if ((corner & RectEdge.Right) === RectEdge.Right) {
    result.x = Math.min(point.x, boundary.x)
    result.width = Math.abs(point.x - boundary.x)
  }

  if ((corner & RectEdge.Top) === RectEdge.Top) {
    result.y = Math.min(point.y, boundary.y + boundary.height)
    result.height = Math.abs(boundary.y + boundary.height - point.y)
  }

  if ((corner & RectEdge.Bottom) === RectEdge.Bottom) {
    result.y = Math.min(point.y, boundary.y)
    result.height = Math.abs(point.y - boundary.y)
  }

  return result
}

