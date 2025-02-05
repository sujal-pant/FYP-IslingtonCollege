import { shallow } from '@liveblocks/react'

import { Layer, ResizeCoordinate } from '@/types/canvasRawTypes'
import { useStorage, useSelf } from '@/liveblocks.config'

const Box = (layers: Layer[]): ResizeCoordinate | null => {
  const first = layers[0]

  if (!first) {
    return null
  }

  let left = first.x
  let right = first.x + first.width
  let top = first.y
  let bottom = first.y + first.height

  for (let i = 1; i < layers.length; i++) {
    const { x, y, width, height } = layers[i]

    if (left > x) {
      left = x
    }

    if (right < x + width) {
      right = x + width
    }

    if (top > y) {
      top = y
    }

    if (bottom < y + height) {
      bottom = y + height
    }
  }

  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  }
}

export const selectlayer = () => {
  const selection = useSelf(me => me.presence.CurrentlySelectedLayer)

  return useStorage(root => {
    const currentselectedLayers = selection
      .map(layerId => root.layers.get(layerId)!)
      .filter(Boolean)

    return Box(currentselectedLayers)
  }, shallow)
}