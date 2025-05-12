import type { WeatherCondition } from "./weather-api"

// Map city names to their image paths
const cityBackgrounds: Record<string, string> = {
  Yangon: "/images/cities/yangon.png",
  Mandalay: "/images/cities/mandalay.png",
  "Nay Pyi Taw": "/images/cities/nay-pyi-taw.png",
  "New Delhi": "/images/cities/new-delhi.png",
  Bangkok: "/images/cities/bangkok.png",
  "Chiang Mai": "/images/cities/chiang-mai.png",
  "Mae Sot": "/images/cities/mae-sot.png",
}

// Map weather conditions to their image paths
const weatherBackgrounds: Record<WeatherCondition, string> = {
  Clear: "/images/clear.png",
  Clouds: "/images/clouds.png",
  Rain: "/images/rain.png",
  Drizzle: "/images/rain.png",
  Thunderstorm: "/images/thunderstorm.png",
  Snow: "/images/snow.png",
  Mist: "/images/mist.png",
  Fog: "/images/mist.png",
  Haze: "/images/mist.png",
  Dust: "/images/mist.png",
  Smoke: "/images/mist.png",
}

// Get the appropriate background image based on city and weather
export function getBackgroundImage(city: string, condition: WeatherCondition, useWeatherBackground = false): string {
  // If useWeatherBackground is true, prioritize weather condition
  if (useWeatherBackground) {
    return weatherBackgrounds[condition] || "/images/clear.png"
  }

  // Otherwise, prioritize city background
  return cityBackgrounds[city] || weatherBackgrounds[condition] || "/images/clear.png"
}

// Get the weather overlay image based on condition
export function getWeatherOverlay(condition: WeatherCondition): string | null {
  // For clear conditions, don't use an overlay
  if (condition === "Clear") return null

  // For other conditions, return the appropriate overlay
  return weatherBackgrounds[condition] || null
}

// Get a normalized city name for file paths
export function getNormalizedCityName(city: string): string {
  return city.toLowerCase().replace(/\s+/g, "-")
}

// Get the appropriate text color based on the city and weather
export function getTextColorClass(city: string, condition: WeatherCondition): string {
  // Default to white text for most cities
  const darkTextCities = ["Nay Pyi Taw", "Chiang Mai"] // Cities that need dark text

  // Weather conditions that need light text regardless of city
  const lightTextConditions = ["Rain", "Drizzle", "Thunderstorm", "Snow"]

  if (lightTextConditions.includes(condition)) {
    return "text-white"
  }

  return darkTextCities.includes(city) ? "text-gray-900" : "text-white"
}
