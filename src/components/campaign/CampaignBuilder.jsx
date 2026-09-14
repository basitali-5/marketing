import { useMemo, useState } from 'react'
import ProgressRail from '../layout/ProgressRail'
import ReferenceStage from './ReferenceStage'
import CopyStage from './CopyStage'
import MediaStage from './MediaStage'
import ScheduleStage from './ScheduleStage'

export default function CampaignBuilder({ mode }) {
  const isVideo = mode === 'video'
  const [step, setStep] = useState(1)
  const [days, setDays] = useState(3)
  const [reference, setReference] = useState('Eid campaign, focus on the new pricing tier, keep it warm')
  const [videoPrompt, setVideoPrompt] = useState(
    'A calm, confident story about moving from manual work to meaningful progress.',
  )
  const [model, setModel] = useState('Choose later')
  const [descriptionLength, setDescriptionLength] = useState('small')
  const [copies, setCopies] = useState({})
  const [prompts, setPrompts] = useState({})
  const [media, setMedia] = useState({})
  const [scheduled, setScheduled] = useState(false)

  const labels = isVideo ? ['Reference', 'Direction', 'Video', 'Schedule'] : ['Reference', 'Post', 'Image', 'Schedule']
  const campaignDays = useMemo(
    () => (isVideo ? [1] : Array.from({ length: days }, (_, index) => index + 1)),
    [days, isVideo],
  )

  const reset = () => {
    setStep(1)
    setCopies({})
    setPrompts({})
    setMedia({})
    setScheduled(false)
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8">
      <ProgressRail step={step} labels={labels} isVideo={isVideo} days={days} />

      <section className="min-w-0">
        {step === 1 && (
          <ReferenceStage
            isVideo={isVideo}
            days={days}
            setDays={setDays}
            reference={reference}
            setReference={setReference}
            videoPrompt={videoPrompt}
            setVideoPrompt={setVideoPrompt}
            model={model}
            setModel={setModel}
            onNext={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <CopyStage
            isVideo={isVideo}
            campaignDays={campaignDays}
            copies={copies}
            setCopies={setCopies}
            descriptionLength={descriptionLength}
            setDescriptionLength={setDescriptionLength}
            onNext={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <MediaStage
            isVideo={isVideo}
            campaignDays={campaignDays}
            copies={copies}
            descriptionLength={descriptionLength}
            prompts={prompts}
            setPrompts={setPrompts}
            media={media}
            setMedia={setMedia}
            onNext={() => setStep(4)}
          />
        )}

        {step === 4 && (
          <ScheduleStage
            isVideo={isVideo}
            campaignDays={campaignDays}
            copies={copies}
            descriptionLength={descriptionLength}
            media={media}
            scheduled={scheduled}
            setScheduled={setScheduled}
            onReset={reset}
          />
        )}
      </section>
    </main>
  )
}
