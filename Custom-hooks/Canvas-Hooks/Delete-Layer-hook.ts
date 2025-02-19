import { useSelf, useMutation } from '@/liveblocks.config'

/**
 * Custom hook to delete the currently selected layers.
 * It removes the layer data from the storage and clears the selection.
 */
export const deletelayerhook = () => {
  // Retrieving the currently selected layer IDs from Liveblocks presence.
  const selectedLayerIds = useSelf((me) => me.presence.CurrentlySelectedLayer)

  return useMutation(
    ({ storage, setMyPresence }) => {
      // If no layers are selected
      if (!selectedLayerIds?.length) return

      try {
        // Getting the layers map and the ordered array of layer IDs from storage.
        const layersMap = storage.get('layers')
        const layerOrder = storage.get('layerIds')

        // Looping through each selected layer ID and deleting the layer data 
        selectedLayerIds.forEach((layerId: string) => {
          layersMap.delete(layerId)
          const index = layerOrder.indexOf(layerId)
          if (index !== -1) {
            layerOrder.delete(index)
          }
        })

        // Clearing the current selection after deletion.
        setMyPresence({ CurrentlySelectedLayer: [] }, { addToHistory: true })
      } catch (error) {
        console.error('Error deleting selected layers:', error)
      }
    },
    [selectedLayerIds]
  )
}
