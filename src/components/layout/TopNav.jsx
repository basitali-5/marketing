import { Image as ImageIcon, LogOut, Menu, Sparkles, Video } from 'lucide-react'

export default function TopNav({ view, setView, mode, setMode, onSignOut }) {
  const navItems = ['New post', 'History', 'Brand playbook']

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setView('New post')}
          className="flex items-center gap-2 text-[11px] font-black tracking-[0.14em] text-emerald-900"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Sparkles className="h-4 w-4" />
          </span>
          CONTENT DASHBOARD
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setView(item)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                view === item
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
            {[
              { key: 'image', label: 'Image', icon: ImageIcon },
              { key: 'video', label: 'Video', icon: Video },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition ${
                  mode === key ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 sm:inline-flex"
          >
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </button>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 md:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
