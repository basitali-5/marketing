import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import PlaybookField from './PlaybookField'

const defaultPlaybooks = [
  {
    name: 'NovuLabs Brand Playbook',
    company: 'NovuLabs Technology Pvt Ltd',
    do: 'We engineer enterprise-grade, resilient cloud software platforms for banks, institutions, government agencies, healthcare entities, and global enterprises. Our methodology blends AI, security, and regulatory compliance.',
    audience: 'Regulated industries, financial institutions, banks, and high-stakes B2B leaders. Governments, public sector entities, large healthcare providers, enterprise and global software operations.',
    voice: 'Ambitious, bold, highly authoritative, technically rigorous, aspirational, quietly focused, transparent, and precise.',
    highlights: 'AWS/PCI compliance and platform modernization. Enterprise payment systems, cloud architecture, and resilient digital foundations.',
    avoid: 'Avoid exaggerated promises, generic AI claims, overly casual language, competitor attacks, and empty buzzwords.',
    cta: 'Build for the future. Scale with confidence. Start building.',
  },
]

const getSavedPlaybooks = () => {
  if (typeof window === 'undefined') return defaultPlaybooks

  try {
    const raw = window.localStorage.getItem('nova-playbooks')
    if (!raw) return defaultPlaybooks
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : defaultPlaybooks
  } catch (error) {
    console.warn('Failed to load saved playbooks', error)
    return defaultPlaybooks
  }
}

export default function BrandPlaybook({ onPlaybooksChange }) {
  const [playbooks, setPlaybooks] = useState(getSavedPlaybooks)
  const [selected, setSelected] = useState(0)
  const [form, setForm] = useState(getSavedPlaybooks()[0])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nova-playbooks', JSON.stringify(playbooks))
    }
    if (onPlaybooksChange) {
      onPlaybooksChange(playbooks)
    }
  }, [playbooks, onPlaybooksChange])

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const changePlaybook = (index) => {
    const nextIndex = Number(index)
    setSelected(nextIndex)
    setForm(playbooks[nextIndex])
    setSaved(false)
  }

  const save = () => {
    const next = playbooks.map((item, index) => (index === selected ? form : item))
    setPlaybooks(next)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nova-playbooks', JSON.stringify(next))
    }
    setSaved(true)
  }

  const create = () => {
    const blank = {
      name: 'Untitled brand playbook',
      company: '',
      do: '',
      audience: '',
      voice: '',
      highlights: '',
      avoid: '',
      cta: '',
    }

    const next = [...playbooks, blank]
    setPlaybooks(next)
    setSelected(next.length - 1)
    setForm(blank)
    setSaved(false)
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Brand playbook</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use it when the ideas need a reliable point of view. Your answers here produce stronger options.
        </p>

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Saved playbooks
            <select
              value={selected}
              onChange={(event) => changePlaybook(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              {playbooks.map((playbook, index) => (
                <option key={playbook.name || index} value={index}>
                  {playbook.name}
                </option>
              ))}
            </select>
          </label>

          <PlaybookField label="Playbook name" value={form.name} onChange={(value) => update('name', value)} />
          <PlaybookField label="Company" value={form.company} onChange={(value) => update('company', value)} />
          <PlaybookField label="What we do" value={form.do} onChange={(value) => update('do', value)} area />
          <PlaybookField label="Audience" value={form.audience} onChange={(value) => update('audience', value)} area />
          <PlaybookField label="Voice" value={form.voice} onChange={(value) => update('voice', value)} area />
          <PlaybookField label="Highlights" value={form.highlights} onChange={(value) => update('highlights', value)} area />
          <PlaybookField label="Avoid" value={form.avoid} onChange={(value) => update('avoid', value)} area />
          <PlaybookField label="CTA" value={form.cta} onChange={(value) => update('cta', value)} />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={save}
            className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Save playbook
          </button>

          <button
            type="button"
            onClick={create}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            New playbook
          </button>

          {saved && (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" />
              Saved
            </span>
          )}
        </div>
      </section>
    </main>
  )
}
