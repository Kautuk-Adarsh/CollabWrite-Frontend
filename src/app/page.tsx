import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Welcome to Collabwrite!</h1>
      <p className="text-lg text-center">
        Your real-time document collaboration platform.
      </p>
      <div className="mt-8">
        <Link href="/login" className="bg-blue-500 text-white px-6 py-3 rounded-md mr-4">
          Login
        </Link>
        <Link href="/register" className="bg-green-500 text-white px-6 py-3 rounded-md">
          Register
        </Link>
      </div>
    </main>
  );
}