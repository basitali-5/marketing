import { useState } from 'react'
import { ChevronRight, LockKeyhole } from 'lucide-react'

export default function DemoLogin({ onSignIn }) {
  const [email, setEmail] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (event) => {
    event.preventDefault()
    if (email === 'admin' && password === 'admin1234') {
      onSignIn()
      return
    }
    setError('Use the admin credentials.')
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-br from-emerald-50 via-white to-sky-50 p-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/60">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <LockKeyhole className="h-5 w-5" />
        </div>

        <p className="mb-3 text-[11px] font-black tracking-[0.18em] text-emerald-700">CONTENT DASHBOARD</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to open the demo workspace.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-xs font-semibold text-slate-700">
            Username
            <input
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
                setError('')
              }}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="block text-xs font-semibold text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              placeholder="Enter demo password"
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          {error && <small className="block text-xs font-medium text-red-600">{error}</small>}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            Open demo
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>

        <small className="mt-4 block text-[11px] leading-5 text-slate-500">
          Demo access uses a local browser session. JWT authentication can replace this later.
        </small>
      </section>
    </main>
  )
}
