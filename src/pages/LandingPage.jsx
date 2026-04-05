import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Award, Map, Sparkles, Target } from 'lucide-react'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import ThemeToggle from '../components/ThemeToggle'
import LanguageSwitcher from '../components/LanguageSwitcher'

const LandingPage = () => {
  useDocumentMeta({
    title: 'NextStep AI | Roadmaps that remove confusion',
    description: 'Analyze skills, generate a roadmap, learn in your language, and export proof. Clean, calm, and focused on student outcomes.',
  })

  const features = [
    { icon: Target, title: 'Skill gap scan', desc: 'Upload your background and instantly see what is missing for the target role.' },
    { icon: Map, title: 'Guided roadmaps', desc: 'A short, ordered path with lessons, skills, and checkpoints you can actually follow.' },
    { icon: Award, title: 'Proof & certificates', desc: 'Finish milestones, export a certificate, and attach a polished resume when ready.' },
  ]

  return (
    <div className="bg-[var(--surface)] text-[var(--text-primary)]">
      <header className="border-b border-[var(--border-soft)] bg-[var(--surface)]/80 backdrop-blur">
        <div className="page-shell flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-charcoal)] text-white font-bold">NS</div>
            <div>
              <p className="text-lg font-bold">NextStep AI</p>
              <p className="text-xs text-[var(--text-muted)]">Roadmaps, not noise</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/login" className="btn-secondary">Sign in</Link>
            <Link to="/register" className="btn-primary">Create account</Link>
          </div>
        </div>
      </header>

      <main className="px-4 pb-12 pt-10 sm:px-6 lg:px-8">
        <section className="page-shell grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-elevated)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-secondary)]">
              <Sparkles size={14} /> Built for confused learners
            </span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              A calm learning home that tells you what to study next.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
              Run a quick analysis, get a focused roadmap, learn in your preferred language, and collect proof as you progress. No clutter, just guidance.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary text-base">
                Start free
                <ArrowRight size={16} />
              </Link>
              <Link to="/analyze" className="btn-secondary text-base">
                Run skill analysis
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {['Clear next step after every scan', 'Language-aware learning links', 'Certificate and resume ready when you finish'].map((item) => (
                <div key={item} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Live snapshot</p>
                <h2 className="mt-1 text-2xl font-bold">Your first 3 steps</h2>
              </div>
              <span className="rounded-full bg-[var(--brand-sky)] px-3 py-1 text-xs font-bold text-[var(--brand-charcoal)]">5 min setup</span>
            </div>
            <div className="mt-5 space-y-3">
              {[
                ['Upload resume or background', 'We read it and spot missing skills.'],
                ['Generate a roadmap', 'Only the skills and lessons you need.'],
                ['Save proof', 'Export certificate & resume when done.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] px-4 py-3">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-sm font-semibold text-[var(--text-secondary)]">
              <div className="rounded-2xl bg-[var(--surface)] px-3 py-3">
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">24/7</p>
                <p>Access</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface)] px-3 py-3">
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">3</p>
                <p>Languages</p>
              </div>
              <div className="rounded-2xl bg-[var(--surface)] px-3 py-3">
                <p className="text-2xl font-extrabold text-[var(--text-primary)]">15</p>
                <p>Roadmap templates</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="page-shell mt-12">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">Why it works</p>
              <h2 className="mt-1 text-3xl font-extrabold">Simple steps. No extra noise.</h2>
            </div>
            <Link to="/roadmaps" className="btn-secondary">See roadmaps</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map((item, idx) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-elevated)] p-5"
              >
                <div className="mb-4 inline-flex rounded-xl bg-[var(--surface)] p-3 text-[var(--brand-blue)]">
                  <item.icon size={20} />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="page-shell mt-12">
          <div className="rounded-[1.8rem] border border-[var(--border-soft)] bg-[var(--surface-elevated)] px-6 py-8 sm:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-4">
                <span className="eyebrow">Ready when you are</span>
                <h2 className="text-3xl font-extrabold sm:text-4xl">Launch your roadmap in minutes.</h2>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                  NextStep AI keeps the surface clean so learners can focus. Analyze, follow the roadmap, and collect proof without scrolling past filler sections.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/register" className="btn-primary">
                    Create account
                  </Link>
                  <Link to="/contact" className="btn-secondary">
                    Talk to us
                  </Link>
                </div>
              </div>
              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface)] p-5">
                <h3 className="text-lg font-bold">You’ll get</h3>
                <ul className="mt-3 space-y-2 text-sm text-[var(--text-secondary)]">
                  <li>• Skill analysis with clear missing items</li>
                  <li>• Focused roadmap with language-aware videos</li>
                  <li>• Certificate + resume export when milestones are done</li>
                  <li>• Dark/light themes and mobile-ready layout</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--border-soft)] bg-[var(--surface)] px-4 py-6 sm:px-6">
        <div className="page-shell flex flex-col gap-3 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>NextStep AI — clean roadmaps, fewer distractions.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
