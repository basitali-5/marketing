import { Check, ChevronRight, Download } from 'lucide-react'
import { copyForDay, dayDate, imageOptions, videoOptions } from '../../data/content'

export default function ScheduleStage({ isVideo, campaignDays, copies, descriptionLength, media, scheduled, setScheduled, onReset }) {
  const handleToggle = () => setScheduled((current) => !current)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {isVideo ? 'Review and schedule the video' : 'Review and schedule the posts'}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Check each approval, confirm the chosen media and copy, and send the content to the publishing workflow.
      </p>

      <div className="mt-6 space-y-4">
        {campaignDays.map((day) => {
          const selectedCopy = copies[day] || copyForDay(day, descriptionLength)[0]
          const selectedMedia = media[day] || (isVideo ? videoOptions[0] : imageOptions[0])

          return (
            <article key={day} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:grid-cols-[170px_minmax(0,1fr)_auto_auto] md:items-center">
              {isVideo ? (
                <div className="w-full overflow-hidden rounded-xl bg-slate-200">
                  <video src={selectedMedia} controls preload="metadata" className="aspect-video w-full object-cover" />
                </div>
              ) : (
                <img src={selectedMedia} alt={`Day ${day}`} className="h-24 w-full rounded-xl object-cover" />
              )}

              <div>
                <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                  {isVideo ? 'SCENE' : `DAY ${String(day).padStart(2, '0')}`}
                </p>
                <p className="mt-1 text-base font-semibold text-slate-800">{selectedCopy.title}</p>
              </div>

              {!scheduled && (
                <>
                  <label className="text-xs font-medium text-slate-600">
                    Date
                    <input type="date" defaultValue={dayDate(day)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500" />
                  </label>
                  <label className="text-xs font-medium text-slate-600">
                    Time
                    <input type="time" defaultValue="10:00" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-700 outline-none focus:border-emerald-500" />
                  </label>
                </>
              )}

              {scheduled && <Check className="h-5 w-5 text-emerald-600" />}
            </article>
          )
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          className="rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          {scheduled ? 'Mark unscheduled' : 'Send to schedule'}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
        >
          Reset
        </button>

        <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <Download className="h-4 w-4" />
          Download summary
        </span>
      </div>
    </div>
  )
}
