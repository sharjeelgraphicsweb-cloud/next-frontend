import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Upload, FileText, Briefcase, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { skillGapAPI, roadmapAPI } from '../services/api'
import { LoadingScreen, PageContainer, PageIntro, SectionCard } from '../components/AppShell'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLearningLanguage } from '../components/LanguageProvider'

const AnalyzePage = () => {
  const { language } = useLearningLanguage()

  useDocumentMeta({
    title: 'Analyze Skills | NextStep AI',
    description: 'Upload a resume and generate targeted education recommendations and roadmap inputs.',
    robots: 'noindex, follow',
  })

  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file && file.type === 'application/pdf') {
      setResume(file)
    } else {
      toast.error('Please upload a PDF file')
    }
  }

  const handleAnalyze = async (event) => {
    event.preventDefault()

    if (!resume) {
      toast.error('Please upload your resume')
      return
    }

    setAnalyzing(true)

    try {
      const formData = new FormData()
      formData.append('resume', resume)
      formData.append('target_role', targetRole)
      formData.append('job_description', jobDescription)
      formData.append('language', language.queryLabel)

      const { data } = await skillGapAPI.analyze(formData)
      setAnalysis(data)
      toast.success('Analysis complete!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Analysis failed')
    } finally {
      setAnalyzing(false)
    }
  }

  const handleGenerateRoadmap = async () => {
    if (!analysis) return

    setGenerating(true)

    try {
      const { data } = await roadmapAPI.generate({
        target_role: targetRole,
        job_description: jobDescription,
        skill_gaps: analysis.skill_gaps,
        current_skills: analysis.current_skills,
        language: language.queryLabel,
      })

      toast.success('Roadmap generated!')
      navigate(`/roadmap/${data.id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate roadmap')
    } finally {
      setGenerating(false)
    }
  }

  if (analyzing && !analysis) {
    return <LoadingScreen label="Analyzing your resume and role targets..." />
  }

  return (
    <PageContainer narrow>
      <PageIntro
        eyebrow="Skill gap analysis"
        title="Turn a resume into a concrete learning plan"
        description={`Upload a resume, define your target role, and generate a roadmap for ${language.label}-based preparation with matching learning videos.`}
        actions={<LanguageSwitcher />}
      />

      {!analysis ? (
        <form onSubmit={handleAnalyze} className="space-y-5">
          <SectionCard>
            <label className="mb-4 block text-lg font-bold">Upload resume (PDF)</label>
            <label className="block cursor-pointer rounded-[1.7rem] border-2 border-dashed border-[var(--border-strong)] bg-[var(--surface)] p-8 text-center transition hover:border-[var(--brand-blue)]">
              <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              <Upload className="mx-auto mb-4 text-[var(--brand-blue)]" size={38} />
              {resume ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-green)]/15 px-4 py-2 text-sm font-bold text-[var(--text-primary)]">
                  <FileText size={16} />
                  {resume.name}
                </div>
              ) : (
                <>
                  <p className="text-base font-bold">Choose a PDF resume or drag and drop it here</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">PDF only, recommended max size 10MB.</p>
                </>
              )}
            </label>
          </SectionCard>

          <SectionCard>
            <label className="mb-4 block text-lg font-bold">Preparation language</label>
            <div className="rounded-[1.5rem] bg-[var(--surface)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">Current preference: {language.label}</p>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-secondary)]">
                    Roadmap guidance and video discovery will use this learning language.
                  </p>
                </div>
                <LanguageSwitcher />
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <label className="mb-4 block text-lg font-bold">Target role</label>
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={18} />
              <input
                type="text"
                value={targetRole}
                onChange={(event) => setTargetRole(event.target.value)}
                className="input-field pl-12"
                placeholder="Full Stack Developer, Data Analyst, Product Designer..."
                required
              />
            </div>
          </SectionCard>

          <SectionCard>
            <label className="mb-4 block text-lg font-bold">Job description</label>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              className="input-field min-h-[220px] resize-none"
              placeholder="Paste the role description here for stronger analysis context."
            />
          </SectionCard>

          <button type="submit" disabled={analyzing || !resume} className="btn-primary w-full">
            <Sparkles size={18} />
            <span>{analyzing ? 'Analyzing...' : 'Analyze Skills'}</span>
          </button>
        </form>
      ) : (
        <div className="space-y-5">
          <SectionCard>
            <h2 className="text-2xl font-bold">Analysis results</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 text-lg font-bold text-[var(--brand-green)]">Current skills</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.current_skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-[var(--brand-green)]/15 px-3 py-2 text-sm font-semibold text-[var(--text-primary)]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-bold text-[var(--brand-orange)]">Skill gaps</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.skill_gaps.map((skill) => (
                    <span key={skill} className="rounded-full bg-[var(--brand-orange)]/15 px-3 py-2 text-sm font-semibold text-[var(--text-primary)]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {analysis.recommendations ? (
              <div className="mt-6 rounded-[1.5rem] bg-[var(--surface)] p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-1 text-[var(--brand-blue)]" size={18} />
                  <div>
                    <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Recommendations</p>
                    <p className="mt-2 text-base leading-7 text-[var(--text-secondary)]">{analysis.recommendations}</p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6 rounded-[1.5rem] bg-[var(--surface)] p-5">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Preparation language</p>
              <p className="mt-2 text-base leading-7 text-[var(--text-secondary)]">
                Videos and roadmap study for this role will be fetched in {language.label} whenever available.
              </p>
            </div>
          </SectionCard>

          <div className="grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={handleGenerateRoadmap} disabled={generating} className="btn-primary">
              <ArrowRight size={18} />
              <span>{generating ? 'Generating roadmap...' : 'Generate Learning Roadmap'}</span>
            </button>
            <button type="button" onClick={() => setAnalysis(null)} className="btn-secondary">
              Analyze Another Resume
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default AnalyzePage
