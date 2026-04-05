import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { AuthShell } from '../components/AppShell'
import ThemeToggle from '../components/ThemeToggle'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLearningLanguage } from '../components/LanguageProvider'

const RegisterPage = () => {
  const { language } = useLearningLanguage()

  useDocumentMeta({
    title: 'Create Account | NextStep AI',
    description: 'Create your NextStep AI account and start a roadmap-first learning experience.',
    robots: 'noindex, follow',
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      })
      toast.success('Account created successfully!')
      navigate('/dashboard')
    } catch (error) {
      if (error.response?.data?.errors) {
        const apiErrors = error.response.data.errors
        const firstError = Object.values(apiErrors)[0][0]
        toast.error(firstError)
      } else {
        toast.error(error.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field) => (event) => {
    setFormData((currentState) => ({ ...currentState, [field]: event.target.value }))
  }

  return (
    <AuthShell
      title="Create your account"
      description="Set up a learner profile for skill-gap analysis, roadmap tracking, language-based preparation, and certificate generation."
      asideTitle="One account for the full learning flow."
      asideText={`Your current preparation language is ${language.label}. You can change it any time, and the platform will use it while fetching relevant learning videos.`}
      footer={
        <p className="text-center text-sm text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[var(--brand-blue)]">
            Sign in
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
          <label className="mb-2 block text-sm font-bold text-[var(--text-secondary)]">Full name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input type="text" value={formData.name} onChange={updateField('name')} className="input-field pl-12" placeholder="Sharjeel Ahmed" required />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[var(--text-secondary)]">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
            <input type="email" value={formData.email} onChange={updateField('email')} className="input-field pl-12" placeholder="you@example.com" required />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--text-secondary)]">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input type="password" value={formData.password} onChange={updateField('password')} className="input-field pl-12" placeholder="Create password" required />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-bold text-[var(--text-secondary)]">Confirm password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input type="password" value={formData.confirmPassword} onChange={updateField('confirmPassword')} className="input-field pl-12" placeholder="Repeat password" required />
            </div>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          <UserPlus size={18} />
          <span>{loading ? 'Creating account...' : 'Create Account'}</span>
        </button>

        <div className="rounded-[1.2rem] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--text-secondary)]">
          Create your profile once and keep your target roles, roadmap activity, learning milestones, and certificate history in one place.
        </div>
      </form>
    </AuthShell>
  )
}

export default RegisterPage
