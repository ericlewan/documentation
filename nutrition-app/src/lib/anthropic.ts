import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Analyze food from text description using Claude
 */
export async function analyzeFoodFromText(
  description: string
): Promise<{
  calories: number
  protein: number
  carbs: number
  fat: number
  normalizedDescription: string
}> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `You are a nutrition expert. Analyze this food description and provide nutritional information in JSON format.

Food description: "${description}"

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "normalizedDescription": "A clear, normalized description of the food",
  "calories": <number>,
  "protein": <number in grams>,
  "carbs": <number in grams>,
  "fat": <number in grams>
}

Be accurate but reasonable with estimates. If the portion size is unclear, assume a standard serving.`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Expected text response from Claude')
  }

  // Parse JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse nutrition data from response')
  }

  return JSON.parse(jsonMatch[0])
}

/**
 * Analyze food from image using Claude Vision
 */
export async function analyzeFoodFromImage(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp'
): Promise<{
  calories: number
  protein: number
  carbs: number
  fat: number
  description: string
}> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `You are a nutrition expert. Analyze this food image and provide nutritional information in JSON format.

Identify the food items and estimate their nutritional values.

Return ONLY a JSON object with this exact structure (no markdown, no explanation):
{
  "description": "A detailed description of what you see in the image",
  "calories": <total calories as number>,
  "protein": <total protein in grams as number>,
  "carbs": <total carbs in grams as number>,
  "fat": <total fat in grams as number>
}

Be accurate but reasonable with portion size estimates.`,
          },
        ],
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Expected text response from Claude')
  }

  // Parse JSON response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse nutrition data from response')
  }

  return JSON.parse(jsonMatch[0])
}

/**
 * Generate encouraging coaching message based on context
 */
export async function generateCoachingMessage(
  context: {
    currentProgress: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
    targets: {
      calories: number
      protein: number
      carbs: number
      fat: number
    }
    timeOfDay: string
    recentFoods: string[]
  }
): Promise<string> {
  const percentage = Math.round(
    (context.currentProgress.calories / context.targets.calories) * 100
  )

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `You are an encouraging, supportive nutrition coach. Generate a brief, friendly message for your client.

Context:
- Time: ${context.timeOfDay}
- Progress: ${percentage}% of daily calories (${context.currentProgress.calories}/${context.targets.calories} cal)
- Protein: ${context.currentProgress.protein}g / ${context.targets.protein}g
- Recent foods: ${context.recentFoods.join(', ')}

Write a short (1-2 sentences), encouraging message that:
- Feels natural and conversational
- Acknowledges their progress
- Provides gentle guidance if needed
- Stays positive and supportive

Message:`,
      },
    ],
  })

  const content = message.content[0]
  if (content.type !== 'text') {
    throw new Error('Expected text response from Claude')
  }

  return content.text.trim()
}
