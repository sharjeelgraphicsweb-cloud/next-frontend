import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, Trash2, Eye, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { roadmapAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, PageIntro, SectionCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const RoadmapsPage = () => {
  useDocumentMeta({
    title: 'Roadmaps | NextStep AI',
    description: 'Browse, manage, and continue your active learning roadmaps.',
    robots: 'noindex, follow',
  })

  const [roadmaps, setRoadmaps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRoadmaps()
  }, [])

  const fetchRoadmaps = async () => {
    try {
      const { data } = await roadmapAPI.getAll()
      setRoadmaps(data)
    } catch (error) {
      toast.error('Failed to load roadmaps')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this roadmap?')) return

    try {
      await roadmapAPI.delete(id)
      setRoadmaps((currentRoadmaps) => currentRoadmaps.filter((roadmap) => roadmap.id !== id))
      toast.success('Roadmap deleted')
    } catch (error) {
      toast.error('Failed to delete roadmap')
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading your roadmaps..." />
  }

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Learning roadmaps"
        title="Manage your active paths"
        description="Open, review, and clean up the personalized roadmaps you have generated."
        actions={
          <Link to="/analyze" className="btn-primary">
            <Plus size={18} />
            <span>Create New</span>
          </Link>
        }
      />

      {roadmaps.length === 0 ? (
        <EmptyState
          icon={Map}
          title="No roadmaps yet"
          description="Create your first personalized roadmap from a resume and target role."
          action={
            <Link to="/analyze" className="btn-primary">
              Get Started
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {roadmaps.map((roadmap, index) => (
            <motion.div key={roadmap.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
              <SectionCard className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-2xl bg-[var(--brand-sky)] p-3 text-[var(--brand-charcoal)]">
                    <Map size={22} />
                  </div>
                  <button type="button" onClick={() => handleDelete(roadmap.id)} className="rounded-full p-2 text-[var(--text-muted)] transition hover:bg-[var(--surface)] hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="mt-5 text-xl font-bold">{roadmap.target_role}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Created {new Date(roadmap.created_at).toLocaleDateString()}
                </p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[var(--surface)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                    {roadmap.nodes?.length || 0} Skills
                  </span>
                  <Link to={`/roadmap/${roadmap.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)]">
                    <Eye size={16} />
                    <span>View roadmap</span>
                  </Link>
                </div>
              </SectionCard>
            </motion.div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}

export default RoadmapsPage
