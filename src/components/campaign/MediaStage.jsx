import { Check, ChevronRight, Image as ImageIcon, Play } from 'lucide-react'
import { copyForDay, imageOptions, promptsForDay, videoOptions } from '../../data/content'

export default function MediaStage({ isVideo, campaignDays, copies, descriptionLength, prompts, setPrompts, media, setMedia, onNext }) {
  const options = isVideo ? videoOptions : imageOptions

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {isVideo ? 'Choose the scene for the video' : 'Choose images for each day'}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {isVideo
          ? 'Pick the final scene that will drive the generated video and the scheduled post.'
          : 'Select one short visual prompt and one final image for each day. The selected description is kept with every media choice.'}
      </p>

      <div className="mt-6 space-y-5">
        {campaignDays.map((day) => {
          const promptOptions = promptsForDay(day)
          const selectedPrompt = prompts[day] || promptOptions[0]
          const selectedMedia = media[day] || options[0]

          return (
            <article key={day} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between gap-4">
                <p className="text-[10px] font-bold tracking-[0.16em] text-emerald-700">
                  {isVideo ? 'SCENE' : `DAY ${String(day).padStart(2, '0')}`}
                </p>
                <span className="text-sm font-semibold text-slate-700">
                  {isVideo ? 'Selected scene' : (copies[day] || copyForDay(day, descriptionLength)[0]).title}
                </span>
              </div>

              {!isVideo && (
                <div className="mb-4 grid gap-3 lg:grid-cols-2">
                  {promptOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setPrompts((current) => ({ ...current, [day]: option }))}
                      className={`rounded-xl border p-3 text-left transition ${
                        selectedPrompt === option
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <span className="block text-[10px] font-bold tracking-[0.14em] text-slate-500">
                        SHORT PROMPT {option === promptOptions[0] ? 'A' : 'B'}
                      </span>
                      <span className="mt-2 block text-sm leading-6">{option}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                {options.map((url, index) => (
                  <button
                    key={`${day}-${url}`}
                    type="button"
                    onClick={() => setMedia((current) => ({ ...current, [day]: url }))}
                    className={`relative overflow-hidden rounded-2xl border bg-white p-2 text-left transition ${
                      selectedMedia === url ? 'border-emerald-600 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isVideo ? (
                      <div className="w-full overflow-hidden rounded-xl bg-slate-200">
                        <video src={url} controls preload="metadata" className="aspect-video w-full object-cover" />
                      </div>
                    ) : (
                      <img src={url} alt={`Image option ${index + 1} for day ${day}`} className="h-28 w-full rounded-xl object-cover" />
                    )}

                    <div className="mt-2 flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
                      <span className="inline-flex items-center gap-1.5">
                        {isVideo ? <Play className="h-3.5 w-3.5" /> : <ImageIcon className="h-3.5 w-3.5" />}
                        {isVideo ? `VIDEO ${index + 1}` : `IMAGE ${index + 1}`}
                      </span>
                      {selectedMedia === url && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                    </div>
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
        Generate {isVideo ? 'video' : 'posts'}
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
