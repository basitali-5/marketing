import { Check, ChevronRight } from 'lucide-react'
import { copyForDay } from '../../data/content'

export default function CopyStage({ isVideo, campaignDays, copies, setCopies, descriptionLength, setDescriptionLength, onNext }) {
  const lengths = [
    { id: 'small', label: 'Small', help: '3-4 lines + hashtags' },
    { id: 'medium', label: 'Medium', help: '5-7 lines + hashtags' },
    { id: 'large', label: 'Large', help: '8-10 lines + hashtags' },
  ]

  const changeLength = (id) => {
    setDescriptionLength(id)
    setCopies({})
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {isVideo ? 'Choose a direction for the scene' : 'Choose a post for each day'}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Choose a description length, then pick one of two variations. Every option includes ready-to-use hashtags.
      </p>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {lengths.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => changeLength(item.id)}
            className={`relative rounded-2xl border p-4 text-left transition ${
              descriptionLength === item.id
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
            }`}
          >
            <span className="block text-sm font-semibold">{item.label}</span>
            <span className="mt-1 block text-xs text-slate-500">{item.help}</span>
            {descriptionLength === item.id && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check className="h-3 w-3" />
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-5">
        {campaignDays.map((day) => {
          const options = copyForDay(day, descriptionLength)
          const selected = copies[day] || options[0]

          return (
            <article key={day} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                  {isVideo ? 'SCENE' : `DAY ${String(day).padStart(2, '0')}`}
                </p>
                <span className="text-sm font-semibold text-slate-700">{selected.title}</span>
              </div>

              <div className="grid gap-3 lg:grid-cols-2">
                {options.map((option) => (
                  <button
                    key={option.title}
                    type="button"
                    onClick={() => setCopies((current) => ({ ...current, [day]: option }))}
                    className={`rounded-2xl border p-4 text-left transition ${
                      selected.title === option.title
                        ? 'border-emerald-600 bg-white shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <p className="text-[10px] font-bold tracking-[0.14em] text-slate-500">
                      OPTION {option === options[0] ? 'A' : 'B'}
                    </p>
                    <h2 className="mt-2 text-base font-semibold text-slate-800">{option.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{option.text}</p>
                    {selected.title === option.title && (
                      <span className="mt-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </article>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Choose {isVideo ? 'scene' : 'image'} options
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
