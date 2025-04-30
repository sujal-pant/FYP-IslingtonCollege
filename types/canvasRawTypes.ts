/*
 * Defining the raw types used in the canvas.
 * It provides structured representations for different types of layers, user interactions, and canvas states.
 * 
 * - `Color`: Represents an RGB color model.
 * - `LayerType`: Enumerates different types of layers (Rectangle, Ellipse, TextBox, StickyNote).
 * - `RectangleBoxLayer`, `EllipseLayer`, `TextBoxLayer`, `StickyNoteLayer`: 
 *   Describe individual layer structures with position, size, and color properties.
 * - `Point`: Represents a coordinate point on the canvas.
 * - `ResizeCoordinate`: Captures resizing actions and updated dimensions.
 * - `RectEdge`: Specifies edges available for resizing.
 * - `CanvasState`: Represents various states of user interaction with the canvas.
 * - `CanvasMode`: Enumerates different interaction modes (e.g., Clicking, Inserting, Resizing).
 * - `Layer`: A union type encompassing all possible layer types.
 * - `Camera`: Stores the position of the camera view on the canvas.
 */

export type ShapeColor = {
    r: number 
    g: number 
    b: number 
}
export enum LayerType {
    RectangleBox, // Represents a rectangular shape
    Ellipse, // Represents an elliptical shape
    TextBox, // Represents a text box layer
    StickyNote, // Represents a sticky note layer
    PenTool, // Represents a pentool
    ArrowHead, // Represents an arrow with a head

}

export type RectangleBoxLayer = {
    type: LayerType.RectangleBox
    x: number // X-coordinate of the rectangle
    y: number // Y-coordinate of the rectangle
    height: number // Height of the rectangle
    width: number // Width of the rectangle
    backgroundColor : ShapeColor // Fill color of the rectangle   
}
export type FreeHandDrawing = {
    type: LayerType.PenTool;
    x: number;
    y: number;
    height: number;
    width: number;
    backgroundColor: ShapeColor;
    coordinates : number[][];
    value?: string;
  };

export type EllipseLayer = {
    type: LayerType.Ellipse
    x: number // X-coordinate of the ellipse
    y: number // Y-coordinate of the ellipse
    height: number // Height of the ellipse
    width: number // Width of the ellipse
    backgroundColor : ShapeColor // Fill color of the ellipse
}
export type TextBoxLayer = {
    type: LayerType.TextBox
    x: number // X-coordinate of the text box
    y: number // Y-coordinate of the text box
    height: number // Height of the text box
    width: number // Width of the text box
    backgroundColor : ShapeColor // Fill color of the text box
    value?: string //  text content inside the text box
}
export type StickyNoteLayer = {
    type: LayerType.StickyNote
    x: number // X-coordinate of the sticky note
    y: number // Y-coordinate of the sticky note
    height: number // Height of the sticky note
    width: number // Width of the sticky note
    backgroundColor : ShapeColor // Fill color of the sticky note
    value?: string //  text content inside the sticky note
}

export type Point = {
    x: number // X-coordinate of a point
    y: number // Y-coordinate of a point
}

export type ResizeCoordinate = {
    x: number // X-coordinate of the resize action
    y: number // Y-coordinate of the resize action
    width: number // Width after resizing
    height: number // Height after resizing
}

export enum RectEdge {
    Top = 1, // Resizing from the top edge
    Bottom = 2, // Resizing from the bottom edge
    Left = 4, // Resizing from the left edge
    Right = 8, // Resizing from the right edge
}
export type CanvasInteractionState =
    | {
        actionType : ActionMode .Empty // No active interaction
      }
    | {
        actionType : ActionMode .SelectionNet // Dragging to select multiple elements
        origin: Point // Starting point of the selection
        current?: Point //  current position
      }
    | {
        actionType : ActionMode .Transforming // Moving or rotating layers
        current: Point // Current transformation point
      }
    | {
        actionType : ActionMode .Inserting // Inserting a new layer
        layerType:
          | LayerType.Ellipse
          | LayerType.RectangleBox
          | LayerType.TextBox
          | LayerType.StickyNote
      }
    | {
        actionType : ActionMode .Freehand // Drawing a freehand path
      }
    | {
        actionType : ActionMode .Clicking // Clicking an element
        origin: Point // Click position
      }
    | {
        actionType : ActionMode .Resizing // Resizing an element
        initialBounds: ResizeCoordinate // Initial dimensions before resizing
        edge: RectEdge // Corner or edge being resized
      }

export enum ActionMode  {
    Empty, // No interaction
    Clicking, // Clicking on an element
    SelectionNet, // Selecting multiple elements with a drag selection
    Transforming, // Moving, rotating, or scaling elements
    Inserting, // Adding a new element
    Resizing, // Resizing an element
    Freehand, // Freehand drawing mode
}

export type Layer =
    | RectangleBoxLayer
    | EllipseLayer
    | FreeHandDrawing
    | TextBoxLayer
    | StickyNoteLayer


    export type Camera = {
      x: number // X-coordinate position of the camera
      y: number // Y-coordinate position of the camera
      
    }