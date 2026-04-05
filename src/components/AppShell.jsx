import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
}

export const PageContainer = ({ children, narrow = false }) => (
  <div className={`mx-auto w-full px-4 py-6 sm:px-5 lg:px-6 lg:py-8 ${narrow ? 'max-w-5xl' : 'max-w-7xl'}`}>
    {children}
  </div>
)

export const PageIntro = ({ eyebrow, title, description, actions }) => (
  <motion.div {...pageTransition} className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    <div className="space-y-3">
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold sm:text-5xl">{title}</h1>
        {description ? <p className="max-w-3xl text-base leading-7 text-[var(--text-secondary)]">{description}</p> : null}
      </div>
    </div>
    {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
  </motion.div>
)

export const SectionCard = ({ children, className = '' }) => (
  <div className={`glass-card ${className}`.trim()}>{children}</div>
)

export const StatCard = ({ icon: Icon, label, value, tone = 'blue', detail }) => {
  const tones = {
    blue: 'bg-[var(--brand-blue)]/12 text-[var(--brand-blue)]',
    orange: 'bg-[var(--brand-orange)]/12 text-[var(--brand-orange)]',
    green: 'bg-[var(--brand-green)]/12 text-[var(--brand-green)]',
    lilac: 'bg-[var(--brand-lilac)]/14 text-[var(--brand-lilac)]',
    charcoal: 'bg-[var(--brand-charcoal)]/12 text-[var(--text-primary)]',
  }

  return (
    <SectionCard>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[var(--text-muted)]">{label}</p>
          <p className="mt-3 text-3xl font-extrabold">{value}</p>
          {detail ? <p className="mt-2 text-sm text-[var(--text-secondary)]">{detail}</p> : null}
        </div>
        <div className={`rounded-2xl p-3 ${tones[tone] || tones.blue}`}>
          <Icon size={22} />
        </div>
      </div>
    </SectionCard>
  )
}

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <SectionCard className="py-14 text-center">
    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface-strong)] text-[var(--brand-blue)]">
      <Icon size={28} />
    </div>
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-[var(--text-secondary)]">{description}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </SectionCard>
)

export const LoadingScreen = ({ label = 'Loading content...' }) => (
  <div className="flex min-h-[70vh] items-center justify-center px-4">
    <div className="text-center">
      <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-[var(--brand-blue)] border-t-transparent" />
      <p className="mt-4 text-sm font-semibold text-[var(--text-secondary)]">{label}</p>
    </div>
  </div>
)

export const AuthShell = ({ title, description, children, asideTitle, asideText, footer }) => (
  <div className="relative flex min-h-screen items-center px-4 py-8 sm:px-6">
    <div className="pointer-events-none absolute left-[-5rem] top-20 h-56 w-56 rounded-full bg-[var(--brand-lilac)]/25 blur-3xl" />
    <div className="pointer-events-none absolute bottom-0 right-[-3rem] h-64 w-64 rounded-full bg-[var(--brand-orange)]/20 blur-3xl" />
    <div className="page-shell grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <motion.div {...pageTransition} className="glass-card flex flex-col justify-between gap-8 rounded-[2rem] p-6 sm:p-8">
        <div className="space-y-5">
          <span className="eyebrow">Education workspace</span>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold sm:text-5xl">{asideTitle}</h1>
            <p className="text-base leading-8 text-[var(--text-secondary)]">{asideText}</p>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ['AI planning', 'Roadmaps based on missing skills and job goals'],
            ['Multi-language', 'Choose a preparation language and fetch matching videos'],
            ['Certificates', 'Track progress and unlock shareable completion proof'],
          ].map(([heading, text]) => (
            <div key={heading} className="rounded-[1.4rem] border border-[var(--border-soft)] bg-[var(--surface)] p-4">
              <p className="text-sm font-bold">{heading}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div {...pageTransition} transition={{ delay: 0.08 }} className="glass-card rounded-[2rem] p-6 sm:p-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-extrabold">{title}</h2>
          <p className="text-base text-[var(--text-secondary)]">{description}</p>
        </div>
        {children}
        {footer ? <div className="mt-8 border-t border-[var(--border-soft)] pt-6">{footer}</div> : null}
        <div className="mt-6 flex flex-wrap gap-4 border-t border-[var(--border-soft)] pt-5 text-sm font-semibold text-[var(--text-secondary)]">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </motion.div>
    </div>
  </div>
)
