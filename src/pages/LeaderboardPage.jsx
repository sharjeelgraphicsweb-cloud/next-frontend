import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { gamificationAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, PageIntro, SectionCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const LeaderboardPage = () => {
  useDocumentMeta({
    title: 'Leaderboard | NextStep AI',
    description: 'Compare XP, level, and rank with other learners on the platform.',
    robots: 'noindex, follow',
  })

  const { user } = useAuthStore()
  const [leaderboard, setLeaderboard] = useState([])
  const [timeframe, setTimeframe] = useState('all_time')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [timeframe])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const { data } = await gamificationAPI.getLeaderboard({ timeframe })
      setLeaderboard(data.leaderboard || [])
    } catch (error) {
      toast.error('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="text-[var(--brand-orange)]" size={22} />
    if (rank === 2) return <Medal className="text-[var(--brand-blue)]" size={22} />
    if (rank === 3) return <Medal className="text-[var(--brand-green)]" size={22} />
    return <span className="text-lg font-extrabold text-[var(--text-muted)]">#{rank}</span>
  }

  if (loading) {
    return <LoadingScreen label="Loading leaderboard..." />
  }

  return (
    <PageContainer narrow>
      <PageIntro
        eyebrow="Leaderboard"
        title="See where you rank"
        description="Track your position against other learners and compare performance over different timeframes."
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {['all_time', 'monthly', 'weekly'].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTimeframe(item)}
            className={`rounded-full px-4 py-2 text-sm font-bold transition ${
              timeframe === item
                ? 'bg-[var(--brand-charcoal)] text-white'
                : 'bg-[var(--surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-soft)]'
            }`}
          >
            {item.replace('_', ' ')}
          </button>
        ))}
      </div>

      {leaderboard.length === 0 ? (
        <EmptyState icon={TrendingUp} title="No leaderboard data" description="No ranking data is available for the selected timeframe." />
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => (
            <motion.div key={entry.user_id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}>
              <SectionCard className={entry.user_id === user?.id ? 'border-[var(--brand-blue)]' : ''}>
                <div className="flex items-center gap-4">
                  <div className="flex w-12 justify-center">{getRankIcon(entry.rank)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-lg font-bold">{entry.name}</h3>
                      {entry.user_id === user?.id ? (
                        <span className="rounded-full bg-[var(--brand-sky)] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--brand-charcoal)]">
                          You
                        </span>
                      ) : null}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)]">Level {entry.level}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-[var(--brand-orange)]">{entry.xp}</p>
                    <p className="text-xs font-semibold text-[var(--text-muted)]">XP</p>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

export default LeaderboardPage
