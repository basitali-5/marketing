import { useEffect, useRef, useState } from 'react'
import { ChevronDown, LogOut, UserCircle2 } from 'lucide-react'

export default function Topbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    setMenuOpen(false)
    if (onLogout) onLogout()
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3.5 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-slate-500 lg:hidden">NovaCreate</p>
        <span className="hidden rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-700 lg:inline-flex">
          Studio
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-1.5 text-left transition-colors hover:bg-slate-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-900">
              BA
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-semibold leading-tight">Basit Ali</p>
              <p className="text-[11px] text-slate-500">Admin</p>
            </div>
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 z-20 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
              <div className="flex items-center gap-3 rounded-lg px-2 py-2 text-left">
                <UserCircle2 className="h-5 w-5 text-violet-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Basit Ali</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 inline-flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
