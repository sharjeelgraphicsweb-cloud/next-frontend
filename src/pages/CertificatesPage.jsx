import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Download, Eye, Sparkles, FileType, FileText, X } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { certificateAPI, progressAPI, roadmapAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, PageIntro } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const CertificatesPage = () => {
  useDocumentMeta({
    title: 'Certificates | NextStep AI',
    description: 'Manage, preview, verify, and download education certificates issued by NextStep AI.',
    robots: 'noindex, follow',
  })

  const { user } = useAuthStore()
  const [certificates, setCertificates] = useState([])
  const [roadmaps, setRoadmaps] = useState([])
  const [completedRoadmapIds, setCompletedRoadmapIds] = useState([])
  const [selectedCert, setSelectedCert] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [certificatesResponse, roadmapsResponse] = await Promise.all([certificateAPI.getAll(), roadmapAPI.getAll()])

      const certificatesRaw = certificatesResponse.data.data || certificatesResponse.data || []
      const roadmapsRaw = roadmapsResponse.data.data || roadmapsResponse.data || []

      setCertificates(Array.isArray(certificatesRaw) ? certificatesRaw : [])
      setRoadmaps(Array.isArray(roadmapsRaw) ? roadmapsRaw : [])
      const eligibleRoadmaps = await Promise.all((Array.isArray(roadmapsRaw) ? roadmapsRaw : []).map(async (roadmap) => {
        if (!Array.isArray(roadmap.nodes) || roadmap.nodes.length === 0) return null

        const roadmapId = String(roadmap.id || roadmap._id || '')
        if (!roadmapId) return null

        const { data } = await progressAPI.getRoadmapProgress(roadmapId)
        const completedNodeIds = new Set(
          (Array.isArray(data?.node_progress) ? data.node_progress : [])
            .filter((node) => node.status === 'completed')
            .map((node) => String(node.node_id)),
        )
        const isComplete = roadmap.nodes.every((node) => completedNodeIds.has(String(node.id)))
        return isComplete ? roadmapId : null
      }))
      setCompletedRoadmapIds(eligibleRoadmaps.filter(Boolean))
    } catch (error) {
      toast.error('Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (roadmapId) => {
    try {
      const { data } = await certificateAPI.generate(roadmapId)
      const newCertificate = data.data || data
      setCertificates((currentCertificates) => [...currentCertificates, newCertificate])
      toast.success('Certificate generated successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate certificate')
    }
  }

  const handleDownload = async (id, format = 'pdf') => {
    try {
      const response = await certificateAPI.download(id, format)

      const disposition = response.headers['content-disposition']
      const fallbackName = `Certificate.${format}`
      const filenameMatch = disposition?.match(/filename=\"?([^\";]+)\"?/)
      const filename = filenameMatch?.[1] || fallbackName

      const mimeType =
        format === 'pdf'
          ? 'application/pdf'
          : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

      const blob = new Blob([response.data], { type: mimeType })
      const url = window.URL.createObjectURL(blob)

      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Failed to download certificate')
    }
  }

  if (loading) {
    return <LoadingScreen label="Loading certificates..." />
  }

  const availableRoadmaps = roadmaps.filter((roadmap) =>
    completedRoadmapIds.includes(String(roadmap.id || roadmap._id)) &&
    !certificates.find((certificate) => String(certificate.roadmap_id) === String(roadmap.id || roadmap._id)),
  )

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Credentials"
        title="Verified Certificates"
        description="Generate, view, and download official certificates for your completed learning roadmaps."
      />

      <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-16">
        
        {/* Earned Certificates */}
        <div>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-green)] to-[var(--brand-blue)] flex items-center justify-center text-white shadow-md">
              <Award size={20} />
            </div>
            <h2 className="text-2xl font-bold">Earned Certificates</h2>
          </motion.div>

          {certificates.length === 0 ? (
            <motion.div variants={fadeUp}>
              <EmptyState icon={Award} title="No certificates yet" description="Complete all lessons in a roadmap to unlock your first verifiable certificate." />
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {certificates.map((certificate) => (
                <motion.div key={certificate.id} variants={fadeUp}>
                  <div className="group h-full rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[var(--brand-green)]/10 hover:border-[var(--brand-green)]/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-green)] rounded-full mix-blend-screen filter blur-[60px] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                    
                    <div className="flex items-start justify-between gap-3 relative z-10">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand-green)] to-[#22c55e] text-white shadow-lg">
                        <Award size={26} />
                      </div>
                      <span className="rounded-full border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-[var(--brand-green)]">
                        Verified
                      </span>
                    </div>

                    <h3 className="mt-6 text-xl font-extrabold leading-tight text-[var(--text-primary)] group-hover:text-[var(--brand-green)] transition-colors">
                      {certificate.roadmap?.target_role}
                    </h3>
                    <p className="mt-2 text-sm font-semibold text-[var(--text-secondary)]">
                      Issued {new Date(certificate.issued_at).toLocaleDateString()}
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2 relative z-10">
                      <button type="button" onClick={() => setSelectedCert(certificate)} className="btn-secondary !bg-[var(--surface)] hover:!border-[var(--brand-green)]/50 transition-colors">
                        <Eye size={16} />
                        <span>Preview</span>
                      </button>
                      <button type="button" onClick={() => handleDownload(certificate.id, 'pdf')} className="btn-primary shadow-lg shadow-[var(--brand-orange)]/20">
                        <Download size={16} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Available for Certification */}
        <div>
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-lilac)] flex items-center justify-center text-white shadow-md">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-bold">Ready to Generate</h2>
          </motion.div>

          {availableRoadmaps.length === 0 ? (
            <motion.div variants={fadeUp}>
              <EmptyState icon={Sparkles} title="No roadmaps ready" description="Complete an active roadmap to 100% to generate its certificate." />
            </motion.div>
          ) : (
            <motion.div variants={staggerContainer} className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {availableRoadmaps.map((roadmap) => (
                <motion.div key={roadmap.id} variants={fadeUp}>
                  <div className="group h-full rounded-[2rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--brand-blue)]/30">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-blue)]/10 text-[var(--brand-blue)] group-hover:scale-110 transition-transform">
                      <Sparkles size={22} />
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold">{roadmap.target_role}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Your progress is complete. Generate your official verifiable certificate now.</p>
                    <button type="button" onClick={() => handleGenerate(roadmap.id)} className="btn-primary mt-6 w-full shadow-lg shadow-[var(--brand-orange)]/20 hover:scale-[1.02] transition-transform">
                      Generate Certificate
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

      </motion.div>

      <AnimatePresence>
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md" onClick={() => setSelectedCert(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(event) => event.stopPropagation()} 
              className="glass-card max-h-[92vh] w-full max-w-4xl overflow-y-auto p-2"
            >
              <div className="mb-6 flex items-start justify-between gap-4 p-4">
                <div>
                  <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">Certificate Preview</h2>
                  <p className="mt-1 text-sm font-semibold text-[var(--text-secondary)]">Verify and export this official credential.</p>
                </div>
                <button type="button" onClick={() => setSelectedCert(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-secondary)] hover:bg-red-500/10 hover:text-red-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="rounded-[2.5rem] bg-gradient-to-br from-[var(--brand-charcoal)] via-[#1a1d21] to-[#2a3038] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[var(--brand-blue)] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
                
                <div className="rounded-[2rem] border border-white/20 p-8 md:p-12 text-center relative z-10 backdrop-blur-sm bg-black/20">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
                    <img src="/nextsteplogo.png" alt="NextStep AI logo" className="h-full w-full object-contain" />
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[var(--brand-cream)] tracking-tight">Certificate of Completion</h3>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">This certifies that</p>
                  <h4 className="mt-4 text-4xl md:text-5xl font-extrabold text-[var(--brand-sky)]">{user?.name}</h4>
                  
                  <div className="my-8 mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[var(--brand-sky)] to-transparent opacity-50"></div>
                  
                  <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80">
                    Has successfully completed the comprehensive professional learning roadmap for:
                  </p>
                  <p className="mt-4 text-2xl font-bold text-white">{selectedCert.roadmap?.target_role}</p>

                  <div className="mt-12 grid gap-6 border-t border-white/10 pt-8 sm:grid-cols-3 sm:items-center">
                    <div className="text-center sm:text-left">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Date Issued</p>
                      <p className="mt-2 text-sm font-bold text-white">
                        {new Date(selectedCert.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-green)] to-[#22c55e] text-white shadow-lg border border-white/20">
                        <Award size={30} />
                      </div>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Credential ID</p>
                      <p className="mt-2 text-xs font-mono font-bold text-[var(--brand-sky)]">{selectedCert.certificate_code}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr] md:items-center p-2">
                <div className="rounded-[2rem] bg-[var(--surface-strong)] p-5 text-center border border-[var(--border-soft)]">
                  <p className="mb-4 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Scan to Verify</p>
                  <div className="inline-flex rounded-2xl bg-white p-3 shadow-md">
                    <QRCodeSVG value={`${window.location.origin}/certificates/verify/${selectedCert.id}`} size={100} includeMargin={false} />
                  </div>
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <button type="button" onClick={() => handleDownload(selectedCert.id, 'pdf')} className="btn-primary py-4 text-lg shadow-lg shadow-[var(--brand-orange)]/20 hover:scale-105 transition-transform">
                    <FileType size={20} />
                    <span>Download PDF</span>
                  </button>
                  <button type="button" onClick={() => handleDownload(selectedCert.id, 'docx')} className="btn-secondary py-4 text-lg bg-[var(--surface)] hover:bg-[var(--surface-strong)] transition-colors">
                    <FileText size={20} />
                    <span>Download DOCX</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  )
}

export default CertificatesPage
