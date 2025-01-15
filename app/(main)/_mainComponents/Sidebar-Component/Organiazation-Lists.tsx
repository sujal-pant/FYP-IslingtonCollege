'use client'

import { useOrganizationList } from '@clerk/nextjs'
import { Elementoviewhover } from '../Element-Overview-Hover'

export const OrganizationList = () => {
  const { userMemberships } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  if (!userMemberships?.data?.length) return null

  return (
    <ul className="space-y-4">
      {userMemberships.data.map(membersorg => (
        <Elementoviewhover
          key={membersorg.organization.id}
          id={membersorg.organization.id}
          name={membersorg.organization.name}
          imageUrl={membersorg.organization.imageUrl}
        />
      ))}
    </ul>
  )
}
