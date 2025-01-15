import { Room } from "@/components/Room"
import Canvas from "./_components/canvas"
import { Loading } from "./_components/Loading-States"


interface BoardIdPageProps {
  params: { boardId: string }
}

const BoardIdPage = ({ params, }: BoardIdPageProps) => {

 
  return(
    <Room roomId={params.boardId} fallback={<Loading/>}>
    <Canvas boardId={params.boardId} />
  </Room>
  )}
export default BoardIdPage