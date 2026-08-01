import { NavLink, Link } from 'react-router-dom';
import { useMemo, useState, type PropsWithChildren } from 'react';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/performance', label: 'Performance' },
  { to: '/calculator', label: 'Investment Calculator' },
  { to: '/methodology', label: 'Methodology' },
  { to: '/about', label: 'About NOW Index' },
  { to: '/faq', label: 'FAQ' },
];

export function Layout({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTheme = useMemo(() =>
    theme === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-slate-50 text-slate-950',
  [theme]);

  return (
    <div className={`min-h-screen ${pageTheme}`}>
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="text-lg font-semibold tracking-wide text-white">
            Quant_NOW <span className="text-sky-400">Performance</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <nav className="hidden gap-2 md:flex">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 text-sm transition ${
                      isActive ? 'bg-sky-500/20 text-sky-300' : 'text-slate-300 hover:bg-slate-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <button className="rounded-full border border-slate-700 px-3 py-2 text-sm text-slate-200 md:hidden" onClick={() => setMobileOpen((v) => !v)}>
              Menu
            </button>
          </div>
        </div>
        {mobileOpen ? (
          <div className="border-t border-slate-800 bg-slate-950 px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink key={item.to} to={item.to} className="rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-slate-800" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
