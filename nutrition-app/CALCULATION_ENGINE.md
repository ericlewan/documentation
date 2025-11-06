# 🧮 Calculation Engine Documentation

This document explains the core calculation engine - the "brain" of the nutrition coaching system.

## Overview

The calculation engine takes daily inputs (weight, activity, training status) and calculates personalized nutrition targets that adapt to your progress, activity level, and goals.

## Core Formula

```
Final Target = BMR + Activity Base - Sliding Deficit + Apple Watch Modifier + Banking Modifier + Day Type Bonus
```

## Components Breakdown

### 1. BMR (Basal Metabolic Rate)

**Formula:** `(10 × weight_kg) + (6.25 × 172) - (5 × 27) + 5`

This is the Mifflin-St Jeor Equation for males. It calculates how many calories your body burns at rest.

**Examples:**
- 85kg: `(10 × 85) + 1075 - 135 + 5 = 1795 cal`
- 70kg: `(10 × 70) + 1075 - 135 + 5 = 1645 cal`
- 95kg: `(10 × 95) + 1075 - 135 + 5 = 1845 cal`

### 2. Activity Base

**Value:** `600 + 300 = 900 calories`

- 600: Base daily activity
- 300: NEAT (Non-Exercise Activity Thermogenesis)

This accounts for daily movement outside of formal exercise.

### 3. Sliding Deficit

The deficit **decreases as you lose weight** to preserve muscle mass and maintain metabolic health.

| Weight Range | Deficit |
|--------------|---------|
| 90+ kg       | 750 cal |
| 80-90 kg     | 650 cal |
| 70-80 kg     | 550 cal |
| < 70 kg      | 450 cal |

**Why sliding?** As you get leaner, aggressive deficits can harm muscle retention and metabolism. Progressive reduction ensures sustainable fat loss.

### 4. Apple Watch Modifier

**Formula:** `(Move Calories - 600) ÷ 2`

This adjusts your target based on actual activity from your Apple Watch.

**Examples:**
- 600 Move cal: `(600 - 600) ÷ 2 = 0 cal` (baseline)
- 800 Move cal: `(800 - 600) ÷ 2 = +100 cal` (more active)
- 1000 Move cal: `(1000 - 600) ÷ 2 = +200 cal` (very active)
- 400 Move cal: `(400 - 600) ÷ 2 = -100 cal` (less active)

**Why divide by 2?** Apple Watch calories include BMR, so we only add back half to avoid double-counting.

### 5. Banking Modifier

Weekly calorie cycling for adherence and performance:

- **Mon-Thu:** `-100 cal/day` (weekday banking)
- **Fri-Sun:** `+133 cal/day` (weekend boost)

**Weekly Balance:** `(-100 × 4) + (+133 × 3) = -400 + 399 ≈ 0`

This allows more flexibility on weekends while maintaining your weekly deficit.

### 6. Day Type Bonus

Adjust calories based on training intensity:

| Day Type | Bonus | Use Case |
|----------|-------|----------|
| Training | +250 cal | Full training session |
| Active Recovery | +100 cal | Light activity, stretching, walking |
| Rest | 0 cal | Complete rest day |

## Macro Calculations

Once total calories are determined, macros are calculated:

### Protein
**Formula:** `Weight (kg) × 1.5g`

**Why 1.5g/kg?** Optimal for muscle preservation during fat loss. Higher than sedentary needs (0.8g/kg) but sustainable long-term.

**Examples:**
- 85kg: 128g protein
- 70kg: 105g protein
- 95kg: 143g protein

### Fat
**Formula:** `Total Calories × 0.275 ÷ 9`

Uses **27.5% of total calories** (middle of 25-30% range). Fat is essential for hormone production and nutrient absorption.

**Note:** Fat has 9 calories per gram (vs 4 for protein/carbs).

### Carbs
**Formula:** `(Remaining Calories) ÷ 4`

Carbs fill the remaining calories after protein and fat are allocated.

**Calculation:**
```
Remaining Cal = Total Cal - (Protein g × 4) - (Fat g × 9)
Carbs = Remaining Cal ÷ 4
```

## Complete Examples

### Example 1: Typical Training Day

**Input:**
- Weight: 85 kg
- Apple Watch Move: 800 cal
- Day Type: Training
- Day: Monday (weekday)

**Calculation:**
```
BMR: 1795 cal
Activity Base: 900 cal
Deficit: -650 cal (80-90kg range)
────────────────────────
Base Target: 2045 cal

Apple Watch: (800 - 600) ÷ 2 = +100 cal
Banking: -100 cal (weekday)
Training: +250 cal
────────────────────────
Final Target: 2295 cal

Macros:
- Protein: 85 × 1.5 = 128g (512 cal)
- Fat: 2295 × 0.275 ÷ 9 = 70g (630 cal)
- Carbs: (2295 - 512 - 630) ÷ 4 = 288g (1152 cal)
```

### Example 2: Weekend Rest Day

**Input:**
- Weight: 85 kg
- Apple Watch Move: 650 cal
- Day Type: Rest
- Day: Saturday (weekend)

**Calculation:**
```
BMR: 1795 cal
Activity Base: 900 cal
Deficit: -650 cal
────────────────────────
Base Target: 2045 cal

Apple Watch: (650 - 600) ÷ 2 = +25 cal
Banking: +133 cal (weekend)
Rest: 0 cal
────────────────────────
Final Target: 2203 cal

Macros:
- Protein: 128g
- Fat: 67g
- Carbs: 282g
```

### Example 3: Weight Loss Progression

Same conditions (training weekday, 800 Move cal), different weights:

| Weight | Deficit | BMR  | Base  | Final | Protein |
|--------|---------|------|-------|-------|---------|
| 95kg   | -750    | 1845 | 1995  | 2345  | 143g    |
| 85kg   | -650    | 1795 | 2045  | 2295  | 128g    |
| 75kg   | -550    | 1695 | 2045  | 2295  | 113g    |
| 65kg   | -450    | 1595 | 2045  | 2295  | 98g     |

**Notice:** As weight decreases, deficit reduces but final target stays similar due to sliding deficit compensation.

## Weekly Strategy Example

**Week for 85kg person:**

| Day | Type | Move | Banking | Bonus | Target |
|-----|------|------|---------|-------|--------|
| Mon | Training | 800 | -100 | +250 | 2295 |
| Tue | Active | 750 | -100 | +100 | 2170 |
| Wed | Training | 800 | -100 | +250 | 2295 |
| Thu | Rest | 700 | -100 | 0 | 1995 |
| Fri | Training | 900 | +133 | +250 | 2578 |
| Sat | Rest | 650 | +133 | 0 | 2153 |
| Sun | Rest | 600 | +133 | 0 | 2128 |

**Weekly Total:** 15,614 cal
**Daily Average:** 2,231 cal
**Weekly Deficit:** ~4,500 cal = ~1 lb fat loss

## Key Principles

### 1. Adaptive
System adjusts to your:
- Current weight (sliding deficit)
- Activity level (Apple Watch)
- Training schedule (day type bonus)

### 2. Sustainable
- Banking allows weekend flexibility
- Deficit reduces as you get leaner
- Adequate protein prevents muscle loss

### 3. Transparent
Every calculation is traceable and explainable. Users understand exactly how their targets are determined.

### 4. Evidence-Based
- Mifflin-St Jeor: Most accurate BMR formula
- 1.5g/kg protein: Optimal for fat loss
- Progressive deficit: Preserves metabolic health

## Testing

The calculation engine has comprehensive tests covering:

- ✅ BMR calculation accuracy
- ✅ Sliding deficit logic
- ✅ Apple Watch modifier
- ✅ Banking calculation
- ✅ Day type bonuses
- ✅ Macro distribution
- ✅ Edge cases (very high/low weights)
- ✅ Progress tracking

Run tests:
```bash
npm test
```

## Demo

See calculations in action:
```bash
npm run demo
```

This shows 7 real-world scenarios with full calculation breakdowns.

## API Reference

### `calculateBMR(weight, height?, age?)`
Calculate Basal Metabolic Rate.

### `getDeficitForWeight(weight)`
Get appropriate deficit based on weight range.

### `calculateAppleWatchModifier(moveCalories)`
Calculate adjustment based on Apple Watch activity.

### `calculateWeekendModifier(isWeekend)`
Get banking modifier (-100 weekday, +133 weekend).

### `calculateDayTypeBonus(dayType)`
Get bonus for training type (250/100/0).

### `calculateDailyTargets(input, height?, age?)`
Main function - calculates complete daily targets.

**Returns:**
```typescript
{
  bmr: number
  activityBase: number
  deficit: number
  appleWatchModifier: number
  weekendModifier: number
  dayTypeBonus: number
  baseTarget: number
  targets: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}
```

### `calculateProgress(consumed, targets)`
Track progress toward daily goals.

### `formatCalculationBreakdown(calculation, input)`
Generate human-readable explanation of calculations.

## Future Enhancements

Potential improvements:
- [ ] Custom height/age per user
- [ ] Female BMR formula option
- [ ] Adjustable protein targets
- [ ] Reverse diet calculator
- [ ] Maintenance phase targets
- [ ] Custom deficit ranges

---

**Last Updated:** 2024-11-06
**Version:** 1.0.0
