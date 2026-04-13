const toggles = [
  { label: 'Daily progress email', on: true },
  { label: 'Weekly summary', on: true },
  { label: 'Achievement notifications', on: false },
]

export default function SettingsPage() {
  return (
    <div>
      <h1 className="font-heading font-extrabold text-[28px] mb-8">Settings</h1>

      {/* Family Profile */}
      <section>
        <h2 className="font-heading font-bold text-lg mb-4">Family Profile</h2>
        <div className="bg-brand-cream rounded-card p-6 border border-brand-cream-dark space-y-4">
          <div>
            <label className="font-heading font-semibold text-sm text-brand-ink mb-1.5 block">
              Name
            </label>
            <input
              type="text"
              defaultValue="Emma's Family"
              className="w-full px-4 py-3 rounded-chunky border border-brand-cream-dark bg-brand-parchment text-brand-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-shadow"
            />
          </div>
          <div>
            <label className="font-heading font-semibold text-sm text-brand-ink mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              defaultValue="parent@example.com"
              className="w-full px-4 py-3 rounded-chunky border border-brand-cream-dark bg-brand-parchment text-brand-ink font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-indigo focus:border-transparent transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mt-8">
        <h2 className="font-heading font-bold text-lg mb-4">Notifications</h2>
        <div className="bg-brand-cream rounded-card p-6 border border-brand-cream-dark space-y-0 divide-y divide-brand-parchment-dark">
          {toggles.map((toggle) => (
            <div key={toggle.label} className="flex items-center justify-between py-4">
              <span className="font-body font-semibold text-sm text-brand-ink">
                {toggle.label}
              </span>
              <div
                className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                  toggle.on ? 'bg-brand-indigo' : 'bg-brand-cream-dark'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    toggle.on ? 'translate-x-[22px]' : 'translate-x-0.5'
                  }`}
                  style={{ marginTop: '2px' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <button className="mt-6 bg-brand-indigo text-white font-heading font-bold px-6 py-3 rounded-button hover:bg-brand-indigo-light transition-colors">
        Save Changes
      </button>
    </div>
  )
}
