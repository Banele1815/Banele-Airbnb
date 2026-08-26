import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-50 border-t border-airbnb-light mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* 4-column link grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="text-sm font-semibold text-airbnb-dark mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-airbnb-gray">
              {['Help Centre', 'Safety information', 'Cancellation options', 'Report a concern'].map((l) => (
                <li key={l}><a href="#" className="hover:underline hover:text-airbnb-dark transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-airbnb-dark mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-airbnb-gray">
              {['Airbnb.org: disaster relief', 'Support refugees', 'Combating discrimination', 'Community forum'].map((l) => (
                <li key={l}><a href="#" className="hover:underline hover:text-airbnb-dark transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-airbnb-dark mb-4">Hosting</h3>
            <ul className="space-y-2 text-sm text-airbnb-gray">
              {[
                { label: 'Try hosting', to: '/register' },
                { label: 'AirCover for Hosts', to: '#' },
                { label: 'Explore resources', to: '#' },
                { label: 'Hosting responsibly', to: '#' },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link to={to} className="hover:underline hover:text-airbnb-dark transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-airbnb-dark mb-4">Banele Airbnb</h3>
            <ul className="space-y-2 text-sm text-airbnb-gray">
              {['Newsroom', 'New features', 'Careers', 'Investors', 'Gift cards'].map((l) => (
                <li key={l}><a href="#" className="hover:underline hover:text-airbnb-dark transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright + social + selectors */}
        <div className="border-t border-airbnb-light pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-airbnb-gray">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {year} Banele Airbnb, Inc.</span>
            <span className="hidden sm:inline">·</span>
            <a href="#" className="hover:underline hover:text-airbnb-dark transition-colors">Privacy</a>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-airbnb-dark transition-colors">Terms</a>
            <span>·</span>
            <a href="#" className="hover:underline hover:text-airbnb-dark transition-colors">Sitemap</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Social links */}
            <a href="#" aria-label="Facebook" className="hover:text-airbnb-dark transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="#" aria-label="Twitter / X" className="hover:text-airbnb-dark transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-airbnb-dark transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>

            {/* Language selector */}
            <button className="flex items-center gap-1 hover:text-airbnb-dark transition-colors" aria-label="Change language">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              English (ZA)
            </button>

            {/* Currency selector */}
            <button className="hover:text-airbnb-dark transition-colors font-medium" aria-label="Change currency">
              ZAR R
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
