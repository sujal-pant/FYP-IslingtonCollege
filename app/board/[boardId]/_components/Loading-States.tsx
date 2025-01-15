"use client"
import { Loader } from 'lucide-react'
import { InfoSkeleton } from './Canvas-Info'
import  { CurrentActiveParticipantsSkeleton } from './Current-Active-Participants'
import  { ToolbarSkeleton } from './Canvas-ToolBar'
export const Loading = () => (
  <main className="h-full w-full relative bg-neutral-100 touch-none flex items-center justify-center">
    <Loader className="h-6 w-6 text-muted-foreground animate-spin" />
    <InfoSkeleton />
    <CurrentActiveParticipantsSkeleton/>
    <ToolbarSkeleton/>
  </main>
)