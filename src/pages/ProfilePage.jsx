import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Award, Zap, Calendar, Trophy, Star, Upload, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { gamificationAPI, profileAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, PageIntro, SectionCard, StatCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const ProfilePage = () => {
  useDocumentMeta({
    title: 'Profile | NextStep AI',
    description: 'Manage your learner profile, avatar, gamification stats, and earned badges.',
    robots: 'noindex, follow',
  })

  const { user, setUser } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const [statsResponse, badgesResponse] = await Promise.all([gamificationAPI.getStats(), gamificationAPI.getBadges()])
      setStats(statsResponse.data)
      setBadges(badgesResponse.data.badges || [])
    } catch (error) {
      toast.error('Failed to load profile stats')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    try {
      const { data } = await profileAPI.update(formData)
      setUser(data.user)
      setIsEditing(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const uploadData = new FormData()
    uploadData.append('image', file)

    setUploading(true)
    try {
      const { data } = await profileAPI.uploadAvatar(uploadData)
      setUser(data.user)
      toast.success('Profile image updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) return
    try {
      const { data } = await profileAPI.deleteAvatar()
      setUser(data.user)
      toast.success('Profile image removed')
    } catch (error) {
      toast.error('Failed to remove image')
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading your profile..." />
  }

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Learner profile"
        title={user?.name || 'Your profile'}
        description="Manage your personal details, learning stats, and earned badges from one place."
      />

      <SectionCard className="mb-8">
        <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
          <div className="relative mx-auto lg:mx-0">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--brand-sky)] bg-[var(--surface)] text-5xl font-bold text-[var(--brand-blue)]">
              {user?.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user?.name?.charAt(0).toUpperCase()}
            </div>
            {uploading ? <div className="absolute inset-0 rounded-full bg-black/25" /> : null}
          </div>

          <div>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="input-field" placeholder="Full name" required />
                  <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="input-field" placeholder="Email address" required />
                </div>
                <div className="flex flex-wrap gap-3">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-3xl font-extrabold">{user?.name}</h2>
                    <p className="mt-2 text-base text-[var(--text-secondary)]">{user?.email}</p>
                  </div>
                  <button type="button" onClick={() => setIsEditing(true)} className="btn-secondary">Edit Profile</button>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <label className="btn-secondary cursor-pointer">
                    <Upload size={16} />
                    <span>Upload Avatar</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                  {user?.avatar ? (
                    <button type="button" onClick={handleDeleteImage} className="btn-secondary">
                      <Trash2 size={16} />
                      <span>Remove Avatar</span>
                    </button>
                  ) : null}
                </div>
              </>
            )}
          </div>
        </div>
      </SectionCard>

      <div className="mb-8 grid gap-5 md:grid-cols-3">
        <StatCard icon={Zap} label="Total XP" value={stats?.xp || 0} tone="orange" />
        <StatCard icon={Trophy} label="Current Level" value={stats?.level || 1} tone="blue" />
        <StatCard icon={Calendar} label="Day Streak" value={stats?.streak || 0} tone="green" />
      </div>

      <div>
        <h2 className="mb-5 text-2xl font-bold">Earned badges</h2>
        {badges.length === 0 ? (
          <EmptyState icon={Award} title="No badges yet" description="Keep progressing through learning milestones to unlock badges." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
            {badges.map((badge, index) => (
              <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.04 }}>
                <SectionCard className="h-full text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-orange)]/14 text-[var(--brand-orange)]">
                    <Star size={28} />
                  </div>
                  <h3 className="mt-4 text-sm font-bold">{badge.name}</h3>
                  <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)]">{badge.description}</p>
                </SectionCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default ProfilePage
