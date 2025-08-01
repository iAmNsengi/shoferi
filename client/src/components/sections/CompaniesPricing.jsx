const CompaniesPricing = () => {
  return (
    <div className="bg-secondary-600 text-white py-20 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Hire the Best Drivers
        </h2>
        <p className="text-green-200 mb-12 max-w-2xl mx-auto">
          Shoferi connects you with verified, experienced drivers across Rwanda.
          Post job offers, manage applicants, and build your fleet.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold mb-2">Starter</h3>
            <p className="text-green-100 mb-4">Free</p>
            <ul className="text-left space-y-2 mb-6">
              <li>✔️ Post or Apply 1 job/month</li>
              <li>✔️ Access to driver profiles</li>
              <li>❌ Verification Badge</li>
              <li>❌ Post on your Feed</li>
              <li>❌ Comment on Posts</li>
            </ul>
            <button className="w-full bg-white text-green-700 font-semibold py-2 rounded-full hover:scale-105 transition-all">
              Start for Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white/20 p-8 rounded-2xl shadow-xl border border-green-300 hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold mb-2">Pro</h3>
            <p className="text-green-300 mb-4">RWF 3,000/month</p>
            <ul className="text-left space-y-2 mb-6">
              <li>✔️ Post and apply up to 10 jobs/month</li>
              <li>✔️ Priority driver matching</li>
              <li>✔️ Verification Badge</li>
              <li>✔️ Post on your Feed</li>
              <li>✔️ Comment on Posts</li>
            </ul>
            <button className="w-full bg-green-300 text-green-900 font-semibold py-2 rounded-full hover:scale-105 transition-all">
              Upgrade to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/10 p-8 rounded-2xl shadow-xl border border-white/20 hover:scale-105 transition-transform">
            <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
            <p className="text-green-100 mb-4">Custom Pricing</p>
            <ul className="text-left space-y-2 mb-6">
              <li>✔️ Unlimited job posts</li>
              <li>✔️ Dedicated support</li>
              <li>✔️ Company dashboard</li>
              <li>✔️ Verification Badge</li>
            </ul>
            <button className="w-full bg-white text-green-700 font-semibold py-2 rounded-full hover:scale-105 transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPricing;
