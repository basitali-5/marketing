import { Wand2 } from 'lucide-react'

export default function ProgressRail({ step, labels, isVideo, days }) {
  return (
    <aside className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-sm">
          <Wand2 className="h-4 w-4" />
        </div>
        <div>
          <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">WORKFLOW</p>
          <p className="text-sm font-semibold text-slate-700">Campaign flow</p>
        </div>
      </div>

      <div className="space-y-4">
        {labels.map((label, index) => (
          <div
            key={label}
            className={`relative flex items-center gap-3 rounded-xl px-3 py-2 ${
              step === index + 1 ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500'
            } ${step > index + 1 ? 'text-slate-700' : ''}`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
        <p className="text-[10px] font-bold tracking-[0.14em] text-emerald-700">CAMPAIGN</p>
        <p className="mt-2 text-xs text-slate-500">{isVideo ? '1 scene' : `${days} days`}</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">
          {isVideo ? 'Video campaign' : 'Image campaign'}
        </p>
      </div>
    </aside>
  )
}
