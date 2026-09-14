import { ChevronRight, Upload } from 'lucide-react'

export default function ReferenceStage({ isVideo, days, setDays, reference, setReference, videoPrompt, setVideoPrompt, model, setModel, onNext }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {isVideo ? 'Plan a video campaign' : 'Plan an image campaign'}
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {isVideo
          ? 'Choose the scene that drives the final video. The selected scene is used for generation and scheduling.'
          : 'Set the length of this campaign first. Every selected day gets its own copy choice, media choice, and scheduled post.'}
      </p>

      <div className="mt-6 space-y-5">
        <label className="block text-sm font-medium text-slate-700">
          Brand playbook
          <select className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100">
            <option>No playbooks yet</option>
          </select>
        </label>

        {isVideo ? (
          <label className="block text-sm font-medium text-slate-700">
            Video model
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            >
              <option>Choose later</option>
              <option>Runway Gen-3</option>
              <option>Pika</option>
              <option>Veo</option>
              <option>OpenAI video</option>
            </select>
            <small className="mt-2 block text-xs text-slate-500">
              Model selection is saved locally until you connect a paid video provider.
            </small>
          </label>
        ) : (
          <label className="block text-sm font-medium text-slate-700">
            Image prompt
            <textarea
              value={videoPrompt}
              onChange={(event) => setVideoPrompt(event.target.value)}
              rows="4"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        )}

        <label className="block text-sm font-medium text-slate-700">
          Reference text
          <textarea
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            rows="4"
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="block text-sm font-medium text-slate-700">
          Reference {isVideo ? 'video or image' : 'image'}
          <span className="mt-2 flex items-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600">
            <Upload className="h-4 w-4 text-emerald-700" />
            <input type="file" accept={isVideo ? 'video/*,image/*' : 'image/*'} className="hidden" />
            Choose file
          </span>
        </label>

        {!isVideo && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">How many days?</p>
                <p className="text-xs text-slate-500">Generate one post plan per day.</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-7">
              {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setDays(day)}
                  className={`flex flex-col items-center rounded-xl border px-2 py-3 transition ${
                    days === day
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg font-bold">{day}</span>
                  <span className="text-[10px] uppercase tracking-wide">day{day > 1 ? 's' : ''}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          {isVideo ? 'Build video scene' : `Build ${days}-day plan`}
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
