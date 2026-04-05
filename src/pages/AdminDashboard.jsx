import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Award, Map, Activity, Trash2, UserCog, Search, LayoutDashboard, ShieldCheck, Settings, Database, RefreshCw, TrendingUp, ClipboardCheck } from 'lucide-react'
import toast from 'react-hot-toast'
import { adminAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, PageIntro, SectionCard, StatCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const AdminDashboard = () => {
  useDocumentMeta({
    title: 'Admin Dashboard | NextStep AI',
    description: 'Administrative controls for platform users, system stats, and content oversight.',
    robots: 'noindex, follow',
  })

  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filtering, setFiltering] = useState(false)
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    fetchAdminData()
    fetchUsers()
    fetchReviews()
  }, [])

  const fetchAdminData = async () => {
    try {
      const statsResponse = await adminAPI.getStats()
      setStats(statsResponse.data)
    } catch (error) {
      toast.error('Failed to load stats')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setFiltering(true)
    try {
      const usersResponse = await adminAPI.getUsers({ search: searchTerm })
      setUsers(usersResponse.data.users || usersResponse.data.data || [])
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setFiltering(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await adminAPI.getPracticeReviews()
      setReviews(response.data.reviews || [])
    } catch (error) {
      toast.error('Failed to load review queue')
    }
  }

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return

    try {
      await adminAPI.deleteUser(id)
      toast.success('User deleted successfully')
      fetchUsers()
      fetchAdminData()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    }
  }

  const handleUpdateRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'

    try {
      await adminAPI.updateRole(id, newRole)
      toast.success('User role updated')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update role')
    }
  }

  const handleReview = async (progressId, taskId, status) => {
    try {
      await adminAPI.reviewPracticeTask(progressId, {
        task_id: taskId,
        status,
        mentor_feedback: status === 'approved' ? 'Good practical proof. Keep building on this.' : 'Needs revision. Improve clarity, polish, and practical explanation.',
      })
      toast.success('Practice task reviewed')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to review task')
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading admin dashboard..." />
  }

  const navigation = [
    { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
    { id: 'users', icon: Users, label: 'User Management' },
    { id: 'content', icon: Database, label: 'System Content' },
    { id: 'reviews', icon: ClipboardCheck, label: 'Practice Reviews' },
    { id: 'settings', icon: Settings, label: 'Global Settings' },
  ]

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Admin dashboard"
        title="Platform management"
        description="Review system health, inspect platform usage, and manage user access from a cleaner responsive panel."
      />

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <SectionCard className="h-fit">
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-charcoal)] text-white">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-lg font-bold">Admin Panel</p>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">Management suite</p>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            {navigation.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${
                  activeTab === item.id
                    ? 'bg-[var(--brand-charcoal)] text-white'
                    : 'bg-[var(--surface)] text-[var(--text-secondary)]'
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[1.4rem] bg-[var(--surface)] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">System status</p>
            <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]">
              <span className="h-2 w-2 rounded-full bg-[var(--brand-green)]" />
              All systems operational
            </div>
          </div>
        </SectionCard>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            <motion.div key="overview" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard icon={Users} label="Total Users" value={stats?.total_users || 0} tone="blue" />
                <StatCard icon={Map} label="Total Roadmaps" value={stats?.total_roadmaps || 0} tone="lilac" />
                <StatCard icon={Award} label="Certificates Issued" value={stats?.total_certificates || 0} tone="orange" />
                <StatCard icon={Activity} label="Active Today" value={stats?.active_today || 0} tone="green" />
              </div>

              <SectionCard className="mt-6 min-h-[280px]">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <RefreshCw size={42} className="animate-spin text-[var(--brand-blue)]/45" />
                  <h2 className="mt-5 text-2xl font-bold">Activity feed coming soon</h2>
                  <p className="mt-3 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                    This space is reserved for live system events, moderation activity, and platform health monitoring.
                  </p>
                </div>
              </SectionCard>
            </motion.div>
          ) : null}

          {activeTab === 'users' ? (
            <motion.div key="users" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <SectionCard>
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">User management</h2>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">Search, update roles, and manage learner accounts.</p>
                  </div>
                  <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') fetchUsers()
                      }}
                      className="input-field pl-11"
                      placeholder="Search name or email"
                    />
                  </div>
                </div>

                {filtering ? (
                  <LoadingScreen label="Filtering users..." />
                ) : users.length === 0 ? (
                  <EmptyState icon={Users} title="No users found" description="No accounts match the current search criteria." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[680px] text-left">
                      <thead>
                        <tr className="border-b border-[var(--border-soft)] text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                          <th className="py-4 pr-4">User</th>
                          <th className="py-4 pr-4 text-center">Role</th>
                          <th className="py-4 pr-4 text-center">Stats</th>
                          <th className="py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((entry) => (
                          <tr key={entry.id} className="border-b border-[var(--border-soft)]/70">
                            <td className="py-4 pr-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-sky)] font-bold text-[var(--brand-charcoal)]">
                                  {entry.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold">{entry.name}</p>
                                  <p className="text-sm text-[var(--text-secondary)]">{entry.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 pr-4 text-center">
                              <span className="rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-bold">
                                {entry.role || 'user'}
                              </span>
                            </td>
                            <td className="py-4 pr-4 text-center">
                              <p className="font-bold text-[var(--brand-orange)]">{entry.xp || 0} XP</p>
                              <p className="text-xs text-[var(--text-muted)]">Level {entry.level || 1}</p>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => handleUpdateRole(entry.id, entry.role)} className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-[var(--brand-blue)]">
                                  <UserCog size={16} />
                                </button>
                                <button type="button" onClick={() => handleDeleteUser(entry.id)} disabled={entry.role === 'admin'} className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-red-500 disabled:opacity-40">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </SectionCard>
            </motion.div>
          ) : null}

          {activeTab === 'reviews' ? (
            <motion.div key="reviews" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <SectionCard>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold">Practice review queue</h2>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">Approve or send back submitted mini projects and portfolio work.</p>
                </div>

                {reviews.length === 0 ? (
                  <EmptyState icon={ClipboardCheck} title="No reviews pending" description="Submitted assignment reviews will appear here." />
                ) : (
                  <div className="grid gap-4">
                    {reviews.map((item) => (
                      <div key={`${item.progress_id}-${item.task_id}`} className="rounded-[1.4rem] bg-[var(--surface)] p-4">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                          <div>
                            <p className="text-sm font-bold">{item.title}</p>
                            <p className="mt-1 text-sm text-[var(--brand-blue)]">{item.user_name} - {item.target_role}</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.submission_notes || 'No notes submitted.'}</p>
                            {item.portfolio_url ? <p className="mt-2 text-xs break-all text-[var(--text-secondary)]">Portfolio: {item.portfolio_url}</p> : null}
                            {item.submission_file_url ? <p className="mt-1 text-xs break-all text-[var(--text-secondary)]">File: {item.submission_file_url}</p> : null}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => handleReview(item.progress_id, item.task_id, 'approved')} className="btn-primary">
                              Approve
                            </button>
                            <button type="button" onClick={() => handleReview(item.progress_id, item.task_id, 'needs_revision')} className="btn-secondary">
                              Needs Revision
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </SectionCard>
            </motion.div>
          ) : null}

          {activeTab === 'content' || activeTab === 'settings' ? (
            <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState
                icon={TrendingUp}
                title="Expansion module"
                description={`The ${activeTab} module is reserved for the next admin release and will be styled inside the same management shell.`}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </PageContainer>
  )
}

export default AdminDashboard
