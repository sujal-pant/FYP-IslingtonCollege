// app/public/page.tsx

'use client'

import { useRouter } from 'next/navigation'

export default function PublicPage() {
  const router = useRouter()

  const handleJoinClick = () => {
    router.push('/auth') // Redirect to authentication page
  }

  return (
    <div>
      <h1>Welcome to Share It</h1>
      <p>Join us to explore amazing features.</p>
      <button onClick={handleJoinClick} className="join-button">
        Join Now
      </button>
    </div>
  )
}
