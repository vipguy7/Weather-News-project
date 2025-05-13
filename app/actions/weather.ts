"use server"

import {
  fetchWeatherData,
  type WeatherCondition,
  type HourlyForecast,
  generateMockWeatherData,
} from "@/lib/weather-api"
import { generateDescriptiveBurmeseWeatherMessage, getRandomHealthTip } from "@/lib/burmese-utils"

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
  hourlyForecast?: HourlyForecast[]
  healthTip?: string
  weatherCode?: number
}

export async function getWeatherData(city: string, forceRefresh = false): Promise<WeatherData> {
  try {
    // Try to get real weather data from the API with Redis caching
    const apiData = await fetchWeatherData(city, forceRefresh)

    // If we got real data, return it with a health tip
    if (apiData) {
      return {
        ...apiData,
        healthTip: getRandomHealthTip(apiData.condition),
      }
    }

    // Otherwise, fall back to mock data
    const mockData = await generateMockWeatherData(city)
    return {
      ...mockData,
      healthTip: getRandomHealthTip(mockData.condition),
    }
  } catch (error) {
    console.error(`Error in getWeatherData for ${city}:`, error)
    // If anything goes wrong, return mock data
    const mockData = await generateMockWeatherData(city)
    return {
      ...mockData,
      healthTip: getRandomHealthTip(mockData.condition),
    }
  }
}

export interface TextGenerationResult {
  text: string
  isUsingMockData: boolean
}

export async function generateBurmeseWeatherText(weatherData: WeatherData): Promise<TextGenerationResult> {
  // Generate descriptive Burmese text based on weather data
  const descriptiveText = generateDescriptiveBurmeseWeatherMessage(
    weatherData.city,
    weatherData.condition as WeatherCondition,
    weatherData.hourlyForecast,
  )

  // Return the descriptive text
  return {
    text: descriptiveText,
    isUsingMockData: true,
  }
}
