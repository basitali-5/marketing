export default function Placeholder({ title }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-[11px] font-black tracking-[0.18em] text-emerald-700">MARKETING DASHBOARD</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-3 text-sm text-slate-500">Saved content and brand guidance will live here.</p>
      </div>
    </main>
  )
}
