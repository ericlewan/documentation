export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
            🥗 Nutrition Coach
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Your AI-powered nutrition coach that makes weight loss tracking feel effortless
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Welcome! 👋
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            This app is currently under development. Soon you'll be able to:
          </p>

          <div className="grid gap-4 text-left">
            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Daily Check-ins</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Share your weight and plans, get personalized targets instantly
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">📸</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Smart Food Logging</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Snap a photo or type what you ate - we'll handle the rest
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Coaching</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Get encouraging, context-aware feedback throughout your day
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-gray-700 rounded-lg">
              <span className="text-2xl">📊</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Real-time Progress</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Watch your daily tracker update as you log meals
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Phase 1: Foundation & Core Setup
        </p>
      </div>
    </main>
  )
}
