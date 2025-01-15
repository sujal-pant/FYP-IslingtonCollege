export type Color = {
    r: number
    g: number
    b: number
  }
  
  export type Camera = {
    x: number
    y: number
  }
  
  export enum LayerType {
    RectangleBox,
    Ellipse,
    Path,
    TextBox,
    StickyNote,
  }
  
  export type RectangleBoxLayer = {
    type: LayerType.RectangleBox
    x: number
    y: number
    height: number
    width: number
    fill: Color
    value?: string
  }
  
  export type EllipseLayer = {
    type: LayerType.Ellipse
    x: number
    y: number
    height: number
    width: number
    fill: Color
    value?: string
  }
  
  export type PathLayer = {
    type: LayerType.Path
    x: number
    y: number
    height: number
    width: number
    fill: Color
    points: number[][]
    value?: string
  }
  
  export type TextBoxLayer = {
    type: LayerType.TextBox
    x: number
    y: number
    height: number
    width: number
    fill: Color
    value?: string
  }
  
  export type StickyNoteLayer = {
    type: LayerType.StickyNote
    x: number
    y: number
    height: number
    width: number
    fill: Color
    value?: string
  }
  
  export type Point = {
    x: number
    y: number
  }
  
  export type ResizeCoordinate = {
    x: number
    y: number
    width: number
    height: number
  }
  
  export enum  RectEdge {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
  }
  
  export type CanvasState =
    | {
        mode: CanvasMode.Empty
      }
    | {
        mode: CanvasMode.SelectionNet
        origin: Point
        current?: Point
      }
    | {
        mode: CanvasMode.Transforming
        current: Point
      }
    | {
        mode: CanvasMode.Inserting
        layerType:
          | LayerType.Ellipse
          | LayerType.RectangleBox
          | LayerType.TextBox
          | LayerType.StickyNote
      }
    | {
        mode: CanvasMode.Freehand
      }
    | {
        mode: CanvasMode.Clicking
        origin: Point
      }
    | {
        mode: CanvasMode.Resizing
        initialBounds: ResizeCoordinate
        corner: RectEdge
      }
  
  export enum CanvasMode {
    Empty,
    Clicking,
    SelectionNet,
    Transforming,
    Inserting,
    Resizing,
    Freehand,
  }
  
  export type Layer =
    | RectangleBoxLayer
    | EllipseLayer
    | PathLayer
    | TextBoxLayer
    | StickyNoteLayer