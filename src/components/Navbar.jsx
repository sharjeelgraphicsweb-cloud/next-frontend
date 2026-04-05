import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, User, Trophy, Map, BarChart3, Award, Home, Menu, X, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import useAuthStore from '../store/authStore'
import ThemeToggle from './ThemeToggle'
import LanguageSwitcher from './LanguageSwitcher'

const Navbar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navLinks = useMemo(
    () => [
      { to: '/dashboard', label: 'Dashboard', icon: Home },
      { to: '/roadmaps', label: 'Roadmaps', icon: Map },
      { to: '/progress', label: 'Progress', icon: BarChart3 },
      { to: '/resume-builder', label: 'Resume', icon: FileText },
      { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
      { to: '/certificates', label: 'Certificates', icon: Award },
    ],
    [],
  )

  const today = useMemo(
    () =>
      new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date()),
    [],
  )

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const isActiveLink = (path) => location.pathname === path

  return (
    <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} className="glass sticky top-0 z-50 border-b">
      <div className="page-shell px-4 py-3 sm:px-5 lg:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-charcoal)] text-white shadow-lg">
              <span className="font-bold tracking-tight">NS</span>
            </div>
            <div>
              <p className="font-[var(--font-heading)] text-lg font-bold">NextStep AI</p>
              <p className="text-xs text-[var(--text-muted)]">Education workspace</p>
            </div>
          </Link>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3 py-2 text-sm font-semibold text-[var(--text-secondary)]">
              {today}
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-2 py-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
                    isActiveLink(to)
                      ? 'bg-[var(--brand-sky)] text-[var(--brand-charcoal)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 rounded-full border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-3 py-2">
              <LanguageSwitcher compact />
              <ThemeToggle compact />
              <div className="rounded-full bg-[var(--brand-green)]/15 px-3 py-2 text-sm font-bold text-[var(--text-primary)]">
                {user?.xp || 0} XP
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-strong)] hover:text-[var(--text-primary)]"
              >
                <User size={20} />
                <span>{user?.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full p-2 text-[var(--text-secondary)] transition hover:bg-[var(--surface-strong)] hover:text-red-500"
                aria-label="Log out"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher compact />
            <ThemeToggle compact />
            <button
              type="button"
              onClick={() => setIsMenuOpen((currentState) => !currentState)}
              className="theme-toggle theme-toggle-compact"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-3 rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-soft)] lg:hidden">
            <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl bg-[var(--surface-strong)] px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.name}</p>
                <p className="text-xs text-[var(--text-muted)]">{today}</p>
              </div>
              <div className="rounded-full bg-[var(--brand-orange)]/15 px-3 py-2 text-sm font-bold text-[var(--brand-orange)]">
                {user?.xp || 0} XP
              </div>
            </div>

            <div className="grid gap-2">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    isActiveLink(to)
                      ? 'bg-[var(--brand-sky)] text-[var(--brand-charcoal)]'
                      : 'bg-[var(--surface)] text-[var(--text-secondary)]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={16} />
                    {label}
                  </span>
                </Link>
              ))}

              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]"
              >
                Support
              </Link>

              <Link
                to="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text-secondary)]"
              >
                <User size={16} />
                Profile
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-2xl bg-[var(--surface)] px-4 py-3 text-left text-sm font-semibold text-red-500"
              >
                <LogOut size={16} />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
