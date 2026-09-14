import { Package, Sparkles } from 'lucide-react'

const nav = [
  { label: 'Create Content', icon: Sparkles },
  { label: 'Scheduling', icon: Package },
  { label: 'Brand Playbook', icon: Package },
]

export default function Sidebar({ activeView, onNavigate }) {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-[oklch(0.22_0.045_265)] p-4 text-[oklch(0.97_0.005_250)] lg:flex">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[oklch(0.55_0.2_262)] text-[oklch(0.99_0.002_250)]">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold leading-tight">NovaCreate</p>
          <p className="text-xs text-[oklch(0.72_0.03_258)]">AI Image &amp; Video Studio</p>
        </div>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1">
        {nav.map(({ label, icon: Icon }) => {
          const isActive = activeView === label
          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(label)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[oklch(0.55_0.2_262)] text-[oklch(0.99_0.002_250)]'
                  : 'text-[oklch(0.72_0.03_258)] hover:bg-[oklch(0.28_0.05_265)] hover:text-[oklch(0.97_0.005_250)]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          )
        })}
      </nav>

    </aside>
  )
}
