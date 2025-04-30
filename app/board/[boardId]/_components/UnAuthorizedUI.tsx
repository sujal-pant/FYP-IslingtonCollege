// components/Unauthorized.tsx
export default function Unauthorized() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
          <p className="text-gray-700 mb-6">
            You are not authorized to view this board.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Go back home
          </a>
        </div>
      </div>
    );
  }
  