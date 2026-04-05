import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Download, Eye, Sparkles, FileType, FileText } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import { certificateAPI, roadmapAPI } from '../services/api'
import { EmptyState, LoadingScreen, PageContainer, PageIntro, SectionCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'

const CertificatesPage = () => {
  useDocumentMeta({
    title: 'Certificates | NextStep AI',
    description: 'Manage, preview, verify, and download education certificates issued by NextStep AI.',
    robots: 'noindex, follow',
  })

  const { user } = useAuthStore()
  const [certificates, setCertificates] = useState([])
  const [roadmaps, setRoadmaps] = useState([])
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

  const availableRoadmaps = roadmaps.filter((roadmap) => !certificates.find((certificate) => String(certificate.roadmap_id) === String(roadmap.id)))

  return (
    <PageContainer>
      <PageIntro
        eyebrow="Certificates"
        title="Manage verified achievements"
        description="Preview, verify, and export certificates generated from completed roadmaps."
      />

      <div className="mb-10">
        <h2 className="mb-5 text-2xl font-bold">Earned certificates</h2>
        {certificates.length === 0 ? (
          <EmptyState icon={Award} title="No certificates yet" description="Complete a roadmap to unlock your first certificate." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {certificates.map((certificate, index) => (
              <motion.div key={certificate.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
                <SectionCard className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--brand-orange)] text-white">
                      <Award size={30} />
                    </div>
                    <span className="rounded-full bg-[var(--brand-green)]/15 px-3 py-2 text-xs font-bold text-[var(--text-primary)]">Verified</span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold">{certificate.roadmap?.target_role}</h3>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Issued {new Date(certificate.issued_at).toLocaleDateString()}
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button type="button" onClick={() => setSelectedCert(certificate)} className="btn-secondary">
                      <Eye size={16} />
                      <span>Preview</span>
                    </button>
                    <button type="button" onClick={() => handleDownload(certificate.id, 'pdf')} className="btn-primary">
                      <Download size={16} />
                      <span>PDF</span>
                    </button>
                  </div>
                </SectionCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-5 text-2xl font-bold">Available for certification</h2>
        {availableRoadmaps.length === 0 ? (
          <EmptyState icon={Sparkles} title="No roadmap ready right now" description="When you finish a roadmap, it will appear here for certificate generation." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {availableRoadmaps.map((roadmap, index) => (
              <motion.div key={roadmap.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <SectionCard className="h-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-sky)] text-[var(--brand-charcoal)]">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="mt-5 text-xl font-bold">{roadmap.target_role}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">Generate an official certificate for this completed learning path.</p>
                  <button type="button" onClick={() => handleGenerate(roadmap.id)} className="btn-primary mt-5 w-full">
                    Generate Certificate
                  </button>
                </SectionCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedCert ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={() => setSelectedCert(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} onClick={(event) => event.stopPropagation()} className="glass-card max-h-[92vh] w-full max-w-3xl overflow-y-auto">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Certificate preview</h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">Preview, verify, and export this certificate.</p>
              </div>
              <button type="button" onClick={() => setSelectedCert(null)} className="btn-secondary">Close</button>
            </div>

            <div className="rounded-[2rem] border border-[var(--border-soft)] bg-[var(--brand-charcoal)] p-6 text-white sm:p-8">
              <div className="rounded-[1.5rem] border border-white/15 p-6 text-center sm:p-8">
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[var(--brand-sky)]">NextStep AI</p>
                <h3 className="mt-4 text-4xl font-extrabold text-[var(--brand-cream)]">Certificate of Completion</h3>
                <p className="mt-3 text-sm text-white/70">Presented to</p>
                <h4 className="mt-5 text-4xl font-extrabold">{user?.name}</h4>
                <p className="mt-4 text-lg text-[var(--brand-sky)]">{selectedCert.roadmap?.target_role}</p>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/75">
                  In recognition of successful completion of the professional learning roadmap and assessment requirements.
                </p>
                <div className="mt-8 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3 sm:items-center">
                  <div className="text-left">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/55">Issued date</p>
                    <p className="mt-2 text-sm font-bold">
                      {new Date(selectedCert.issued_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand-orange)] text-white">
                      <Award size={34} />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-[0.22em] text-white/55">Verification ID</p>
                    <p className="mt-2 text-xs font-bold text-[var(--brand-sky)]">{selectedCert.certificate_code}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
              <div className="rounded-[1.5rem] bg-[var(--surface)] p-4 text-center">
                <p className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">Scan to verify online</p>
                <div className="inline-flex rounded-2xl bg-white p-3">
                  <QRCodeSVG value={`${window.location.origin}/certificates/verify/${selectedCert.id}`} size={120} includeMargin />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => handleDownload(selectedCert.id, 'pdf')} className="btn-primary">
                  <FileType size={18} />
                  <span>Download PDF</span>
                </button>
                <button type="button" onClick={() => handleDownload(selectedCert.id, 'docx')} className="btn-secondary">
                  <FileText size={18} />
                  <span>Download DOCX</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </PageContainer>
  )
}

export default CertificatesPage
