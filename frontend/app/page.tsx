import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">🎯 tinyChanges</h1>
        <p className="text-xl text-white/90 mb-8">
          Help your children stay organized with tasks, rewards, and achievements.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="px-8 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition border border-white/30"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-white">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="text-4xl mb-3">👨‍👩‍👧‍👦</div>
            <h3 className="font-semibold text-lg mb-2">Family Friendly</h3>
            <p>Safe platform designed for children and parents.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-semibold text-lg mb-2">Task Management</h3>
            <p>Create tasks, set deadlines, and track progress.</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-semibold text-lg mb-2">Reward System</h3>
            <p>Earn rewards for completing tasks on time.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
