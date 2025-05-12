"use server"

import { fetchWeatherData, clearWeatherCache, type WeatherCondition } from "@/lib/weather-api"
import { generateFriendlyBurmeseWeatherMessage } from "@/lib/burmese-utils"

export interface WeatherData {
  city: string
  temperature: number
  condition: WeatherCondition
  humidity: number
  windSpeed: number
  time: string
  description?: string
  isRealData?: boolean
  lastUpdated?: string
  icon?: string
}

// Mock weather data for fallback
const getWeatherCondition = (city: string): WeatherCondition => {
  const conditions: WeatherCondition[] = ["Clear", "Clouds", "Rain", "Thunderstorm", "Mist", "Haze"]
  const randomIndex = Math.floor(Math.random() * conditions.length)
  return conditions[randomIndex]
}

// Generate mock weather data
function generateMockWeatherData(city: string): WeatherData {
  const currentDate = new Date()
  const isMorning = currentDate.getHours() < 12
  const condition = getWeatherCondition(city)

  return {
    city,
    temperature: Math.floor(Math.random() * 15) + 20, // Random temp between 20-35°C
    condition,
    humidity: Math.floor(Math.random() * 30) + 50, // Random humidity between 50-80%
    windSpeed: Math.floor(Math.random() * 20) + 5, // Random wind speed between 5-25 km/h
    time: isMorning ? "morning" : "night",
    isRealData: false,
    lastUpdated: new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    description: condition.toLowerCase(),
  }
}

export async function getWeatherData(city: string, forceRefresh = false): Promise<WeatherData> {
  try {
    // If force refresh is requested, clear the cache for this city
    if (forceRefresh) {
      await clearWeatherCache(city)
    }

    // Try to get real weather data from the API
    const apiData = await fetchWeatherData(city)

    // If we got real data, return it
    if (apiData) {
      return apiData
    }

    // Otherwise, fall back to mock data
    return generateMockWeatherData(city)
  } catch (error) {
    console.error(`Error in getWeatherData for ${city}:`, error)
    // If anything goes wrong, return mock data
    return generateMockWeatherData(city)
  }
}

export interface TextGenerationResult {
  text: string
  isUsingMockData: boolean
}

export async function generateBurmeseWeatherText(weatherData: WeatherData): Promise<TextGenerationResult> {
  // Generate friendly Burmese text based on weather data
  const friendlyText = generateFriendlyBurmeseWeatherMessage(
    weatherData.city,
    weatherData.condition as WeatherCondition,
    weatherData.time,
    weatherData.temperature,
  )

  // Return the friendly text
  return {
    text: friendlyText,
    isUsingMockData: true,
  }
}
