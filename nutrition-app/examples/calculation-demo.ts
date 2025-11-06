/**
 * Calculation Engine Demo
 *
 * This file demonstrates the calculation engine with real-world scenarios.
 * Run with: npx ts-node examples/calculation-demo.ts
 */

import {
  calculateDailyTargets,
  formatCalculationBreakdown,
  calculateProgress,
} from '../src/utils/calculations'
import { DailySetupInput } from '../src/types'

console.log('🥗 NUTRITION COACH - CALCULATION ENGINE DEMO\n')
console.log('=' .repeat(80))

// ==========================================
// SCENARIO 1: Typical Training Day (Monday)
// ==========================================
console.log('\n📅 SCENARIO 1: Monday Training Day')
console.log('=' .repeat(80))

const scenario1: DailySetupInput = {
  weight: 85,
  activityCalories: 800,
  dayType: 'training',
  isWeekend: false,
}

const result1 = calculateDailyTargets(scenario1)
console.log(formatCalculationBreakdown(result1, scenario1))

// ==========================================
// SCENARIO 2: Rest Day Weekend (Saturday)
// ==========================================
console.log('\n📅 SCENARIO 2: Saturday Rest Day')
console.log('=' .repeat(80))

const scenario2: DailySetupInput = {
  weight: 85,
  activityCalories: 650,
  dayType: 'rest',
  isWeekend: true,
}

const result2 = calculateDailyTargets(scenario2)
console.log(formatCalculationBreakdown(result2, scenario2))

// ==========================================
// SCENARIO 3: Active Recovery Thursday
// ==========================================
console.log('\n📅 SCENARIO 3: Thursday Active Recovery')
console.log('=' .repeat(80))

const scenario3: DailySetupInput = {
  weight: 85,
  activityCalories: 700,
  dayType: 'active_recovery',
  isWeekend: false,
}

const result3 = calculateDailyTargets(scenario3)
console.log(formatCalculationBreakdown(result3, scenario3))

// ==========================================
// SCENARIO 4: Weight Loss Progress
// ==========================================
console.log('\n📉 SCENARIO 4: Weight Loss Progress (Same conditions, different weights)')
console.log('=' .repeat(80))

const weights = [95, 85, 75, 65]
const baseInput: Omit<DailySetupInput, 'weight'> = {
  activityCalories: 800,
  dayType: 'training',
  isWeekend: false,
}

console.log('\nComparing calorie targets as weight decreases:\n')
console.log('Weight | Deficit | BMR  | Base Target | Final Target | Protein')
console.log('-' .repeat(70))

weights.forEach(weight => {
  const input: DailySetupInput = { ...baseInput, weight }
  const result = calculateDailyTargets(input)

  console.log(
    `${weight}kg  | -${result.deficit}   | ${result.bmr} | ${result.baseTarget}        | ${result.targets.calories}          | ${result.targets.protein}g`
  )
})

console.log('\n💡 Notice: As weight decreases, deficit reduces to preserve muscle mass!')

// ==========================================
// SCENARIO 5: Weekly Banking Strategy
// ==========================================
console.log('\n\n📊 SCENARIO 5: Weekly Banking Strategy')
console.log('=' .repeat(80))

const weeklyScenarios = [
  { day: 'Monday', weight: 85, calories: 800, dayType: 'training' as const, isWeekend: false },
  { day: 'Tuesday', weight: 85, calories: 750, dayType: 'active_recovery' as const, isWeekend: false },
  { day: 'Wednesday', weight: 85, calories: 800, dayType: 'training' as const, isWeekend: false },
  { day: 'Thursday', weight: 85, calories: 700, dayType: 'rest' as const, isWeekend: false },
  { day: 'Friday', weight: 85, calories: 900, dayType: 'training' as const, isWeekend: true },
  { day: 'Saturday', weight: 84.5, calories: 650, dayType: 'rest' as const, isWeekend: true },
  { day: 'Sunday', weight: 84.5, calories: 600, dayType: 'rest' as const, isWeekend: true },
]

console.log('\nDay       | Type          | Move Cal | Banking | Day Bonus | Target Cal')
console.log('-' .repeat(75))

let totalWeeklyCalories = 0

weeklyScenarios.forEach(scenario => {
  const input: DailySetupInput = {
    weight: scenario.weight,
    activityCalories: scenario.calories,
    dayType: scenario.dayType,
    isWeekend: scenario.isWeekend,
  }

  const result = calculateDailyTargets(input)
  totalWeeklyCalories += result.targets.calories

  const banking = scenario.isWeekend ? '+133' : '-100'
  const dayBonus = result.dayTypeBonus > 0 ? `+${result.dayTypeBonus}` : '0'

  console.log(
    `${scenario.day.padEnd(9)} | ${scenario.dayType.padEnd(13)} | ${scenario.calories}      | ${banking}     | ${dayBonus.padEnd(9)} | ${result.targets.calories}`
  )
})

console.log('-' .repeat(75))
console.log(`Total weekly calories: ${totalWeeklyCalories}`)
console.log(`Average daily: ${Math.round(totalWeeklyCalories / 7)}`)

console.log('\n💡 Banking allows for higher calories on weekends while maintaining deficit!')

// ==========================================
// SCENARIO 6: Progress Tracking Example
// ==========================================
console.log('\n\n📈 SCENARIO 6: Daily Progress Tracking')
console.log('=' .repeat(80))

const todayTargets = result1.targets

console.log('\nStarting targets for today:')
console.log(`  Calories: ${todayTargets.calories} cal`)
console.log(`  Protein: ${todayTargets.protein}g`)
console.log(`  Carbs: ${todayTargets.carbs}g`)
console.log(`  Fat: ${todayTargets.fat}g`)

const meals = [
  { name: 'Breakfast', calories: 450, protein: 35, carbs: 40, fat: 18 },
  { name: 'Lunch', calories: 650, protein: 45, carbs: 70, fat: 20 },
  { name: 'Snack', calories: 200, protein: 15, carbs: 20, fat: 8 },
  { name: 'Dinner', calories: 750, protein: 50, carbs: 80, fat: 22 },
]

console.log('\n📊 Meal-by-meal progress:\n')

let consumed = { calories: 0, protein: 0, carbs: 0, fat: 0 }

meals.forEach((meal, index) => {
  consumed.calories += meal.calories
  consumed.protein += meal.protein
  consumed.carbs += meal.carbs
  consumed.fat += meal.fat

  const progress = calculateProgress(consumed, todayTargets)

  console.log(`After ${meal.name}:`)
  console.log(`  Consumed: ${consumed.calories}/${todayTargets.calories} cal (${progress.percentages.calories}%)`)
  console.log(`  Protein: ${consumed.protein}/${todayTargets.protein}g (${progress.percentages.protein}%)`)
  console.log(`  Remaining: ${progress.remaining.calories} cal`)

  if (index < meals.length - 1) {
    console.log()
  }
})

const finalProgress = calculateProgress(consumed, todayTargets)

console.log('\n🎯 End of Day Summary:')
console.log(`  Calories: ${finalProgress.percentages.calories}% of target`)
console.log(`  Protein: ${finalProgress.percentages.protein}% of target`)
console.log(`  Carbs: ${finalProgress.percentages.carbs}% of target`)
console.log(`  Fat: ${finalProgress.percentages.fat}% of target`)

if (finalProgress.percentages.calories >= 95 && finalProgress.percentages.calories <= 105) {
  console.log('\n✅ Excellent! You hit your targets perfectly!')
} else if (finalProgress.percentages.calories < 95) {
  console.log(`\n📝 You have ${finalProgress.remaining.calories} calories remaining. Consider a small snack!`)
} else {
  console.log('\n👍 You slightly exceeded your target, but that\'s okay!')
}

// ==========================================
// SCENARIO 7: Apple Watch Activity Impact
// ==========================================
console.log('\n\n⌚ SCENARIO 7: Apple Watch Activity Impact')
console.log('=' .repeat(80))

const activityLevels = [400, 600, 800, 1000, 1200]

console.log('\nHow Apple Watch Move calories affect your daily target:\n')
console.log('Move Cal | Modifier | Final Target (85kg, training, weekday)')
console.log('-' .repeat(60))

activityLevels.forEach(activity => {
  const input: DailySetupInput = {
    weight: 85,
    activityCalories: activity,
    dayType: 'training',
    isWeekend: false,
  }

  const result = calculateDailyTargets(input)
  const modifier = result.appleWatchModifier >= 0 ? `+${result.appleWatchModifier}` : `${result.appleWatchModifier}`

  console.log(`${activity}     | ${modifier.padStart(4)}     | ${result.targets.calories}`)
})

console.log('\n💡 Formula: (Move calories - 600) ÷ 2')
console.log('   More active = more calories to fuel your day!')

// ==========================================
// Summary
// ==========================================
console.log('\n\n' + '=' .repeat(80))
console.log('🎓 KEY TAKEAWAYS:')
console.log('=' .repeat(80))
console.log(`
1. BMR Formula: (10 × weight) + (6.25 × 172) - (5 × 27) + 5

2. Sliding Deficit (as you lose weight):
   - 90+ kg: 750 cal deficit
   - 80-90 kg: 650 cal deficit
   - 70-80 kg: 550 cal deficit
   - <70 kg: 450 cal deficit

3. Modifiers:
   - Apple Watch: (Move cal - 600) ÷ 2
   - Banking: -100 Mon-Thu, +133 Fri-Sun
   - Training: +250 training, +100 active recovery, 0 rest

4. Macro Split:
   - Protein: 1.5g per kg body weight
   - Fat: 27.5% of calories (middle of 25-30% range)
   - Carbs: Remaining calories

5. The system adapts to your weight, activity, and training schedule!
`)

console.log('=' .repeat(80))
console.log('✨ End of Demo\n')
