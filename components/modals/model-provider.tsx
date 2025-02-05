'use client'

import { ModelRenameGlobal } from '@/components/modals/Model-Rename-Global'
import { useEffect, useState } from 'react'

export const ModalProvider: React.FC = () => {
  // State to track whether the component is mounted
  const [mounted, setMounted] = useState(false)

  // useEffect to set mounted to true after the component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent rendering on the server-side to avoid hydration issues
  if (!mounted) return null

  // Render the modal component after mounting
  return <ModelRenameGlobal />
}
