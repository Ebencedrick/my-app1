import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">AdPlatform</Link>
        <div className="flex gap-4">
          <Link href="/login" className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">Login</Link>
          <Link href="/signup" className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors">Get Started</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your business. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Pay-as-you-go */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pay-as-you-go</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for testing the waters</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">15%</span>
              <span className="text-gray-600 dark:text-gray-400"> management fee</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> No monthly subscription
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> All ad platforms included
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Basic support
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Mobile Money & crypto payments
              </li>
            </ul>
            <Link href="/signup?plan=pay-as-you-go" className="block w-full py-3 text-center border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
              Get Started
            </Link>
          </div>

          {/* Growth */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-indigo-600 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Growth</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">For growing businesses</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$29</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ 10% management fee</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Everything in Pay-as-you-go
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Priority support
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Advanced analytics
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> A/B testing features
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Custom reporting
              </li>
            </ul>
            <Link href="/signup?plan=growth" className="block w-full py-3 text-center bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>

          {/* Agency */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Agency</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">For marketing agencies</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$99</span>
              <span className="text-gray-600 dark:text-gray-400">/month</span>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">+ 8% management fee</div>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Everything in Growth
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Dedicated account manager
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> White-label reporting
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> API access
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <span className="text-green-500 mr-2">✓</span> Custom integrations
              </li>
            </ul>
            <Link href="/signup?plan=agency" className="block w-full py-3 text-center border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Need help choosing?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Our team is here to help you find the perfect plan for your business.</p>
          <Link href="/signup" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors">
            Talk to an Expert
          </Link>
        </div>
      </main>
    </div>
  );
}
