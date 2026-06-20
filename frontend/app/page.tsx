import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-4">🎯 tinyChanges</h1>
        <p className="text-xl text-gray-700 mb-8">
          Help your children stay organized with tasks, rewards, and achievements.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition shadow-lg hover:shadow-xl"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition border-2 border-blue-300 shadow-md"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl p-8 shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-4">👨‍👩‍👧‍👦</div>
            <h3 className="font-bold text-lg mb-2 text-blue-900">Family Friendly</h3>
            <p className="text-gray-700">Safe platform designed for children and parents.</p>
          </div>

          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl p-8 shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-bold text-lg mb-2 text-green-900">Task Management</h3>
            <p className="text-gray-700">Create tasks, set deadlines, and track progress.</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl p-8 shadow-md hover:shadow-lg transition">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="font-bold text-lg mb-2 text-orange-900">Reward System</h3>
            <p className="text-gray-700">Earn rewards for completing tasks on time.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
