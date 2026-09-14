export const imageOptions = [
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=85',
]

export const videoOptions = [
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  'https://www.w3schools.com/html/mov_bbb.mp4',
]

export const copyForDay = (day, length = 'small') => {
  const content = {
    small: [
      'Make the work feel calmer and more focused. The right systems clear away manual noise. Give your team room for the next meaningful step. #WorkflowAutomation #Productivity #BetterWork',
      'The best systems carry the repetitive work. Your team keeps its focus for decisions that matter. Progress becomes easier to sustain. #DigitalTransformation #TeamWork #FutureReady',
    ],
    medium: [
      'Make the work feel calmer and more focused. The right systems clear away manual noise before it slows the team down. That creates room for better decisions, clearer priorities, and real momentum. Build an operating rhythm that supports growth every day. #WorkflowAutomation #Productivity #BetterWork #DigitalTransformation',
      'The best systems carry the repetitive work so people can stay close to the important work. A strong foundation turns complex processes into a steady rhythm. Teams move faster when their attention is protected. Build for the work you want to do next. #TeamWork #Automation #FutureReady #Operations',
    ],
    large: [
      'Make the work feel calmer and more focused. The right systems clear away manual noise before it slows the team down. That gives every person more space for better decisions and stronger collaboration. A thoughtful workflow makes progress visible. It helps teams keep momentum when priorities shift. Build an operating rhythm that supports growth without adding complexity. The future of work should feel more human, not more crowded. #WorkflowAutomation #Productivity #BetterWork #DigitalTransformation #TeamCulture',
      'The best systems carry repetitive work so people can stay close to the decisions that matter. A reliable foundation turns complex processes into a steady rhythm. Teams move faster when their attention is protected. Good automation is not about removing people from the picture. It is about giving them room to think, create, and respond. Build for the work you want to do next. Make every process serve the people behind it. #TeamWork #Automation #FutureReady #Operations #MeaningfulWork',
    ],
  }

  return [
    { title: `A clearer way to build, day ${day}`, text: content[length][0] },
    { title: `Progress without the extra noise, day ${day}`, text: content[length][1] },
  ]
}

export const promptsForDay = (day) => [
  `Editorial workspace, warm morning light, thoughtful team planning day ${day}, clean composition, forest green detail.`,
  `Minimal digital systems in motion, quiet confidence, soft natural texture, focused progress for day ${day}.`,
]

export const dayDate = (day) => {
  const date = new Date()
  date.setDate(date.getDate() + day - 1)
  return date.toISOString().slice(0, 10)
}
