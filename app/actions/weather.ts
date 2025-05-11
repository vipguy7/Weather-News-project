"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

type WeatherCondition = "Clear" | "Clouds" | "Rain" | "Thunderstorm" | "Snow" | "Mist" | "Haze" | "Fog"

interface WeatherData {
  city: string
  temperature: number
  condition: WeatherCondition
  humidity: number
  windSpeed: number
  time: string
}

// Mock weather data for demonstration
const getWeatherCondition = (city: string): WeatherCondition => {
  const conditions: WeatherCondition[] = ["Clear", "Clouds", "Rain", "Thunderstorm", "Mist", "Haze"]
  const randomIndex = Math.floor(Math.random() * conditions.length)
  return conditions[randomIndex]
}

export async function getWeatherData(city: string): Promise<WeatherData> {
  // In a real app, you would fetch this from a weather API
  const currentDate = new Date()
  const isMorning = currentDate.getHours() < 12

  // Mock data for demonstration
  return {
    city,
    temperature: Math.floor(Math.random() * 15) + 20, // Random temp between 20-35°C
    condition: getWeatherCondition(city),
    humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // Random wind speed between 5-25 km/h
    time: isMorning ? "morning" : "night",
  }
}

// Mock Burmese weather texts for different conditions
const getMockBurmeseText = (city: string, condition: WeatherCondition, time: string): string => {
  const timeText = time === "morning" ? "နံနက်ခင်း" : "ညနေခင်း"
  const tempText = Math.random() > 0.5 ? "အပူချိန်မြင့်" : "အပူချိန်သင့်တင့်"

  switch (condition) {
    case "Clear":
      return `${city} မြို့တွင် ${timeText} ရာသီဥတု သာယာပြီး ${tempText} နေပါသည်။`
    case "Clouds":
      return `${city} မြို့တွင် ${timeText} မိုးတိမ်များ ဖုံးလွှမ်းပြီး ${tempText} နေပါသည်။`
    case "Rain":
      return `${city} မြို့တွင် ${timeText} မိုးရွာသွန်းပြီး ${tempText} နေပါသည်။`
    case "Thunderstorm":
      return `${city} မြို့တွင် ${timeText} မိုးသက်မုန်တိုင်း ဖြစ်ပေါ်ပြီး ${tempText} နေပါသည်။`
    case "Snow":
      return `${city} မြို့တွင် ${timeText} နှင်းကျဆင်းပြီး အေးမြနေပါသည်။`
    case "Mist":
    case "Haze":
    case "Fog":
      return `${city} မြို့တွင် ${timeText} မြူခိုးများ ဖုံးလွှမ်းပြီး ${tempText} နေပါသည်။`
    default:
      return `${city} မြို့တွင် ${timeText} ရာသီဥတု အခြေအနေ ${tempText} နေပါသည်။`
  }
}

export interface TextGenerationResult {
  text: string
  isUsingMockData: boolean
}

export async function generateBurmeseWeatherText(weatherData: WeatherData): Promise<TextGenerationResult> {
  // Always prepare mock text as fallback
  const mockText = getMockBurmeseText(weatherData.city, weatherData.condition, weatherData.time)

  // Check if OpenAI API key is available
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || apiKey.trim() === "") {
    console.log("No OpenAI API key available, using mock text")
    return { text: mockText, isUsingMockData: true }
  }

  try {
    const prompt = `
      Generate a simple one-line weather news message in Burmese language for ${weatherData.city} during ${weatherData.time}.
      Current weather conditions:
      - Temperature: ${weatherData.temperature}°C
      - Weather: ${weatherData.condition}
      - Humidity: ${weatherData.humidity}%
      - Wind Speed: ${weatherData.windSpeed} km/h
      
      The message should be simple, easy to understand, and avoid technical jargon.
      Only return the Burmese text, nothing else.
    `

    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt,
      temperature: 0.7,
      maxTokens: 100,
    })

    return { text: text.trim(), isUsingMockData: false }
  } catch (error) {
    console.error("Error generating Burmese text:", error)
    // Return mock text for any API error (quota exceeded, network issues, etc.)
    return { text: mockText, isUsingMockData: true }
  }
}
