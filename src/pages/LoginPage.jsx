import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { authAPI } from '../services/api'
import { AuthShell } from '../components/AppShell'
import ThemeToggle from '../components/ThemeToggle'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLearningLanguage } from '../components/LanguageProvider'

const LoginPage = () => {
  const { language } = useLearningLanguage()

  useDocumentMeta({
    title: 'Sign In | NextStep AI',
    description: 'Sign in to continue your roadmap-driven education journey on NextStep AI.',
    robots: 'noindex, follow',
  })

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      await login({ email, password })
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    authAPI.googleLogin()
  }

  return (
    <AuthShell
      title="Welcome back"
      description="Sign in to continue your learning journey, skill analysis history, roadmap progress, and certificates."
      asideTitle="Keep your learning path in one workspace."
      asideText={`Your selected preparation language is currently ${language.label}. The app uses that preference to keep roadmap study and video suggestions aligned with how you want to learn.`}
      footer={
        <p className="text-center text-sm text-[var(--text-secondary)]">
          Do not have an account?{' '}
          <Link to="/register" className="font-bold text-[var(--brand-blue)]">
            Create one
          </Link>
        </p>
      }
    >
      <div className="mb-5 flex flex-wrap justify-end gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-bold text-[var(--text-secondary)]">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-field pl-12"
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[var(--text-secondary)]">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-field pl-12"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <LogIn size={18} />
          <span>{loading ? 'Signing in...' : 'Sign In'}</span>
        </button>

        <div className="rounded-[1.2rem] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
          Continue from where you left off: missing skills, active roadmap, watched lessons, quizzes, and generated certificates stay connected to your account.
        </div>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border-soft)]" />
        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--text-muted)]">or</span>
        <div className="h-px flex-1 bg-[var(--border-soft)]" />
      </div>

      <button type="button" onClick={handleGoogleLogin} className="btn-secondary w-full">
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        <span>Continue with Google</span>
      </button>
    </AuthShell>
  )
}

export default LoginPage
