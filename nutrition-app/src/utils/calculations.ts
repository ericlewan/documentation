import { DailySetupInput, DailyTargets, DayType } from '@/types'

/**
 * Weight range definitions for sliding deficit calculation
 * As you lose weight, the deficit decreases to preserve muscle mass
 */
const WEIGHT_RANGES = [
  { min: 90, max: Infinity, deficit: 750 }, // 90-100+ kg
  { min: 80, max: 90, deficit: 650 },       // 80-90 kg
  { min: 70, max: 80, deficit: 550 },       // 70-80 kg
  { min: 0, max: 70, deficit: 450 },        // Below 70 kg
]

/**
 * Activity constants
 */
const ACTIVITY_BASE = 600  // Base activity calories
const NEAT = 300          // Non-exercise activity thermogenesis

/**
 * Banking modifiers for weekly calorie cycling
 */
const BANKING_WEEKDAY = -100  // Mon-Thu
const BANKING_WEEKEND = 133   // Fri-Sun

/**
 * Fixed user parameters (can be made dynamic later)
 */
const USER_HEIGHT_CM = 172
const USER_AGE_YEARS = 27

/**
 * Calculate BMR using the Mifflin-St Jeor Equation
 * BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
 *
 * @param weight - Current weight in kg
 * @param height - Height in cm (default: 172)
 * @param age - Age in years (default: 27)
 * @returns BMR in calories
 */
export function calculateBMR(
  weight: number,
  height: number = 172,
  age: number = 27
): number {
  return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5)
}

/**
 * Get deficit based on current weight using sliding scale
 * Sliding deficit ensures we preserve muscle mass as weight decreases
 *
 * @param weight - Current weight in kg
 * @returns Deficit in calories
 */
export function getDeficitForWeight(weight: number): number {
  const range = WEIGHT_RANGES.find(r => weight >= r.min && weight < r.max)
  return range?.deficit || 450 // Default to smallest deficit if not found
}

/**
 * Calculate Apple Watch activity modifier
 * Formula: (Move calories - 600) ÷ 2
 *
 * @param moveCalories - Move calories from Apple Watch
 * @returns Modifier in calories
 */
export function calculateAppleWatchModifier(moveCalories: number): number {
  return Math.round((moveCalories - 600) / 2)
}

/**
 * Calculate weekend banking modifier
 * Mon-Thu: -100 calories
 * Fri-Sun: +133 calories
 *
 * @param isWeekend - Whether it's a weekend day
 * @returns Modifier in calories
 */
export function calculateWeekendModifier(isWeekend: boolean): number {
  return isWeekend ? 133 : -100
}

/**
 * Calculate training day bonus based on activity type
 *
 * @param dayType - Type of training day
 * @returns Bonus calories to add to daily target
 */
export function calculateDayTypeBonus(dayType: DayType): number {
  switch (dayType) {
    case 'training':
      return 250  // Full training day
    case 'active_recovery':
      return 100  // Light activity day
    case 'rest':
      return 0    // Complete rest day
    default:
      return 0
  }
}

/**
 * Calculate daily calorie target with all modifiers
 *
 * This is the brain of the system - calculates personalized daily nutrition targets
 * based on current weight, activity level, and training status.
 *
 * @param input - Daily setup input data
 * @param height - User's height in cm (default: 172)
 * @param age - User's age in years (default: 27)
 * @returns Complete daily targets including calories and macros with breakdown
 */
export function calculateDailyTargets(
  input: DailySetupInput,
  height: number = USER_HEIGHT_CM,
  age: number = USER_AGE_YEARS
): {
  bmr: number
  activityBase: number
  deficit: number
  appleWatchModifier: number
  weekendModifier: number
  dayTypeBonus: number
  baseTarget: number
  targets: DailyTargets
} {
  // Step 1: Calculate BMR (Basal Metabolic Rate)
  const bmr = calculateBMR(input.weight, height, age)

  // Step 2: Activity base (600 + 300 NEAT)
  const activityBase = ACTIVITY_BASE + NEAT

  // Step 3: Sliding deficit based on current weight
  const deficit = getDeficitForWeight(input.weight)

  // Step 4: Calculate base target before modifiers
  const baseTarget = bmr + activityBase - deficit

  // Step 5: Calculate all modifiers
  const appleWatchModifier = calculateAppleWatchModifier(input.activityCalories)
  const weekendModifier = calculateWeekendModifier(input.isWeekend)
  const dayTypeBonus = calculateDayTypeBonus(input.dayType)

  // Step 6: Calculate final daily calorie target
  const targetCalories = Math.round(
    baseTarget +
    appleWatchModifier +
    weekendModifier +
    dayTypeBonus
  )

  // Step 7: Calculate macro targets
  // Protein: 1.5g per kg body weight (optimal for muscle preservation)
  const targetProtein = Math.round(input.weight * 1.5)

  // Fat: 27.5% of total calories (middle of 25-30% range)
  const fatCalories = Math.round(targetCalories * 0.275)
  const targetFat = Math.round(fatCalories / 9)

  // Carbs: remaining calories (4 cal per gram)
  const proteinCalories = targetProtein * 4
  const remainingCalories = targetCalories - proteinCalories - fatCalories
  const targetCarbs = Math.max(0, Math.round(remainingCalories / 4))

  return {
    bmr,
    activityBase,
    deficit,
    appleWatchModifier,
    weekendModifier,
    dayTypeBonus,
    baseTarget,
    targets: {
      calories: targetCalories,
      protein: targetProtein,
      carbs: targetCarbs,
      fat: targetFat,
    },
  }
}

/**
 * Calculate progress towards daily targets
 *
 * @param consumed - Consumed nutrition values
 * @param targets - Target nutrition values
 * @returns Progress including remaining amounts and percentages
 */
export function calculateProgress(
  consumed: { calories: number; protein: number; carbs: number; fat: number },
  targets: DailyTargets
) {
  return {
    consumed,
    targets,
    remaining: {
      calories: targets.calories - consumed.calories,
      protein: targets.protein - consumed.protein,
      carbs: targets.carbs - consumed.carbs,
      fat: targets.fat - consumed.fat,
    },
    percentages: {
      calories: Math.round((consumed.calories / targets.calories) * 100),
      protein: Math.round((consumed.protein / targets.protein) * 100),
      carbs: Math.round((consumed.carbs / targets.carbs) * 100),
      fat: Math.round((consumed.fat / targets.fat) * 100),
    },
  }
}

/**
 * Generate encouraging message based on progress
 *
 * @param percentage - Progress percentage (0-100+)
 * @param macroName - Name of the macro (calories, protein, carbs, fat)
 * @returns Encouraging message
 */
export function getEncouragingMessage(
  percentage: number,
  macroName: string
): string {
  if (percentage < 25) {
    return `Great start! You've got plenty of ${macroName} budget left for the day.`
  } else if (percentage < 50) {
    return `You're doing well! About halfway through your ${macroName} target.`
  } else if (percentage < 75) {
    return `Nice work! Over halfway there on your ${macroName}.`
  } else if (percentage < 90) {
    return `Almost there! You're making excellent progress on ${macroName}.`
  } else if (percentage < 100) {
    return `So close! Just a bit more room for ${macroName} today.`
  } else if (percentage === 100) {
    return `Perfect! You've hit your ${macroName} target exactly. 🎯`
  } else {
    return `You've exceeded your ${macroName} target. That's okay - tomorrow is a new day!`
  }
}

/**
 * Format calculation breakdown for display
 * Useful for showing users how their daily targets were calculated
 *
 * @param calculation - Result from calculateDailyTargets
 * @param input - Original input data
 * @returns Formatted string showing the calculation breakdown
 */
export function formatCalculationBreakdown(
  calculation: ReturnType<typeof calculateDailyTargets>,
  input: DailySetupInput
): string {
  const lines = [
    '=== DAILY TARGET CALCULATION ===',
    '',
    '📊 Input:',
    `  Weight: ${input.weight} kg`,
    `  Apple Watch Move: ${input.activityCalories} cal`,
    `  Day Type: ${input.dayType}`,
    `  Weekend: ${input.isWeekend ? 'Yes (Fri-Sun)' : 'No (Mon-Thu)'}`,
    '',
    '🔥 Base Calculations:',
    `  BMR (Basal Metabolic Rate): ${calculation.bmr} cal`,
    `  Activity Base (600 + 300 NEAT): ${calculation.activityBase} cal`,
    `  Sliding Deficit: -${calculation.deficit} cal`,
    `  ────────────────────────────────`,
    `  Base Target: ${calculation.baseTarget} cal`,
    '',
    '⚡ Modifiers:',
    `  Apple Watch: ${calculation.appleWatchModifier >= 0 ? '+' : ''}${calculation.appleWatchModifier} cal`,
    `  Banking: ${calculation.weekendModifier >= 0 ? '+' : ''}${calculation.weekendModifier} cal`,
    `  Day Type Bonus: ${calculation.dayTypeBonus >= 0 ? '+' : ''}${calculation.dayTypeBonus} cal`,
    '',
    '🎯 Final Targets:',
    `  Calories: ${calculation.targets.calories} cal`,
    `  Protein: ${calculation.targets.protein}g (${input.weight} kg × 1.5g)`,
    `  Fat: ${calculation.targets.fat}g (27.5% of calories)`,
    `  Carbs: ${calculation.targets.carbs}g (remaining calories)`,
    '',
    '================================',
  ]

  return lines.join('\n')
}
