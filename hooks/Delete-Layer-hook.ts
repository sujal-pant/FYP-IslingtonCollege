
import { useSelf, useMutation } from '@/liveblocks.config'

export const deletelayerhook = () => {
  const currentSelection = useSelf(me => me.presence.selection)

  return useMutation(
    ({ storage, setMyPresence }) => {
      const curreliveLayers = storage.get('layers')
      const currentliveLayerIds = storage.get('layerIds')

      for (const id of currentSelection) {
        curreliveLayers.delete(id)

        const currentIdx = currentliveLayerIds.indexOf(id)

        if (currentIdx !== -1) {
            currentliveLayerIds.delete(currentIdx)
        }
      }

      setMyPresence({ selection: [] }, { addToHistory: true })
    },
    [currentSelection]
  )
}
