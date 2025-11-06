import {
  calculateBMR,
  getDeficitForWeight,
  calculateAppleWatchModifier,
  calculateWeekendModifier,
  calculateDayTypeBonus,
  calculateDailyTargets,
  calculateProgress,
} from '../calculations'
import { DailySetupInput, DayType } from '@/types'

describe('Calculation Engine Tests', () => {
  describe('calculateBMR', () => {
    it('should calculate BMR correctly with default height and age', () => {
      // BMR = (10 × weight) + (6.25 × 172) - (5 × 27) + 5
      // BMR = (10 × 85) + (6.25 × 172) - (5 × 27) + 5
      // BMR = 850 + 1075 - 135 + 5 = 1795
      const bmr = calculateBMR(85)
      expect(bmr).toBe(1795)
    })

    it('should calculate BMR for different weights', () => {
      expect(calculateBMR(70)).toBe(1645) // (10 × 70) + 1075 - 135 + 5
      expect(calculateBMR(90)).toBe(1845) // (10 × 90) + 1075 - 135 + 5
      expect(calculateBMR(100)).toBe(1945) // (10 × 100) + 1075 - 135 + 5
    })

    it('should handle custom height and age', () => {
      // BMR = (10 × 80) + (6.25 × 180) - (5 × 30) + 5
      // BMR = 800 + 1125 - 150 + 5 = 1780
      const bmr = calculateBMR(80, 180, 30)
      expect(bmr).toBe(1780)
    })
  })

  describe('getDeficitForWeight', () => {
    it('should return correct deficit for weight >= 90kg', () => {
      expect(getDeficitForWeight(90)).toBe(750)
      expect(getDeficitForWeight(95)).toBe(750)
      expect(getDeficitForWeight(100)).toBe(750)
      expect(getDeficitForWeight(110)).toBe(750) // Above 100kg still gets 750
    })

    it('should return correct deficit for 80-90kg range', () => {
      expect(getDeficitForWeight(80)).toBe(650)
      expect(getDeficitForWeight(85)).toBe(650)
      expect(getDeficitForWeight(89.9)).toBe(650)
    })

    it('should return correct deficit for 70-80kg range', () => {
      expect(getDeficitForWeight(70)).toBe(550)
      expect(getDeficitForWeight(75)).toBe(550)
      expect(getDeficitForWeight(79.9)).toBe(550)
    })

    it('should return correct deficit for weight < 70kg', () => {
      expect(getDeficitForWeight(69.9)).toBe(450)
      expect(getDeficitForWeight(65)).toBe(450)
      expect(getDeficitForWeight(60)).toBe(450)
      expect(getDeficitForWeight(50)).toBe(450)
    })
  })

  describe('calculateAppleWatchModifier', () => {
    it('should calculate modifier correctly', () => {
      // Formula: (Move calories - 600) / 2
      expect(calculateAppleWatchModifier(600)).toBe(0)   // (600 - 600) / 2 = 0
      expect(calculateAppleWatchModifier(800)).toBe(100) // (800 - 600) / 2 = 100
      expect(calculateAppleWatchModifier(1000)).toBe(200) // (1000 - 600) / 2 = 200
      expect(calculateAppleWatchModifier(400)).toBe(-100) // (400 - 600) / 2 = -100
    })

    it('should handle edge cases', () => {
      expect(calculateAppleWatchModifier(0)).toBe(-300)
      expect(calculateAppleWatchModifier(1200)).toBe(300)
    })
  })

  describe('calculateWeekendModifier', () => {
    it('should return -100 for weekdays', () => {
      expect(calculateWeekendModifier(false)).toBe(-100)
    })

    it('should return +133 for weekends', () => {
      expect(calculateWeekendModifier(true)).toBe(133)
    })
  })

  describe('calculateDayTypeBonus', () => {
    it('should return correct bonus for training day', () => {
      expect(calculateDayTypeBonus('training')).toBe(250)
    })

    it('should return correct bonus for active recovery', () => {
      expect(calculateDayTypeBonus('active_recovery')).toBe(100)
    })

    it('should return 0 for rest day', () => {
      expect(calculateDayTypeBonus('rest')).toBe(0)
    })
  })

  describe('calculateDailyTargets - Integration Tests', () => {
    it('should calculate correct targets for 85kg on training weekday', () => {
      const input: DailySetupInput = {
        weight: 85,
        activityCalories: 800,
        dayType: 'training',
        isWeekend: false,
      }

      const result = calculateDailyTargets(input)

      // Expected calculation:
      // BMR: 1795
      // Activity Base: 900
      // Deficit: -650 (85kg is in 80-90 range)
      // Base Target: 1795 + 900 - 650 = 2045
      // Apple Watch: (800 - 600) / 2 = 100
      // Banking: -100 (weekday)
      // Training: +250
      // Final: 2045 + 100 - 100 + 250 = 2295

      expect(result.bmr).toBe(1795)
      expect(result.activityBase).toBe(900)
      expect(result.deficit).toBe(650)
      expect(result.baseTarget).toBe(2045)
      expect(result.appleWatchModifier).toBe(100)
      expect(result.weekendModifier).toBe(-100)
      expect(result.dayTypeBonus).toBe(250)
      expect(result.targets.calories).toBe(2295)

      // Protein: 85 × 1.5 = 127.5 → 128g
      expect(result.targets.protein).toBe(128)

      // Fat: 2295 × 0.275 = 631 cal → 631/9 = 70g
      expect(result.targets.fat).toBe(70)

      // Carbs: (2295 - (128×4) - (70×9)) / 4 = (2295 - 512 - 630) / 4 = 1153 / 4 = 288g
      expect(result.targets.carbs).toBe(288)
    })

    it('should calculate correct targets for 70kg on rest weekend', () => {
      const input: DailySetupInput = {
        weight: 70,
        activityCalories: 600,
        dayType: 'rest',
        isWeekend: true,
      }

      const result = calculateDailyTargets(input)

      // Expected calculation:
      // BMR: 1645
      // Activity Base: 900
      // Deficit: -550 (70kg is boundary, gets 550)
      // Base Target: 1645 + 900 - 550 = 1995
      // Apple Watch: (600 - 600) / 2 = 0
      // Banking: +133 (weekend)
      // Training: 0 (rest)
      // Final: 1995 + 0 + 133 + 0 = 2128

      expect(result.bmr).toBe(1645)
      expect(result.deficit).toBe(550)
      expect(result.baseTarget).toBe(1995)
      expect(result.appleWatchModifier).toBe(0)
      expect(result.weekendModifier).toBe(133)
      expect(result.dayTypeBonus).toBe(0)
      expect(result.targets.calories).toBe(2128)

      // Protein: 70 × 1.5 = 105g
      expect(result.targets.protein).toBe(105)
    })

    it('should calculate correct targets for 95kg on active recovery weekend', () => {
      const input: DailySetupInput = {
        weight: 95,
        activityCalories: 1000,
        dayType: 'active_recovery',
        isWeekend: true,
      }

      const result = calculateDailyTargets(input)

      // Expected calculation:
      // BMR: 1845
      // Activity Base: 900
      // Deficit: -750 (95kg is in 90+ range)
      // Base Target: 1845 + 900 - 750 = 1995
      // Apple Watch: (1000 - 600) / 2 = 200
      // Banking: +133 (weekend)
      // Active Recovery: +100
      // Final: 1995 + 200 + 133 + 100 = 2428

      expect(result.bmr).toBe(1845)
      expect(result.deficit).toBe(750)
      expect(result.baseTarget).toBe(1995)
      expect(result.appleWatchModifier).toBe(200)
      expect(result.weekendModifier).toBe(133)
      expect(result.dayTypeBonus).toBe(100)
      expect(result.targets.calories).toBe(2428)

      // Protein: 95 × 1.5 = 142.5 → 143g
      expect(result.targets.protein).toBe(143)
    })

    it('should calculate correct targets for 65kg on training weekday with low activity', () => {
      const input: DailySetupInput = {
        weight: 65,
        activityCalories: 400,
        dayType: 'training',
        isWeekend: false,
      }

      const result = calculateDailyTargets(input)

      // Expected calculation:
      // BMR: 1595
      // Activity Base: 900
      // Deficit: -450 (65kg is < 70)
      // Base Target: 1595 + 900 - 450 = 2045
      // Apple Watch: (400 - 600) / 2 = -100
      // Banking: -100 (weekday)
      // Training: +250
      // Final: 2045 - 100 - 100 + 250 = 2095

      expect(result.bmr).toBe(1595)
      expect(result.deficit).toBe(450)
      expect(result.appleWatchModifier).toBe(-100)
      expect(result.targets.calories).toBe(2095)
    })
  })

  describe('calculateProgress', () => {
    it('should calculate progress correctly', () => {
      const consumed = {
        calories: 1500,
        protein: 100,
        carbs: 150,
        fat: 50,
      }

      const targets = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 60,
      }

      const progress = calculateProgress(consumed, targets)

      expect(progress.consumed).toEqual(consumed)
      expect(progress.targets).toEqual(targets)
      expect(progress.remaining).toEqual({
        calories: 500,
        protein: 50,
        carbs: 50,
        fat: 10,
      })
      expect(progress.percentages).toEqual({
        calories: 75,
        protein: 67,
        carbs: 75,
        fat: 83,
      })
    })

    it('should handle exceeding targets', () => {
      const consumed = {
        calories: 2200,
        protein: 160,
        carbs: 210,
        fat: 70,
      }

      const targets = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 60,
      }

      const progress = calculateProgress(consumed, targets)

      expect(progress.remaining).toEqual({
        calories: -200,
        protein: -10,
        carbs: -10,
        fat: -10,
      })
      expect(progress.percentages).toEqual({
        calories: 110,
        protein: 107,
        carbs: 105,
        fat: 117,
      })
    })

    it('should handle zero consumption', () => {
      const consumed = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }

      const targets = {
        calories: 2000,
        protein: 150,
        carbs: 200,
        fat: 60,
      }

      const progress = calculateProgress(consumed, targets)

      expect(progress.percentages).toEqual({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      })
    })
  })

  describe('Edge Cases and Validation', () => {
    it('should handle very high weight', () => {
      const input: DailySetupInput = {
        weight: 120,
        activityCalories: 800,
        dayType: 'training',
        isWeekend: false,
      }

      const result = calculateDailyTargets(input)
      expect(result.deficit).toBe(750) // Should still use 750 deficit
      expect(result.bmr).toBe(2095) // (10 × 120) + 1075 - 135 + 5
    })

    it('should handle very low weight', () => {
      const input: DailySetupInput = {
        weight: 50,
        activityCalories: 500,
        dayType: 'rest',
        isWeekend: false,
      }

      const result = calculateDailyTargets(input)
      expect(result.deficit).toBe(450)
      expect(result.bmr).toBe(1445) // (10 × 50) + 1075 - 135 + 5
    })

    it('should ensure macros sum correctly', () => {
      const input: DailySetupInput = {
        weight: 80,
        activityCalories: 700,
        dayType: 'training',
        isWeekend: true,
      }

      const result = calculateDailyTargets(input)

      const proteinCals = result.targets.protein * 4
      const carbsCals = result.targets.carbs * 4
      const fatCals = result.targets.fat * 9
      const totalMacroCals = proteinCals + carbsCals + fatCals

      // Should be within 50 calories due to rounding
      expect(Math.abs(totalMacroCals - result.targets.calories)).toBeLessThan(50)
    })
  })
})
