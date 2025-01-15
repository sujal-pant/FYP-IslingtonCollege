// app/page.tsx (Home or Public Page)
'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="home-page">
      <h1>Welcome to Share It</h1>
      <p>Explore amazing features and join now.</p>
      <button
        onClick={() => router.push('/auth')} // Redirect to the auth page
        className="join-button"
      >
        Join Now
      </button>
    </main>
  );
}
