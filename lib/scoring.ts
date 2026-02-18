export type Traits = {
  creative_drive: number
  execution_capacity: number
  rumination_index: number
  external_validation: number
  autonomy_orientation: number
  action_orientation: number
}

type RawAnswers = Record<number, string>

const SCORING_MAP: Record<number, Record<string, Partial<Traits>>> = {
  1: {
    a: { creative_drive: 2, autonomy_orientation: 1 },
    b: { creative_drive: 1, autonomy_orientation: 1 },
    c: { creative_drive: 0, autonomy_orientation: 0 },
    d: { external_validation: 2, autonomy_orientation: -1 },
  },
  2: {
    a: { rumination_index: 2, external_validation: 2 },
    b: { rumination_index: 1 },
    c: { rumination_index: 1 },
    d: { rumination_index: 1 },
  },
  3: {
    a: { autonomy_orientation: 2, rumination_index: -1 },
    b: { autonomy_orientation: -1, rumination_index: 1 },
    c: { autonomy_orientation: 1 },
    d: { autonomy_orientation: -2, rumination_index: 2 },
  },
  4: {
    a: { execution_capacity: 2 },
    b: { execution_capacity: -1, rumination_index: 1 },
    c: {},
    d: { execution_capacity: -2, rumination_index: 2 },
  },
  5: {
    a: { creative_drive: 2, autonomy_orientation: 2 },
    b: { creative_drive: 1, autonomy_orientation: 1 },
    c: {},
    d: { creative_drive: -1, autonomy_orientation: 1 },
  },
  6: {
    a: { rumination_index: 2, execution_capacity: -1 },
    b: { rumination_index: -1, execution_capacity: 2 },
    c: { rumination_index: 1 },
    d: { execution_capacity: -1 },
  },
  7: {
    a: { external_validation: 1, autonomy_orientation: -1 },
    b: {},
    c: { external_validation: 2, autonomy_orientation: -1 },
    d: { external_validation: -1, autonomy_orientation: 2 },
  },
  8: {
    a: { autonomy_orientation: -2, execution_capacity: -1 },
    b: { autonomy_orientation: -1 },
    c: { autonomy_orientation: 1, execution_capacity: -1 },
    d: { autonomy_orientation: 2, execution_capacity: 2 },
  },
  9: {
    a: { action_orientation: 2, rumination_index: -1 },
    b: { action_orientation: -1, rumination_index: 1 },
    c: { action_orientation: -2, rumination_index: 2 },
    d: { action_orientation: -2, rumination_index: 1 },
  },
  10: {
    a: { autonomy_orientation: 2, rumination_index: -1 },
    b: { rumination_index: 2, external_validation: 1 },
    c: { rumination_index: 1, autonomy_orientation: -2 },
    d: { external_validation: 2, rumination_index: 1 },
  },
  11: {
    a: { execution_capacity: 2, rumination_index: -1 },
    b: { rumination_index: 2, action_orientation: -1 },
    c: { rumination_index: 1, execution_capacity: -1 },
    d: { action_orientation: 1, execution_capacity: -1 },
  },
  12: {
    a: { autonomy_orientation: 2, external_validation: -1 },
    b: { external_validation: 2, autonomy_orientation: -1 },
    c: { external_validation: 1 },
    d: { external_validation: 2, rumination_index: 1 },
  },
}

const MAX_SCORES: Traits = {
  creative_drive: 6,
  execution_capacity: 7,
  rumination_index: 14,
  external_validation: 10,
  autonomy_orientation: 12,
  action_orientation: 4,
}

export function calculateScores(answers: RawAnswers): Traits {
  const raw: Traits = {
    creative_drive: 0,
    execution_capacity: 0,
    rumination_index: 0,
    external_validation: 0,
    autonomy_orientation: 0,
    action_orientation: 0,
  }

  for (const [qId, answer] of Object.entries(answers)) {
    const questionScores = SCORING_MAP[Number(qId)]
    if (!questionScores) continue
    const optionScores = questionScores[answer]
    if (!optionScores) continue
    for (const [trait, value] of Object.entries(optionScores)) {
      raw[trait as keyof Traits] += value as number
    }
  }

  const normalized: Traits = {} as Traits
  for (const trait of Object.keys(raw) as (keyof Traits)[]) {
    const max = MAX_SCORES[trait]
    const clamped = Math.max(-max, Math.min(max, raw[trait]))
    normalized[trait] = Math.round(((clamped + max) / (2 * max)) * 100)
  }

  return normalized
}

export const TRAIT_LABELS: Record<keyof Traits, string> = {
  creative_drive: "Creative Drive",
  execution_capacity: "Execution Capacity",
  rumination_index: "Rumination Index",
  external_validation: "External Validation Dependence",
  autonomy_orientation: "Autonomy Orientation",
  action_orientation: "Action Orientation",
}

export const ANSWER_LABELS: Record<number, Record<string, string>> = {
  1: { a: "Creating something new", b: "Solving a complex problem", c: "Helping others grow", d: "Being recognised for my work" },
  2: { a: "Fear of judgment", b: "Too many options", c: "Lack of clarity on what I want", d: "Financial uncertainty" },
  3: { a: "What I'm passionate about", b: "Paying the bills", c: "Building skills for future goals", d: "A complete mismatch" },
  4: { a: "Work harder to fix it", b: "Shut down and disconnect", c: "Talk it out with someone", d: "Overthink until paralyzed" },
  5: { a: "Building my own thing", b: "Mastering a craft", c: "Living a balanced life", d: "Still figuring it out" },
  6: { a: "I'm not good enough", b: "I'll try a different approach", c: "It wasn't meant to be", d: "Something else is to blame" },
  7: { a: "A stable job", b: "Financial independence", c: "Making your family proud", d: "Finding your passion" },
  8: { a: "Completely lost", b: "Some ideas, no real clarity", c: "Clear direction, lacking execution", d: "Clear and actively acting on it" },
  9: { a: "Act on it immediately", b: "Research for weeks before starting", c: "Talk about it but never start", d: "Dismiss it as unrealistic" },
  10: { a: "Excitement — I can see it clearly", b: "Anxiety — what if I don't make it", c: "Numbness — I've stopped imagining", d: "Guilt — I should be further along by now" },
  11: { a: "Feels energized and ready", b: "Tightens up — chest, shoulders, jaw", c: "Goes numb, you just disconnect", d: "Sends you to your phone or food first" },
  12: { a: "Barely — I move on my own signal", b: "A lot — I need validation before I act", c: "Depends who it is — some views matter more", d: "I pretend they don't, but they do" },
}