import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock, Award, AlertTriangle, RotateCcw, ClipboardCheck, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { roadmapAPI, progressAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, PageIntro, SectionCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const ProgressPage = () => {
  useDocumentMeta({
    title: 'Progress | NextStep AI',
    description: 'Track roadmap completion, current activity, and learning progress across the platform.',
    robots: 'noindex, follow',
  })

  const [roadmaps, setRoadmaps] = useState([])
  const [weeklyInsights, setWeeklyInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProgress()
  }, [])

  const fetchProgress = async () => {
    try {
      const { data } = await roadmapAPI.getAll()
      const weeklyInsightsResponse = await progressAPI.getWeeklyInsights()
      const roadmapsWithProgress = await Promise.all(
        data.map(async (roadmap) => {
          try {
            const progressResponse = await progressAPI.getRoadmapProgress(roadmap.id)
            const progressData = progressResponse.data?.node_progress || progressResponse.data || []
            return { ...roadmap, progress: Array.isArray(progressData) ? progressData : [] }
          } catch (error) {
            return { ...roadmap, progress: [] }
          }
        }),
      )
      setRoadmaps(roadmapsWithProgress)
      setWeeklyInsights(weeklyInsightsResponse.data)
    } catch (error) {
      toast.error('Failed to load progress')
    } finally {
      setLoading(false)
    }
  }

  const calculateProgress = (roadmap) => {
    if (!roadmap.nodes || roadmap.nodes.length === 0) return 0
    const completed = roadmap.progress?.filter((item) => item.status === 'completed').length || 0
    return Math.round((completed / roadmap.nodes.length) * 100)
  }

  if (loading) {
    return <LoadingScreen label="Loading progress data..." />
  }

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Learning progress"
        title="Track progress across every roadmap"
        description="Review how much you have completed, which weak points need repetition, and where momentum is building this week."
      />

      {roadmaps.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No progress yet" description="Start a roadmap to begin tracking your learning performance." />
      ) : (
        <div className="space-y-5">
          {weeklyInsights ? (
            <SectionCard>
              <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--text-muted)]">Weekly judgment</p>
                  <h2 className="mt-2 text-3xl font-bold">{weeklyInsights.summary?.headline}</h2>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{weeklyInsights.summary?.message}</p>
                  <div className="mt-4 rounded-[1.2rem] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--text-secondary)]">
                    Professional growth rule: repeat weak topics, finish one real task, and only then move to the next big concept.
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-4">
                    {[
                      ['Completed this week', weeklyInsights.stats?.completed_this_week ?? 0],
                      ['Active roadmaps', weeklyInsights.stats?.active_roadmaps ?? 0],
                      ['Weak points', weeklyInsights.stats?.weak_points_count ?? 0],
                      ['Assignments', weeklyInsights.stats?.assignments_count ?? 0],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-[1.3rem] bg-[var(--surface)] p-4">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--text-muted)]">{label}</p>
                        <p className="mt-2 text-2xl font-extrabold">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-[1.2rem] bg-[var(--brand-green)]/15 p-4 text-sm leading-6 text-[var(--text-primary)]">
                    Estimated job-readiness score: {Math.min(100, ((weeklyInsights.stats?.completed_this_week || 0) * 10) + ((weeklyInsights.stats?.assignments_count || 0) * 10) + 20)}/100
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--brand-orange)]/12 p-3 text-[var(--brand-orange)]">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Weak points to repeat</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Repeat these topics before they block next week progress.</p>
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {(weeklyInsights.weak_points || []).map((item) => (
                      <div key={`${item.roadmap_id}-${item.skill_name}`} className="rounded-[1.4rem] bg-[var(--surface)] p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-sm font-bold text-[var(--brand-orange)]">{item.skill_name}</p>
                            <p className="mt-1 text-sm font-semibold">{item.target_role}</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.reason}</p>
                          </div>
                          <span className="rounded-full bg-[var(--brand-sky)] px-3 py-2 text-xs font-bold text-[var(--brand-charcoal)]">
                            {item.level}
                          </span>
                        </div>

                        <div className="mt-3 flex items-start gap-2 rounded-[1rem] bg-[var(--surface-elevated)] px-3 py-3">
                          <RotateCcw size={16} className="mt-0.5 text-[var(--brand-blue)]" />
                          <p className="text-sm leading-6 text-[var(--text-secondary)]">{item.recommendation}</p>
                        </div>
                        <div className="mt-3 rounded-[1rem] bg-[var(--brand-sky)]/25 px-3 py-3 text-sm leading-6 text-[var(--brand-charcoal)]">
                          Job-ready move: revise this topic, build one mini practice task, and explain it in your own words before marking it strong.
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
          ) : null}

          {weeklyInsights?.weekly_assignments?.length ? (
            <SectionCard>
              <div className="mb-4 flex items-center gap-3">
                <ClipboardCheck className="text-[var(--brand-green)]" size={20} />
                <div>
                  <h2 className="text-2xl font-bold">Weekly mini project assignments</h2>
                  <p className="text-sm text-[var(--text-secondary)]">These tasks convert learning into practical proof of skill.</p>
                </div>
              </div>

                  <div className="grid gap-3 md:grid-cols-2">
                {weeklyInsights.weekly_assignments.map((item) => (
                  <div key={item.task_id} className="rounded-[1.4rem] bg-[var(--surface)] p-4">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="mt-1 text-sm font-semibold text-[var(--brand-blue)]">{item.target_role}</p>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.deliverable}</p>
                    <div className="mt-3 rounded-[1rem] bg-[var(--surface-elevated)] px-3 py-3 text-sm leading-6 text-[var(--text-secondary)]">
                      {item.revision_step}
                    </div>
                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[var(--surface-elevated)] px-3 py-2 text-xs font-bold text-[var(--text-primary)]">
                      <ExternalLink size={14} />
                      {item.mentor_review_status || 'not_submitted'}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ) : null}

          {roadmaps.map((roadmap, index) => {
            const progressPercent = calculateProgress(roadmap)
            const completed = roadmap.progress?.filter((item) => item.status === 'completed').length || 0
            const inProgress = roadmap.progress?.filter((item) => item.status === 'in_progress').length || 0
            const total = roadmap.nodes?.length || 0

            return (
              <motion.div key={roadmap.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <SectionCard>
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{roadmap.target_role}</h2>
                      <p className="mt-2 text-sm text-[var(--text-secondary)]">
                        Created {new Date(roadmap.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-left lg:text-right">
                      <p className="text-4xl font-extrabold text-[var(--brand-blue)]">{progressPercent}%</p>
                      <p className="text-sm font-semibold text-[var(--text-muted)]">Completed</p>
                    </div>
                  </div>

                  <div className="mt-6 h-3 overflow-hidden rounded-full bg-[var(--surface)]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-lilac)]"
                    />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {[
                      { icon: CheckCircle, label: 'Completed', value: completed, tone: 'text-[var(--brand-green)]' },
                      { icon: Clock, label: 'In Progress', value: inProgress, tone: 'text-[var(--brand-orange)]' },
                      { icon: Award, label: 'Total Nodes', value: total, tone: 'text-[var(--brand-lilac)]' },
                    ].map((item) => (
                      <div key={item.label} className="rounded-[1.4rem] bg-[var(--surface)] p-4">
                        <div className="flex items-center gap-3">
                          <item.icon size={18} className={item.tone} />
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-muted)]">{item.label}</p>
                            <p className="text-xl font-bold">{item.value}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}

export default ProgressPage
