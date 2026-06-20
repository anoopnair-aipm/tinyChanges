import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
            🎯 tinyChanges
          </div>
          <div className="flex gap-4">
            <Link
              href="/login"
              className="px-6 py-2 text-blue-600 font-semibold hover:text-blue-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-teal-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-3xl w-full text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Keep Your Children Organized
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A simple, fun platform for managing tasks, earning rewards, and building great habits together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-teal-700 transition shadow-lg hover:shadow-xl"
            >
              Start Free Today
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition"
            >
              Learn More
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Task Management</h3>
              <p className="text-gray-700">Create tasks with deadlines, priorities, and descriptions. Track progress in real-time.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-8 border border-teal-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reward System</h3>
              <p className="text-gray-700">Kids earn rewards for completing tasks on time. Perfect motivation for good habits.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-8 border border-cyan-200 hover:shadow-lg transition">
              <div className="text-5xl mb-4">👨‍👩‍👧</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Family First</h3>
              <p className="text-gray-700">Designed for families. Safe, simple, and fun for both parents and children.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-lg mb-8 text-white/90">Join thousands of families building better habits together.</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition shadow-lg"
          >
            Sign Up with Google
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>© 2026 tinyChanges. Making family management simple and fun.</p>
        </div>
      </footer>
    </main>
  );
}
