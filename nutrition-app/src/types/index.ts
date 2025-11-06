// Core nutrition types

/**
 * Day type for training schedule
 */
export type DayType = 'training' | 'active_recovery' | 'rest'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  height: number // cm
  age: number
}

export interface DailySetupInput {
  weight: number // kg
  activityCalories: number // from Apple Watch Move calories
  dayType: DayType // training, active_recovery, or rest
  isWeekend: boolean // For banking calculation
}

export interface DailyTargets {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export interface DailyLog {
  id: string
  userId: string
  date: string
  weight: number
  activityCalories: number
  dayType: DayType
  isWeekend: boolean
  bmr: number
  activityBase: number
  deficit: number
  appleWatchModifier: number
  weekendModifier: number
  dayTypeBonus: number
  baseTarget: number
  targetCalories: number
  targetProtein: number
  targetCarbs: number
  targetFat: number
  createdAt: string
  updatedAt: string
}

export interface FoodEntry {
  id: string
  userId: string
  dailyLogId: string
  description: string
  imageUrl: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  source: 'user_input' | 'photo_analysis' | 'database'
  createdAt: string
  updatedAt: string
}

export interface PersonalFood {
  id: string
  userId: string
  name: string
  description: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  timesLogged: number
}

export interface ProjectFood {
  id: string
  name: string
  description: string | null
  calories: number
  protein: number
  carbs: number
  fat: number
  servingSize: string
  category: string | null
}

export interface DailyProgress {
  consumed: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  targets: DailyTargets
  remaining: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  percentages: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}
