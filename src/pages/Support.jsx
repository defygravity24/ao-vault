import React from 'react';
import { Coffee, Heart, Star, DollarSign, Target, TrendingUp } from 'lucide-react';

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
            Support AO Vault
          </h1>
          <p className="text-xl text-gray-300">
            Keep AO Vault free for everyone
          </p>
        </div>

        {/* Main Message */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8 border border-gray-800">
          <div className="flex items-center mb-4">
            <Heart className="w-6 h-6 text-red-500 mr-2" />
            <h2 className="text-2xl font-semibold">Our Promise</h2>
          </div>
          <p className="text-gray-300 leading-relaxed mb-4">
            AO Vault is and always will be <span className="text-amber-400 font-semibold">FREE</span>.
            No ads, no tracking, no paywalls. We believe everyone in the fanfiction community deserves
            great tools, regardless of their ability to pay.
          </p>
          <p className="text-gray-400">
            Your optional support helps keep the servers running and enables us to add new features faster.
          </p>
        </div>

        {/* Costs Breakdown */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Monthly Costs */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-green-500 mr-2" />
              <h3 className="text-lg font-semibold">Monthly Costs</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Server Hosting</span>
                <span className="text-gray-200">$25.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Domain & SSL</span>
                <span className="text-gray-200">$1.25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Apple Developer</span>
                <span className="text-gray-200">$8.25</span>
              </div>
              <div className="border-t border-gray-700 mt-2 pt-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-amber-400">Total</span>
                  <span className="text-amber-400">$34.50/month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-semibold">Support Status</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">This Month</span>
                  <span className="text-gray-200">$0 / $35</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                <p>Supporters this month: 0</p>
                <p>All-time supporters: 0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ko-fi Button */}
        <div className="text-center mb-12">
          <a
            href="https://ko-fi.com/aovault"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 font-bold rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <Coffee className="w-6 h-6 mr-2" />
            Support on Ko-fi
          </a>
          <p className="text-sm text-gray-500 mt-3">
            Takes 30 seconds • Secure via PayPal or Stripe
          </p>
        </div>

        {/* What Your Support Enables */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8 border border-gray-800">
          <div className="flex items-center mb-4">
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <h2 className="text-2xl font-semibold">What Your Support Enables</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="text-amber-400 mr-2">✓</div>
              <div>
                <p className="font-medium">Keep the app free forever</p>
                <p className="text-sm text-gray-500">No paywalls, ever</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-amber-400 mr-2">✓</div>
              <div>
                <p className="font-medium">Faster feature development</p>
                <p className="text-sm text-gray-500">More time to code = more features</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-amber-400 mr-2">✓</div>
              <div>
                <p className="font-medium">Android version</p>
                <p className="text-sm text-gray-500">With enough support, coming soon!</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="text-amber-400 mr-2">✓</div>
              <div>
                <p className="font-medium">Better servers</p>
                <p className="text-sm text-gray-500">Faster syncing and backups</p>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="bg-gray-900 rounded-lg p-8 mb-8 border border-gray-800">
          <div className="flex items-center mb-4">
            <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-2xl font-semibold">Support Milestones</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-20 text-sm text-gray-500">$35/mo</div>
              <div className="flex-1">
                <div className="font-medium">Cover all costs</div>
                <div className="text-sm text-gray-500">App stays free, servers stay up</div>
              </div>
            </div>
            <div className="flex items-center opacity-50">
              <div className="w-20 text-sm text-gray-500">$200/mo</div>
              <div className="flex-1">
                <div className="font-medium">Enhanced features</div>
                <div className="text-sm text-gray-500">CDN for faster downloads, better search</div>
              </div>
            </div>
            <div className="flex items-center opacity-50">
              <div className="w-20 text-sm text-gray-500">$500/mo</div>
              <div className="flex-1">
                <div className="font-medium">Part-time development</div>
                <div className="text-sm text-gray-500">Faster updates, Android version begins</div>
              </div>
            </div>
            <div className="flex items-center opacity-50">
              <div className="w-20 text-sm text-gray-500">$1000/mo</div>
              <div className="flex-1">
                <div className="font-medium">Full-time development</div>
                <div className="text-sm text-gray-500">Dedicate myself to AO Vault completely</div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Ways to Support */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Other Ways to Support</h2>
          <div className="space-y-3 text-gray-300">
            <p className="flex items-start">
              <span className="text-amber-400 mr-2">→</span>
              <span><strong>Share the app:</strong> Tell your friends who read fanfiction</span>
            </p>
            <p className="flex items-start">
              <span className="text-amber-400 mr-2">→</span>
              <span><strong>Leave a review:</strong> 5-star App Store reviews help others find us</span>
            </p>
            <p className="flex items-start">
              <span className="text-amber-400 mr-2">→</span>
              <span><strong>Report bugs:</strong> Help us make the app better</span>
            </p>
            <p className="flex items-start">
              <span className="text-amber-400 mr-2">→</span>
              <span><strong>Suggest features:</strong> Your ideas shape the app's future</span>
            </p>
          </div>
        </div>

        {/* Thank You */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-lg mb-2">
            Thank you for being part of the AO Vault community! 💜
          </p>
          <p className="text-sm">
            Whether you donate or just use the app, your support means everything.
          </p>
        </div>
      </div>
    </div>
  );
}