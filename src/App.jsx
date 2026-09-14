import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Calendar,
  Clock,
  Download,
  Eye,
  Image as ImageIcon,
  Info,
  Play,
  Plus,
  RefreshCw,
  Server,
  Sparkles,
  Trash2,
  Upload,
  Video as VideoIcon,
  X,
} from 'lucide-react'
import Sidebar from './components/dashboard/Sidebar'
import Topbar from './components/dashboard/Topbar'
import { Card, Field, OptionGrid } from './components/dashboard/ui'
import BrandPlaybook from './components/playbook/BrandPlaybook'
import api from './lib/api'

const colorThemes = [
  { name: 'Blue', css: 'oklch(0.55 0.2 262)' },
  { name: 'Violet', css: 'oklch(0.62 0.19 300)' },
  { name: 'Pink', css: 'oklch(0.66 0.2 5)' },
  { name: 'Orange', css: 'oklch(0.72 0.16 60)' },
  { name: 'Green', css: 'oklch(0.68 0.16 155)' },
  { name: 'Slate', css: 'oklch(0.5 0.03 258)' },
]

const platforms = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'X (Twitter)']
const templateIdeas = [
  { title: 'Product Launch', type: 'Video', description: 'Fast hero clip with motion graphics and CTA.' },
  { title: 'Brand Story', type: 'Image', description: 'Purpose-driven imagery with a polished brand palette.' },
  { title: 'Weekly Campaign', type: 'Carousel', description: 'A three-slide supporting narrative for social distribution.' },
]

const defaultPlaybooks = [
  {
    name: 'NovuLabs Brand Playbook',
    company: 'NovuLabs Technology Pvt Ltd',
    do: 'We engineer enterprise-grade, resilient cloud software platforms for banks, institutions, government agencies, healthcare entities, and global enterprises. Our methodology blends AI, security, and regulatory compliance.',
    audience: 'Regulated industries, financial institutions, banks, and high-stakes B2B leaders. Governments, public sector entities, large healthcare providers, enterprise and global software operations.',
    voice: 'Ambitious, bold, highly authoritative, technically rigorous, aspirational, quietly focused, transparent, and precise.',
    highlights: 'AWS/PCI compliance and platform modernization. Enterprise payment systems, cloud architecture, and resilient digital foundations.',
    avoid: 'Avoid exaggerated promises, generic AI claims, overly casual language, competitor attacks, and empty buzzwords.',
    cta: 'Build for the future. Scale with confidence. Start building.',
    guidance: 'Bold, trustworthy, enterprise-grade, polished, and confident with a premium B2B technology tone.',
  },
  {
    name: 'Product Launch Playbook',
    company: 'Product Launch Team',
    do: 'We launch differentiated digital products for fast-moving teams and modern brands.',
    audience: 'Early adopters, growth marketers, startup founders, and product leaders.',
    voice: 'Confident, energetic, polished, modern, action-oriented, and conversion-minded.',
    highlights: 'Strong product positioning, memorable launch moments, emotional storytelling, and business impact.',
    avoid: 'Avoid vague positioning, weak hooks, generic claims, and low-credibility language.',
    cta: 'Launch smarter. Grow faster. Own the moment.',
    guidance: 'High-impact, launch-focused, energetic, modern, and conversion-oriented with strong product storytelling.',
  },
  {
    name: 'Social Growth Playbook',
    company: 'Social Growth Studio',
    do: 'We help brands grow with content systems that build trust, attention, and community at scale.',
    audience: 'Creators, community managers, growth teams, and digital-first brands.',
    voice: 'Fast, optimistic, culturally aware, engaging, trend-smart, and audience-centered.',
    highlights: 'Short-form video, social storytelling, growth loops, and community-first campaigns.',
    avoid: 'Avoid overly corporate language, cold messaging, and repetitive copy.',
    cta: 'Create momentum. Build community. Grow faster.',
    guidance: 'Creator-first, engaging, fast-moving, trend-aware, and audience-focused for scalable social reach.',
  },
  {
    name: 'Campaign Storytelling Playbook',
    company: 'Campaign Storytelling Lab',
    do: 'We shape customer stories and campaign narratives that connect strategy, emotion, and measurable outcomes.',
    audience: 'Marketing leaders, campaign managers, agency teams, and brand strategists.',
    voice: 'Narrative-led, warm, strategic, polished, human, and persuasive.',
    highlights: 'Customer storytelling, emotional sequencing, structured messaging, and campaign clarity.',
    avoid: 'Avoid shallow slogans, flat copy, empty promises, and generic audience language.',
    cta: 'Tell the story that moves people to act.',
    guidance: 'Narrative-driven, emotional, structured, customer-centered, and highly persuasive storytelling tone.',
  },
]

const getPlaybookGuidance = (entry) => {
  if (!entry) return ''
  if (entry.guidance) return entry.guidance
  return [entry.voice, entry.do, entry.highlights].filter(Boolean).join(' ')
}

const getSavedPlaybooks = () => {
  if (typeof window === 'undefined') return defaultPlaybooks

  try {
    const raw = window.localStorage.getItem('nova-playbooks')
    const parsed = raw ? JSON.parse(raw) : null
    if (Array.isArray(parsed) && parsed.length) return parsed
  } catch (error) {
    console.warn('Could not parse saved playbooks', error)
  }

  return defaultPlaybooks
}

const getDateOffsetISO = (offsetDays = 0) => {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().split('T')[0]
}

const buildScheduleEntry = (dayIndex = 0, previous = {}) => ({
  date: previous.date || getDateOffsetISO(dayIndex),
  time: previous.time || '10:00',
})

const promptBuilder = ({ mode, reference, ratio, theme, platforms, playbookInfo, days, promptText }) => {
  const platformText = platforms.length ? platforms.join(', ') : 'Instagram'
  const brandText = playbookInfo?.company ? `${playbookInfo.company}.` : ''
  const guidanceText = playbookInfo?.guidance || playbookInfo?.voice || 'Premium, polished, conversion-focused.'
  const brandDoText = playbookInfo?.do ? `What we do: ${playbookInfo.do}.` : ''
  const brandAudienceText = playbookInfo?.audience ? `Audience: ${playbookInfo.audience}.` : ''
  const brandHighlightsText = playbookInfo?.highlights ? `Brand highlights: ${playbookInfo.highlights}.` : ''
  const brandAvoidText = playbookInfo?.avoid ? `Avoid: ${playbookInfo.avoid}.` : ''
  const basePrompt = mode === 'image'
    ? 'Create a premium, high-conversion social media image'
    : 'Create a premium, high-conversion short-form social media video'

  const selectedPrompt = promptText ? `Use this creative brief: ${promptText}.` : 'Create a strong marketing visual with modern composition.'
  const referenceText = reference ? `Additional direction: ${reference}.` : ''
  const ratioText = ratio ? `Use aspect ratio ${ratio}.` : ''
  const themeText = theme ? `Use a ${theme.toLowerCase()} color palette and visually consistent tones.` : ''
  const outputsText = `Generate ${days || 1} campaign-ready ${mode} concepts for ${platformText}.`

  return `${basePrompt} for ${brandText} ${guidanceText}. ${brandDoText} ${brandAudienceText} ${brandHighlightsText} ${brandAvoidText} ${selectedPrompt} ${referenceText} ${ratioText} ${themeText} ${outputsText}`.replace(/\s+/g, ' ').trim()
}

const buildScheduledPostCopy = ({ promptText, playbookInfo, platforms, reference, mode }) => {
  const company = (playbookInfo?.company || 'Your brand').replace(/[^a-zA-Z0-9 ]/g, '').trim()
  const sourceText = promptText || reference || 'Creative content that stands out and converts.'
  const idea = sourceText.replace(/\s+/g, ' ').trim()
  const shortIdea = idea.length > 120 ? `${idea.slice(0, 117).trim()}...` : idea
  const cta = playbookInfo?.cta || 'Build for the future. Scale with confidence.'
  const platformTags = (platforms.length ? platforms : ['Instagram']).map((platform) => {
    const clean = platform.replace(/[^a-zA-Z0-9]/g, '')
    return `#${clean}`
  })

  const hashtags = [
    `#${company.replace(/\s+/g, '') || 'Brand'}`,
    '#ContentMarketing',
    '#SocialMedia',
    '#BrandStory',
    ...platformTags,
  ].slice(0, 8).join(' ')

  const description = `${mode === 'image' ? 'Campaign image ready for launch.' : 'Campaign video ready for launch.'} Built around the idea: ${shortIdea}. This ${mode === 'image' ? 'visual' : 'video'} reflects ${company || 'our brand'} with clarity, confidence, and strong audience connection. ${cta}`

  return {
    description: description.replace(/\s+/g, ' ').trim(),
    hashtags,
  }
}

const makeFallbackMedia = ({ mode, title, prompt }) => {
  if (mode === 'image') {
    const safeTitle = encodeURIComponent((title || 'Campaign design').slice(0, 60))
    const safePrompt = encodeURIComponent((prompt || 'Creative campaign concept').slice(0, 120))
    return `https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80&text=${safeTitle}&prompt=${safePrompt}`
  }

  return 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
}

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin'

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.localStorage.getItem('nova-auth') === 'true'
  })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [activeView, setActiveView] = useState('Create Content')
  const [mode, setMode] = useState('image')
  const [imagePrompts, setImagePrompts] = useState([
    'Modern workspace with laptop, coffee and productivity setup',
    'Minimal lifestyle / work-life balance theme',
  ])
  const [videoPrompts, setVideoPrompts] = useState([
    '5 second motivational brand video (office / teamwork vibe)',
    '5 second product showcase or service highlight',
  ])
  const [ratio, setRatio] = useState('1:1')
  const [resolution, setResolution] = useState('720p')
  const [theme, setTheme] = useState('Blue')
  const [reference, setReference] = useState('')
  const [referenceFile, setReferenceFile] = useState(null)
  const [referencePreview, setReferencePreview] = useState('')
  const [promptSize, setPromptSize] = useState('Medium')
  const [days, setDays] = useState('3')
  const [scheduleEntries, setScheduleEntries] = useState(() =>
    Array.from({ length: 3 }, (_, index) => buildScheduleEntry(index)),
  )
  const [selected, setSelected] = useState(['Instagram'])
  const [generatedMedia, setGeneratedMedia] = useState({ image: '', video: '' })
  const [postCopies, setPostCopies] = useState([{ description: '', hashtags: '' }])
  const [copyIndex, setCopyIndex] = useState(0)
  const [generating, setGenerating] = useState(false)

  const updatePostCopy = (field, value) => {
    setPostCopies((current) => {
      const next = [...current]
      next[copyIndex] = { ...(next[copyIndex] || { description: '', hashtags: '' }), [field]: value }
      return next
    })
  }
  const [statusMessage, setStatusMessage] = useState('')
  const [statusTone, setStatusTone] = useState('neutral')
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState({})
  const [backendStatus, setBackendStatus] = useState('Checking…')
  const [playbooks, setPlaybooks] = useState(getSavedPlaybooks)
  const [playbook, setPlaybook] = useState(() => {
    if (typeof window === 'undefined') return 'NovuLabs Brand Playbook'
    return window.localStorage.getItem('nova-playbook-active') || 'NovuLabs Brand Playbook'
  })

  const handlePlaybooksChange = (nextPlaybooks) => {
    if (!Array.isArray(nextPlaybooks) || !nextPlaybooks.length) return
    setPlaybooks(nextPlaybooks)
    if (!nextPlaybooks.some((entry) => entry.name === playbook)) {
      setPlaybook(nextPlaybooks[0].name)
    }
  }

  const handleLogin = (event) => {
    event.preventDefault()

    if (loginForm.username === ADMIN_USERNAME && loginForm.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError('')
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('nova-auth', 'true')
      }
      return
    }

    setLoginError('Invalid username or password.')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setLoginForm({ username: '', password: '' })
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('nova-auth')
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nova-playbooks', JSON.stringify(playbooks))
    }
  }, [playbooks])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('nova-playbook-active', playbook)
    }
  }, [playbook])

  const activePlaybook = playbooks.find((entry) => entry.name === playbook) || null
  const activePlaybookGuidance = getPlaybookGuidance(activePlaybook)
  const activePlaybookInstructions = activePlaybook
    ? [
        activePlaybook.company ? `Company: ${activePlaybook.company}` : '',
        activePlaybook.do ? `What we do: ${activePlaybook.do}` : '',
        activePlaybook.audience ? `Audience: ${activePlaybook.audience}` : '',
        activePlaybook.voice ? `Voice: ${activePlaybook.voice}` : '',
        activePlaybook.highlights ? `Highlights: ${activePlaybook.highlights}` : '',
        activePlaybook.avoid ? `Avoid: ${activePlaybook.avoid}` : '',
        activePlaybook.cta ? `CTA: ${activePlaybook.cta}` : '',
      ].filter(Boolean).join(' | ')
    : ''

  const prompts = mode === 'image' ? imagePrompts : videoPrompts
  const setPrompts = mode === 'image' ? setImagePrompts : setVideoPrompts

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const payload = await api.health()
        setBackendStatus(payload?.status === 'ok' ? 'Connected' : 'Ready')
      } catch (error) {
        setBackendStatus('Offline')
      }
    }

    checkBackend()
  }, [])

  const refreshJobs = async () => {
    try {
      const response = await api.listJobs()
      setJobs(Array.isArray(response) ? response : [])
    } catch (error) {
      setJobs([])
    }
  }

  const refreshStats = async () => {
    try {
      const response = await api.stats()
      setStats(response || {})
    } catch (error) {
      setStats({})
    }
  }

  useEffect(() => {
    if (activeView === 'History' || activeView === 'Home') {
      refreshJobs()
      refreshStats()
    }
  }, [activeView])

  const updatePrompt = (index, value) =>
    setPrompts(prompts.map((prompt, promptIndex) => (promptIndex === index ? value : prompt)))

  const canScheduleContent = postCopies.some((copy) => (copy?.description || '').trim() && (copy?.hashtags || '').trim())

  const handleScheduleNavigation = () => {
    if (!canScheduleContent) {
      setStatusMessage('Generate captions and hashtags before scheduling the post.')
      setStatusTone('error')
      return
    }

    setStatusMessage('')
    setActiveView('Scheduling')
  }

  const removePrompt = (index) => setPrompts(prompts.filter((_, promptIndex) => promptIndex !== index))
  const addPrompt = () => setPrompts([...prompts, ''])

  const togglePlatform = (platform) => {
    setSelected((current) =>
      current.includes(platform) ? current.filter((item) => item !== platform) : [...current, platform],
    )
  }

  useEffect(() => {
    setScheduleEntries((current) => {
      const nextCount = Number(days) || 1
      const updated = Array.from({ length: nextCount }, (_, index) => {
        const existing = current[index] || {}
        return buildScheduleEntry(index, existing)
      })
      return updated
    })
  }, [days])

  const handleScheduleChange = (index, field, value) => {
    setScheduleEntries((current) =>
      current.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: value } : entry,
      ),
    )
  }

  const generateSinglePostCopy = (index) => {
    const promptForDay = prompts[index] || prompts[0] || 'AI generated content'
    const copy = buildScheduledPostCopy({
      promptText: promptForDay,
      playbookInfo: activePlaybook,
      platforms: selected,
      reference,
      mode,
    })

    setPostCopies((current) => {
      const next = Array.from({ length: Math.max(current.length, prompts.length) }, (_, dayIndex) => current[dayIndex] || { description: '', hashtags: '' })
      next[index] = copy
      return next
    })

    setCopyIndex(index)
    setStatusMessage(`Captions and hashtags generated for day ${index + 1}.`)
    setStatusTone('success')
  }

  const generateSinglePromptMedia = async (index) => {
    const promptForDay = prompts[index] || prompts[0] || 'AI generated content'
    if (!promptForDay.trim()) {
      setStatusMessage('Add a prompt for this day before generating media.')
      setStatusTone('error')
      return
    }

    setGenerating(true)
    setStatusMessage(`Generating ${mode} for day ${index + 1}…`)
    setStatusTone('neutral')

    try {
      const finalPrompt = promptBuilder({
        mode,
        reference: reference || promptForDay,
        ratio,
        theme,
        platforms: selected,
        playbookInfo: activePlaybook,
        days: Number(days) || 1,
        promptText: promptForDay,
      })

      const formData = new FormData()
      formData.append('title', `${mode === 'image' ? 'AI image' : 'AI video'} day ${index + 1}`)
      formData.append('description', promptForDay)
      formData.append('prompt', finalPrompt)
      formData.append('reference_text', reference || promptForDay)
      formData.append('post_text', finalPrompt)
      formData.append('platforms', JSON.stringify(selected))
      formData.append('content_type', mode)
      formData.append('caption', promptForDay)

      if (referenceFile) {
        formData.append('reference_file', referenceFile, referenceFile.name)
      }

      const result = mode === 'image'
        ? await api.generateImage(formData)
        : await api.generateVideo(formData)

      const mediaUrl = mode === 'image'
        ? (result?.image_urls?.[0] || result?.job?.selected_url || '')
        : (result?.video_urls?.[0] || result?.job?.selected_url || '')

      if (!mediaUrl) {
        throw new Error('No media URL returned from the generator.')
      }

      setGeneratedMedia((current) => ({ ...current, [mode]: mediaUrl }))
      generateSinglePostCopy(index)
      setStatusMessage(`${mode === 'image' ? 'Image' : 'Video'} generated for day ${index + 1}.`)
      setStatusTone('success')
    } catch (error) {
      setStatusMessage(error.message || 'Could not generate the selected day media.')
      setStatusTone('error')
    } finally {
      setGenerating(false)
    }
  }

  const handleReferenceFileChange = (event) => {
    const file = event.target.files?.[0] || null

    if (referencePreview) {
      URL.revokeObjectURL(referencePreview)
    }

    setReferenceFile(file)
    setReferencePreview(file ? URL.createObjectURL(file) : '')
  }

  useEffect(() => {
    return () => {
      if (referencePreview) {
        URL.revokeObjectURL(referencePreview)
      }
    }
  }, [referencePreview])

  const generateAgentPrompt = () => {
    if (!activePlaybook && !reference && !selected.length) {
      setStatusMessage('Add a reference or brand context to generate an AI prompt.')
      setStatusTone('error')
      return
    }

    const selectedPromptText = prompts[0] || ''
    const generatedPrompt = promptBuilder({
      mode,
      reference,
      ratio,
      theme,
      platforms: selected,
      playbookInfo: activePlaybook,
      days: Number(days) || 1,
      promptText: selectedPromptText,
    })

    const sizeMap = {
      Small: 'Use a concise, punchy structure with a single clear message and minimal visual complexity.',
      Medium: 'Use a balanced, polished structure with clear storytelling and a strong but not overloaded CTA.',
      Large: 'Use a detailed, layered structure with rich visual storytelling, nuanced brand tone, and a stronger campaign narrative.',
    }

    const sizeVariants = ['Small', 'Medium', 'Large']
    const dayCount = Math.max(Number(days) || 1, 1)
    const selectedSizes = sizeVariants.includes(promptSize)
      ? Array.from({ length: dayCount }, () => promptSize)
      : Array.from({ length: dayCount }, (_, index) => sizeVariants[index % sizeVariants.length])

    const nextPrompts = Array.from({ length: dayCount }, (_, index) => {
      const size = selectedSizes[index] || 'Medium'
      const dayText = dayCount > 1 ? ` This is campaign day ${index + 1} in the series.` : ''
      return `${generatedPrompt} ${sizeMap[size] || ''}${dayText}`.replace(/\s+/g, ' ').trim()
    })

    const nextPostCopies = nextPrompts.map((prompt, index) => buildScheduledPostCopy({
      promptText: prompt,
      playbookInfo: activePlaybook,
      platforms: selected,
      reference: index === 0 ? reference : '',
      mode,
    }))

    setPrompts(nextPrompts)
    setPostCopies([])
    setCopyIndex(0)
    setStatusMessage('Prompt set generated. Create the image first, then captions and hashtags will be created for scheduling.')
    setStatusTone('success')
  }

  const handleGenerate = async () => {
    try {
      setGenerating(true)
      setStatusMessage('Generating content…')
      setStatusTone('neutral')

      const currentSchedule = scheduleEntries.slice(0, Number(days) || 1)
      const missingSchedule = currentSchedule.some((entry) => !entry.date || !entry.time)
      if (missingSchedule) {
        throw new Error('Please select a date and time for each scheduled day.')
      }

      const creativePrompt = prompts[0] || 'AI generated content'
      const brandInstructions = activePlaybookInstructions || activePlaybookGuidance
      const finalPrompt = promptBuilder({
        mode,
        reference: reference || creativePrompt,
        ratio,
        theme,
        platforms: selected,
        playbookInfo: activePlaybook,
        days: Number(days) || 1,
        promptText: creativePrompt,
      })
      const scheduledPostCopy = buildScheduledPostCopy({
        promptText: creativePrompt,
        playbookInfo: activePlaybook,
        platforms: selected,
        reference,
        mode,
      })

      const dayCopies = Array.from({ length: Number(days) || 1 }, (_, index) => {
        const promptForDay = prompts[index] || prompts[0] || creativePrompt
        return buildScheduledPostCopy({
          promptText: promptForDay,
          playbookInfo: activePlaybook,
          platforms: selected,
          reference: index === 0 ? reference : '',
          mode,
        })
      })

      setPostCopies(dayCopies)
      setCopyIndex(0)
      setStatusMessage('Image generated. Captions and hashtags are ready for scheduling.')
      const referenceText = reference || brandInstructions || creativePrompt
      const schedulePlan = currentSchedule.map((entry, index) => ({
        day: index + 1,
        date: entry.date,
        time: entry.time,
        scheduled_at: `${entry.date}T${entry.time}:00`,
      }))

      const activeCopy = postCopies[copyIndex] || postCopies[0] || scheduledPostCopy
      const payload = {
        title: `${mode === 'image' ? 'AI image' : 'AI video'} campaign`,
        description: activeCopy.description || scheduledPostCopy.description,
        prompt: finalPrompt,
        reference_text: referenceText,
        post_text: finalPrompt,
        aspect_ratio: ratio,
        platforms: selected,
        caption: activeCopy.description || scheduledPostCopy.description,
        hashtags: activeCopy.hashtags || scheduledPostCopy.hashtags,
        content_type: mode,
        schedule_plan: schedulePlan,
        schedule_details: schedulePlan,
        scheduled_at: schedulePlan[0]?.scheduled_at || null,
      }

      const formData = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
          return
        }
        formData.append(key, value)
      })

      if (referenceFile) {
        formData.append('reference_file', referenceFile, referenceFile.name)
        formData.append('reference_file_name', referenceFile.name)
        formData.append('reference_file_type', referenceFile.type)
      }

      let result = null
      let mediaUrl = ''

      try {
        result = mode === 'image'
          ? await api.generateImage(formData)
          : await api.generateVideo(formData)

        mediaUrl = mode === 'image'
          ? (result?.image_urls?.[0] || result?.job?.selected_url || '')
          : (result?.video_urls?.[0] || result?.job?.selected_url || '')
      } catch (backendError) {
        console.warn('Generation backend unavailable. Using fallback demo output.', backendError)
        mediaUrl = makeFallbackMedia({ mode, title: payload.title, prompt: finalPrompt })
      }

      if (mediaUrl) {
        setGeneratedMedia((current) => ({ ...current, [mode]: mediaUrl }))
      }

      try {
        if (mediaUrl) {
          await api.publish({
            title: payload.title,
            caption: payload.caption,
            media_url: mediaUrl,
            platforms: selected,
            content_type: mode,
            scheduled_at: payload.scheduled_at,
            schedule_plan: payload.schedule_plan,
            hashtags: payload.hashtags,
          })
        }
      } catch (publishError) {
        console.warn('Publish step unavailable. Continuing with demo content.', publishError)
      }

      setStatusMessage(`${mode === 'image' ? 'Image' : 'Video'} generated and queued for scheduling. Review the caption and hashtags before publishing.`)
      setStatusTone('success')
      refreshJobs()
      refreshStats()
    } catch (error) {
      setStatusMessage(error.message || 'Could not generate content. Check the backend and try again.')
      setStatusTone('error')
    } finally {
      setGenerating(false)
    }
  }

  const renderHome = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Pipeline" description="Current automation health">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">{backendStatus}</p>
              <p className="text-xs text-slate-500">API connection</p>
            </div>
            <Server className="h-8 w-8 text-violet-600" />
          </div>
        </Card>
        <Card title="Ready" description="Jobs ready to publish">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.ready || 0}</p>
              <p className="text-xs text-slate-500">Approved outputs</p>
            </div>
            <Eye className="h-8 w-8 text-emerald-600" />
          </div>
        </Card>
        <Card title="Scheduled" description="Upcoming social posts">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.scheduled || 0}</p>
              <p className="text-xs text-slate-500">Queued content</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card title="Recent activity" description="Latest campaigns and content jobs">
          <div className="space-y-3">
            {jobs.slice(0, 4).map((job) => (
              <div key={job.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div>
                  <p className="font-medium text-slate-900">{job.title || 'Campaign job'}</p>
                  <p className="text-xs text-slate-500">{job.content_kind || 'video'} • {job.status || 'processing'}</p>
                </div>
                <span className="rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">{job.status}</span>
              </div>
            ))}
            {!jobs.length && <p className="text-sm text-slate-500">No jobs yet. Run a generation to populate activity.</p>}
          </div>
        </Card>

        <Card title="Quick actions" description="Jump back into the workflow">
          <div className="space-y-3">
            <button type="button" onClick={() => setActiveView('Create Content')} className="flex w-full items-center justify-between rounded-xl border border-violet-200 bg-violet-50 px-3 py-2.5 text-sm font-medium text-violet-700">
              Create content <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setActiveView('Brand Playbook')} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
              Update brand playbook <ArrowRight className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => setActiveView('Settings')} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">
              Review API settings <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderHistory = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">History</h2>
          <p className="text-sm text-slate-500">Track the latest generated assets and scheduled campaigns.</p>
        </div>
        <button type="button" onClick={refreshJobs} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">Refresh</button>
      </div>

      <div className="grid gap-4">
        {jobs.length ? jobs.map((job) => (
          <Card key={job.id} title={job.title || 'Content job'} description={new Date(job.created_at || Date.now()).toLocaleString()}>
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-2 py-1">{job.content_kind || 'video'}</span>
              <span className="rounded-full bg-violet-100 px-2 py-1 text-violet-700">{job.status || 'processing'}</span>
              <span>{job.target_platforms?.join(', ') || 'Instagram'}</span>
            </div>
            {job.selected_url && <img src={job.selected_url} alt={job.title} className="mt-3 h-40 w-full rounded-xl object-cover" />}
          </Card>
        )) : (
          <Card title="No history yet" description="Your platform activity will appear here after generation." />
        )}
      </div>
    </div>
  )

  const renderTemplates = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Templates</h2>
        <p className="text-sm text-slate-500">Reusable content blocks to speed up production.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {templateIdeas.map((item) => (
          <Card key={item.title} title={item.title} description={item.type}>
            <p className="text-sm text-slate-600">{item.description}</p>
            <button type="button" onClick={() => setActiveView('Create Content')} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2 text-sm font-medium text-white">
              Use template <ArrowRight className="h-4 w-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      </div>
    </div>
  )

  const renderScheduling = () => (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">Scheduling</p>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">{mode === 'image' ? 'Image Schedule & Publish' : 'Video Schedule & Publish'}</h1>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('Create Content')}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)]"
        >
          Back to create
        </button>
      </div>

      <Card title="Schedule & Publish" className="space-y-5">
        <div className="space-y-5">
          <Field label="Select Social Media Platforms" hint="Choose where you want to post your content.">
            <div className="grid grid-cols-3 gap-2.5">
              {platforms.map((platform) => {
                const enabled = selected.includes(platform)
                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`rounded-xl border px-2 py-3 text-xs font-semibold transition-all ${
                      enabled
                        ? 'border-[var(--color-primary)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)] shadow-[var(--shadow-soft)]'
                        : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]/40'
                    }`}
                  >
                    {platform}
                  </button>
                )
              })}
            </div>
          </Field>

          <Field label="Schedule For Each Day" hint="Select the exact date and time for every post.">
            <div className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
              {scheduleEntries.map((entry, index) => (
                <div key={`schedule-${index}`} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-[var(--color-foreground)]">Day {index + 1}</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
                        Select Date
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2">
                        <Calendar className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                        <input
                          type="date"
                          value={entry.date || ''}
                          onChange={(event) => handleScheduleChange(index, 'date', event.target.value)}
                          className="flex-1 bg-transparent text-sm text-[var(--color-foreground)] outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
                        Select Time
                      </label>
                      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2">
                        <Clock className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                        <input
                          type="time"
                          value={entry.time || '10:00'}
                          onChange={(event) => handleScheduleChange(index, 'time', event.target.value)}
                          className="flex-1 bg-transparent text-sm text-[var(--color-foreground)] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Field>

          <button
            type="button"
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90 disabled:opacity-70"
          >
            {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {generating ? 'Generating…' : `Generate & Schedule ${mode === 'image' ? 'Image' : 'Video'}`}
          </button>

          {statusMessage && (
            <p className={`flex items-start gap-1.5 text-xs ${statusTone === 'error' ? 'text-red-600' : statusTone === 'success' ? 'text-emerald-600' : 'text-[var(--color-muted-foreground)]'}`}>
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {statusMessage}
            </p>
          )}

          <p className="flex items-start gap-1.5 text-xs text-[var(--color-muted-foreground)]">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            You can review and edit the content before it gets scheduled.
          </p>
        </div>
      </Card>
    </div>
  )

  const renderCreateContent = () => (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">Create Image &amp; Video Content</h1>
          <p className="mt-1.5 text-sm text-[var(--color-muted-foreground)]">
            Generate AI-powered images and videos in one place, then schedule them to your social channels.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-1 shadow-[var(--shadow-card)]">
            {['image', 'video'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMode(item)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold capitalize transition-colors ${
                  mode === item
                    ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-[var(--shadow-soft)]'
                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`}
              >
                {item === 'image' ? <ImageIcon className="h-4 w-4" /> : <VideoIcon className="h-4 w-4" />}
                {item}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleScheduleNavigation}
            disabled={!canScheduleContent}
            className={`inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-semibold shadow-[var(--shadow-soft)] transition-opacity ${
              canScheduleContent
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90'
                : 'cursor-not-allowed border-[var(--color-border)] bg-[var(--color-muted)] text-[var(--color-muted-foreground)]'
            }`}
          >
            {canScheduleContent ? `Schedule this ${mode}` : 'Generate captions first'}
          </button>
        </div>
      </div>

      <div className="mb-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-[var(--shadow-card)]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-muted-foreground)]">Brand playbook</p>
            <h2 className="mt-1 text-lg font-bold text-[var(--color-foreground)]">Select the playbook for this campaign</h2>
          </div>
          <select
            value={playbook}
            onChange={(event) => setPlaybook(event.target.value)}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-foreground)] outline-none ring-0"
          >
            {playbooks.map((entry) => (
              <option key={entry.name} value={entry.name}>{entry.name}</option>
            ))}
          </select>
        </div>
        {activePlaybookGuidance && (
          <p className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-800">
            Active brand guidance: {activePlaybookGuidance}
          </p>
        )}
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.68fr]">
        <Card title="Content Settings" description="Configure how your content should look." className="space-y-5">
          <div className="space-y-5">
            <Field label="Number of Days" hint="How many days of content to generate?">
              <select className="field" value={days} onChange={(event) => setDays(event.target.value)}>
                {[1, 3, 5, 7].map((day) => (
                  <option key={day} value={day}>
                    {day} {day === 1 ? 'Day' : 'Days'}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Aspect Ratio" hint="Select the size for your content.">
              <OptionGrid
                columns={3}
                value={ratio}
                onChange={setRatio}
                options={[
                  { value: '1:1', label: '1:1', sub: '1080×1080' },
                  { value: '9:16', label: '9:16', sub: '1080×1920' },
                  { value: '16:9', label: '16:9', sub: '1920×1080' },
                ]}
              />
            </Field>

            {mode === 'video' && (
              <Field label="Resolution" hint="Choose the video quality.">
                <OptionGrid
                  columns={2}
                  value={resolution}
                  onChange={setResolution}
                  options={[
                    { value: '480p', label: '480p', sub: '768 × 480' },
                    { value: '720p', label: '720p', sub: '1280 × 720' },
                    { value: '1080p', label: '1080p', sub: '1920 × 1080' },
                    { value: '4K', label: '4K', sub: '3840 × 2160' },
                  ]}
                />
              </Field>
            )}

            <Field label="Color Theme" hint="Choose a color style for your content.">
              <div className="flex flex-wrap gap-3">
                {colorThemes.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    aria-label={color.name}
                    onClick={() => setTheme(color.name)}
                    className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-[var(--color-card)] transition-all ${
                      theme === color.name ? 'ring-2 ring-[var(--color-primary)]' : ''
                    }`}
                    style={{ backgroundColor: color.css }}
                  />
                ))}
              </div>
            </Field>

            <Field label="Reference Text / Prompt" hint="Add a short brief for the style or message.">
              <textarea
                className="field min-h-[80px] resize-none"
                maxLength={200}
                placeholder="e.g. Stay healthy, live better"
                value={reference}
                onChange={(event) => setReference(event.target.value)}
              />
              <p className="text-right text-xs text-[var(--color-muted-foreground)]">{reference.length}/200</p>
            </Field>

            <Field
              label={mode === 'image' ? 'Reference Image' : 'Reference Video'}
              hint={mode === 'image' ? 'Small image reference for style matching.' : 'Small video reference for motion direction.'}
            >
              <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/40 px-3 py-4 text-center transition-colors hover:border-[var(--color-primary)]/50">
                <Upload className="h-4 w-4 text-[var(--color-primary)]" />
                <span className="text-xs font-medium">
                  Upload {mode === 'image' ? 'image' : 'video'}
                </span>
                <input
                  type="file"
                  accept={mode === 'image' ? 'image/*' : 'video/*'}
                  className="hidden"
                  onChange={handleReferenceFileChange}
                />
                {referencePreview && (
                  <img
                    src={referencePreview}
                    alt="Reference preview"
                    className="mt-2 h-12 w-12 rounded-lg border border-[var(--color-border)] object-cover"
                  />
                )}
              </label>

              {referenceFile && (
                <p className="mt-2 truncate text-[11px] font-medium text-[var(--color-primary)]">
                  {referenceFile.name}
                </p>
              )}

              <Field label="Prompt Size" hint="Choose the version you want to generate.">
                <div className="flex gap-2">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setPromptSize(size)}
                      className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                        promptSize === size
                          ? 'border-[var(--color-primary)] bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </Field>

              <button
                type="button"
                onClick={generateAgentPrompt}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                Generate Prompt
              </button>
            </Field>
          </div>
        </Card>

        <div className="space-y-5 xl:pt-1">
          <Card title={`${mode === 'image' ? 'Image' : 'Video'} Prompts for AI Generation`} description={`Add prompts for the ${mode} generation (per day).`} className="min-h-[320px]">
            <div className="space-y-2.5">
              {prompts.map((prompt, index) => (
                <div key={index} className="flex items-start gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2">
                  <span className="mt-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-muted)] text-xs font-semibold text-[var(--color-muted-foreground)]">
                    {index + 1}
                  </span>
                  <textarea
                    value={prompt}
                    onChange={(event) => updatePrompt(index, event.target.value)}
                    placeholder="Describe what you want to generate…"
                    rows={3}
                    className="min-w-0 flex-1 resize-y bg-transparent text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted-foreground)]"
                  />
                  <div className="mt-1 flex flex-col gap-1">
                    <button type="button" onClick={() => generateSinglePromptMedia(index)} className="rounded-md bg-[var(--color-primary)] px-2 py-1.5 text-[10px] font-semibold text-[var(--color-primary-foreground)]" aria-label={`Generate media for day ${index + 1}`}>
                      Generate
                    </button>
                    <button type="button" onClick={() => removePrompt(index)} className="rounded-md p-1 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]" aria-label="Remove prompt">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addPrompt} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-2.5 text-sm font-semibold text-[var(--color-primary)] hover:bg-[var(--color-accent)]">
                <Plus className="h-4 w-4" /> Add another prompt
              </button>
            </div>
          </Card>

          <Card title="Preview" description="A live preview of the generated content." className="min-h-[320px]">
            {mode === 'image' ? (
              <div className="space-y-3">
                {generatedMedia.image ? (
                  <img src={generatedMedia.image} alt="Generated content preview" className="aspect-square w-full rounded-xl object-cover" />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {['Work Smarter', 'Better Together'].map((text) => (
                      <div key={text} className="relative flex aspect-square items-end overflow-hidden rounded-xl p-4" style={{ background: 'linear-gradient(150deg, oklch(0.45 0.13 262), oklch(0.28 0.06 265))' }}>
                        <span className="absolute left-3 top-3 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">Image</span>
                        <p className="text-lg font-bold leading-tight text-white">{text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {generatedMedia.video ? (
                  <video src={generatedMedia.video} controls className="aspect-video w-full rounded-xl object-cover" />
                ) : (
                  <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl" style={{ background: 'linear-gradient(150deg, oklch(0.4 0.1 262), oklch(0.24 0.05 265))' }}>
                    <span className="absolute left-3 top-3 rounded-md bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">Video · {resolution} · {ratio}</span>
                    <button type="button" className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary)]">
                      <Play className="h-6 w-6" />
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-0.5 text-[11px] text-white">0:05</span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-[var(--shadow-soft)] hover:opacity-90">
                    <RefreshCw className="h-4 w-4" /> Regenerate Video
                  </button>
                  <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-muted)]">
                    <Download className="h-4 w-4" /> Download
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
                Preview copy
              </p>
              <button
                type="button"
                onClick={() => { generateSinglePostCopy(copyIndex || 0); setActiveView('Scheduling'); }}
                className="rounded-xl border border-[var(--color-primary)] bg-[var(--color-primary)] px-3 py-1.5 text-[10px] font-semibold text-[var(--color-primary-foreground)]"
              >
                Generate captions & hashtags
              </button>
            </div>

            {postCopies.length > 0 && (
              <div className="mt-4 space-y-3">
                {postCopies.map((copy, index) => {
                  const hashtags = (copy.hashtags || '').split(/\s+/).filter(Boolean)

                  return (
                    <div
                      key={`post-copy-${index}`}
                      className={`rounded-xl border p-3 transition-colors ${
                        copyIndex === index
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)]'
                          : 'border-[var(--color-border)] bg-[var(--color-card)]'
                      }`}
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
                          Day {index + 1} caption
                        </p>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => generateSinglePostCopy(index)}
                            className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-1 text-[10px] font-semibold text-[var(--color-foreground)]"
                          >
                            Generate copy
                          </button>
                          <button
                            type="button"
                            onClick={() => setCopyIndex(index)}
                            className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                              copyIndex === index
                                ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
                                : 'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted-foreground)]'
                            }`}
                          >
                            Active
                          </button>
                        </div>
                      </div>
                      <textarea
                        value={copy.description || ''}
                        onChange={(event) => {
                          setCopyIndex(index)
                          updatePostCopy('description', event.target.value)
                        }}
                        rows={4}
                        className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm leading-6 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
                      />

                      <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-muted-foreground)]">
                          Day {index + 1} hashtags
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {hashtags.length ? (
                            hashtags.map((tag, tagIndex) => (
                              <button
                                key={`${tag}-${tagIndex}`}
                                type="button"
                                onClick={() => {
                                  setCopyIndex(index)
                                  if ((copy.description || '').trim() && (copy.hashtags || '').trim()) {
                                    setActiveView('Scheduling')
                                  }
                                }}
                                className="rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1 text-[10px] font-semibold text-[var(--color-primary)] transition hover:border-[var(--color-primary)]"
                              >
                                {tag}
                              </button>
                            ))
                          ) : (
                            <textarea
                              value={copy.hashtags || ''}
                              onChange={(event) => {
                                setCopyIndex(index)
                                updatePostCopy('hashtags', event.target.value)
                              }}
                              rows={2}
                              className="mt-1 w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-2 text-xs leading-5 text-[var(--color-foreground)] outline-none focus:border-[var(--color-primary)]"
                            />
                          )}
                        </div>
                        {hashtags.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setCopyIndex(index)
                              if ((copy.description || '').trim() && (copy.hashtags || '').trim()) {
                                setActiveView('Scheduling')
                              }
                            }}
                            className="mt-2 inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--color-foreground)]"
                          >
                            Select hashtags to schedule
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <p className="mt-3 flex items-start gap-1.5 text-xs text-[var(--color-muted-foreground)]">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              This preview updates after you generate content.
            </p>
          </Card>
        </div>

      </div>
    </>
  )

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_oklch(0.63_0.25_262),_oklch(0.24_0.045_265)_55%,_oklch(0.1_0.02_260))] px-4 py-10 text-white">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl font-bold text-white">
              N
            </div>
            <h1 className="text-3xl font-bold">NovaCreate</h1>
            <p className="mt-2 text-sm text-violet-100/80">Sign in to your content studio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-violet-50">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                placeholder="Enter your username"
                className="field border-white/15 bg-white/5 text-white placeholder:text-violet-100/60"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-violet-50">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Enter your password"
                className="field border-white/15 bg-white/5 text-white placeholder:text-violet-100/60"
              />
            </div>

            {loginError && (
              <p className="rounded-xl border border-red-300/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white px-4 py-3 text-sm font-semibold text-violet-800 shadow-lg transition-opacity hover:opacity-90"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onLogout={handleLogout} />

        <main className="flex-1 space-y-6 px-5 py-6 lg:px-8">
          {activeView === 'Create Content' && renderCreateContent()}
          {activeView === 'Scheduling' && renderScheduling()}
          {activeView === 'Brand Playbook' && <BrandPlaybook onPlaybooksChange={handlePlaybooksChange} />}
          {!['Create Content', 'Scheduling', 'Brand Playbook'].includes(activeView) && renderCreateContent()}
        </main>
      </div>
    </div>
  )
}
