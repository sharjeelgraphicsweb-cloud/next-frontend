import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Target, Map, Award, Zap, Calendar, ArrowRight, FileText, Sparkles, Compass } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { gamificationAPI, roadmapAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, SectionCard, StatCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { useLearningLanguage } from '../components/LanguageProvider'

const DashboardPage = () => {
  const { language } = useLearningLanguage()

  useDocumentMeta({
    title: 'Dashboard | NextStep AI',
    description: 'Review your education progress, active roadmaps, XP, and quick actions in one dashboard.',
    robots: 'noindex, follow',
  })

  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, roadmapsResponse] = await Promise.all([
          gamificationAPI.getStats(),
          roadmapAPI.getAll(),
        ])
        setStats(statsResponse.data)
        setRoadmaps(roadmapsResponse.data)
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const primaryNextAction = useMemo(() => {
    if (roadmaps.length > 0) {
      return { label: 'Continue roadmap', link: `/roadmap/${roadmaps[0].id}` }
    }
    return { label: 'Start with skill analysis', link: '/analyze' }
  }, [roadmaps])

  if (loading) {
    return <LoadingScreen label="Loading your dashboard..." />
  }

  return (
    <PageContainer>
      <SectionCard className="mb-8 overflow-hidden bg-gradient-to-r from-[var(--brand-charcoal)] via-[var(--brand-sky)] to-[var(--surface)] text-white">
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-white/70">
              <Sparkles size={16} /> Learner dashboard
            </p>
            <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              {`Welcome back, ${user?.name || 'Learner'}`}
            </h1>
            <p className="mt-3 text-sm leading-7 text-white/80">
              Your prep language: {language.label}. Stay focused with a single next step and track steady progress.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to={primaryNextAction.link} className="btn-primary">
                {primaryNextAction.label}
              </Link>
              <Link to="/roadmaps" className="btn-secondary text-white border-white/40 hover:border-white">
                View all roadmaps
              </Link>
            </div>
          </div>
          <div className="flex w-full max-w-sm flex-col gap-3 rounded-3xl bg-white/10 p-4 backdrop-blur md:w-auto">
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>XP</span>
              <span className="text-lg font-bold">{stats?.xp || 0}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Active roadmaps</span>
              <span className="text-lg font-bold">{roadmaps.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-white/80">
              <span>Day streak</span>
              <span className="text-lg font-bold">{stats?.streak || 0}</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <StatCard icon={Zap} label="XP" value={stats?.xp || 0} tone="orange" detail="Total earned" />
        <StatCard icon={Map} label="Active roadmaps" value={roadmaps.length} tone="green" detail="Keep momentum" />
        <StatCard icon={Calendar} label="Day streak" value={stats?.streak || 0} tone="lilac" detail="Consistency" />
      </div>

      <div className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <SectionCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">Focus</p>
              <h2 className="mt-1 text-2xl font-bold">Pick a single next move</h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { icon: Target, label: 'Analyze skills', link: '/analyze' },
              { icon: Map, label: 'Open roadmap', link: '/roadmaps' },
              { icon: FileText, label: 'Resume builder', link: '/resume-builder' },
              { icon: Award, label: 'Certificates', link: '/certificates' },
            ].map((item, idx) => (
              <Link
                key={item.label}
                to={item.link}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">Rhythm</p>
              <h2 className="mt-1 text-xl font-bold">Progress pulse</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">Stay steady; consistency beats intensity.</p>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
              <span>Weekly streak</span>
              <span className="font-bold text-[var(--text-primary)]">{stats?.streak || 0} days</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--surface-strong)]">
              <div
                className="h-2 rounded-full bg-[var(--brand-blue)] transition-all"
                style={{ width: `${Math.min(100, (stats?.streak || 0) * 4)}%` }}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <Compass size={16} />
              <span>Tip: Block 25 minutes today for one roadmap node.</span>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">Recent roadmaps</p>
            <h2 className="mt-2 text-2xl font-bold">Continue where you left off</h2>
          </div>
          <Link to="/roadmaps" className="btn-secondary">
            View All
          </Link>
        </div>

        {roadmaps.length === 0 ? (
          <EmptyState
            icon={Map}
            title="No roadmaps yet"
            description="Start with skill analysis and generate your first roadmap."
            action={
              <Link to="/analyze" className="btn-primary">
                Create Your First Roadmap
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {roadmaps.slice(0, 3).map((roadmap, index) => (
              <motion.div key={roadmap.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <Link to={`/roadmap/${roadmap.id}`} className="block rounded-[1.6rem] border border-[var(--border-soft)] bg-[var(--surface)] p-5 transition hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold">{roadmap.target_role}</h3>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        Created {new Date(roadmap.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="rounded-full bg-[var(--brand-sky)] px-3 py-2 text-xs font-bold text-[var(--brand-charcoal)]">
                      {roadmap.nodes?.length || 0} Skills
                    </span>
                  </div>
                  <div className="mt-5 flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)]">
                    <span>Open roadmap</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Removed extra educational blocks to keep the dashboard lightweight and focused on next actions. */}
    </PageContainer>
  )
}

export default DashboardPage
