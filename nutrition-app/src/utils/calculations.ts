import { DailySetupInput, DailyTargets } from '@/types'

/**
 * Weight range definitions for deficit calculation
 */
const WEIGHT_RANGES = [
  { min: 90, max: 100, deficit: 750 },
  { min: 80, max: 90, deficit: 650 },
  { min: 70, max: 80, deficit: 550 },
  { min: 60, max: 70, deficit: 450 },
  { min: 0, max: 60, deficit: 350 },
]

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
 * Get deficit based on current weight
 *
 * @param weight - Current weight in kg
 * @returns Deficit in calories
 */
export function getDeficitForWeight(weight: number): number {
  const range = WEIGHT_RANGES.find(r => weight >= r.min && weight < r.max)
  return range?.deficit || 350 // Default to smallest deficit if not found
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
 * Calculate training day bonus
 *
 * @param isTrainingDay - Whether it's a training day
 * @returns Bonus in calories
 */
export function calculateTrainingBonus(isTrainingDay: boolean): number {
  return isTrainingDay ? 250 : 0
}

/**
 * Calculate daily calorie target with all modifiers
 *
 * @param input - Daily setup input data
 * @param height - User's height in cm
 * @param age - User's age in years
 * @returns Complete daily targets including calories and macros
 */
export function calculateDailyTargets(
  input: DailySetupInput,
  height: number = 172,
  age: number = 27
): {
  bmr: number
  activityBase: number
  appleWatchModifier: number
  weekendModifier: number
  trainingBonus: number
  targets: DailyTargets
} {
  // Base calculations
  const bmr = calculateBMR(input.weight, height, age)
  const activityBase = 600 + 300 // Activity base (600) + NEAT (300)
  const deficit = getDeficitForWeight(input.weight)

  // Modifiers
  const appleWatchModifier = calculateAppleWatchModifier(input.activityCalories)
  const weekendModifier = calculateWeekendModifier(input.isWeekend)
  const trainingBonus = calculateTrainingBonus(input.isTrainingDay)

  // Total daily calories
  const targetCalories = Math.round(
    bmr +
    activityBase -
    deficit +
    appleWatchModifier +
    weekendModifier +
    trainingBonus
  )

  // Macro targets (approximate split)
  // Protein: 2g per kg body weight
  const targetProtein = Math.round(input.weight * 2)

  // Fat: 25% of calories
  const fatCalories = Math.round(targetCalories * 0.25)
  const targetFat = Math.round(fatCalories / 9)

  // Carbs: remaining calories
  const proteinCalories = targetProtein * 4
  const remainingCalories = targetCalories - proteinCalories - fatCalories
  const targetCarbs = Math.round(remainingCalories / 4)

  return {
    bmr,
    activityBase,
    appleWatchModifier,
    weekendModifier,
    trainingBonus,
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
