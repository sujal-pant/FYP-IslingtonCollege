'use client'

import { ModelRenameGlobal } from '@/components/modals/Model-Rename-Global'
import { useEffect, useState } from 'react'


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <ModelRenameGlobal />
}