"use server"

// Define the weather condition type
export type WeatherCondition =
  | "Clear"
  | "Clouds"
  | "Rain"
  | "Snow"
  | "Thunderstorm"
  | "Mist"
  | "Drizzle"
  | "Dust"
  | "Smoke"
  | "Haze"
  | "Fog"

// Define the weather data type
export interface WeatherData {
  city: string
  temperature: number
  condition: WeatherCondition
  humidity: number
  windSpeed: number
  time: "morning" | "night"
  description: string
  isRealData: boolean
  lastUpdated: string
  icon?: string
}

// Define the OpenWeatherMap API response types
interface OpenWeatherResponse {
  name: string
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
  sys: {
    country: string
  }
  dt: number // Timestamp of data calculation
}

// Error response from OpenWeatherMap
interface OpenWeatherErrorResponse {
  cod: number | string
  message: string
}

// Map OpenWeatherMap condition codes to our weather conditions
async function mapWeatherCondition(weatherId: number): Promise<WeatherCondition> {
  // Weather condition codes: https://openweathermap.org/weather-conditions
  if (weatherId >= 200 && weatherId < 300) return "Thunderstorm"
  if (weatherId >= 300 && weatherId < 400) return "Drizzle"
  if (weatherId >= 500 && weatherId < 600) return "Rain"
  if (weatherId >= 600 && weatherId < 700) return "Snow"
  if (weatherId === 701) return "Mist"
  if (weatherId === 711) return "Smoke"
  if (weatherId === 721) return "Haze"
  if (weatherId === 731 || weatherId === 761) return "Dust"
  if (weatherId === 741) return "Fog"
  if (weatherId === 800) return "Clear"
  if (weatherId > 800) return "Clouds"
  return "Clear" // Default
}

// Cache weather data for 30 minutes to reduce API calls
const CACHE_TIME = 30 * 60 * 1000 // 30 minutes in milliseconds
const weatherCache = new Map<string, { data: WeatherData; timestamp: number }>()

// Track if we've detected an invalid API key
let isApiKeyInvalid = false

// Format date for display
async function formatLastUpdated(timestamp: number): Promise<string> {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Export the fetchWeatherData function with caching
export async function fetchWeatherData(city: string): Promise<WeatherData | null> {
  // If we already know the API key is invalid, don't try to fetch
  if (isApiKeyInvalid) {
    console.log("Skipping API call - API key previously detected as invalid")
    return null
  }

  // Check if we have cached data that's still valid
  const cachedData = weatherCache.get(city)
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_TIME) {
    return cachedData.data
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey || apiKey.trim() === "") {
    console.log("No OpenWeather API key found, using mock data")
    return null
  }

  try {
    const encodedCity = encodeURIComponent(city)
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
      cache: "no-store", // Don't cache the response when manually refreshing
    })

    if (!response.ok) {
      const errorData = (await response.json()) as OpenWeatherErrorResponse

      // Check if the error is due to an invalid API key
      if (response.status === 401 || (errorData.message && errorData.message.includes("Invalid API key"))) {
        console.error("Invalid OpenWeather API key detected")
        isApiKeyInvalid = true
      }

      throw new Error(`Weather API error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`)
    }

    const data: OpenWeatherResponse = await response.json()

    const currentDate = new Date()
    const isMorning = currentDate.getHours() < 12

    // Map API response to our WeatherData format
    const weatherData: WeatherData = {
      city: data.name,
      temperature: Math.round(data.main.temp),
      condition: await mapWeatherCondition(data.weather[0].id),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      time: isMorning ? "morning" : "night",
      description: data.weather[0].description,
      isRealData: true,
      lastUpdated: await formatLastUpdated(data.dt),
      icon: data.weather[0].icon,
    }

    // Cache the result
    weatherCache.set(city, { data: weatherData, timestamp: Date.now() })

    return weatherData
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error)
    return null
  }
}

// Function to clear the cache for a specific city
export async function clearWeatherCache(city: string): Promise<void> {
  weatherCache.delete(city)
}

// Function to clear the entire cache
export async function clearAllWeatherCache(): Promise<void> {
  weatherCache.clear()
}

// Function to check if the API key is valid
export async function isApiKeyValid(): Promise<boolean> {
  if (isApiKeyInvalid) return false

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey || apiKey.trim() === "") return false

  try {
    // Try to fetch weather for a well-known city
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${b023ba7818b2ff8ee1950e7ee3042ba7}`,
      { cache: "no-store" },
    )

    if (!response.ok) {
      const errorData = (await response.json()) as OpenWeatherErrorResponse

      // Check if the error is due to an invalid API key
      if (response.status === 401 || (errorData.message && errorData.message.includes("Invalid API key"))) {
        isApiKeyInvalid = true
        return false
      }
    }

    return response.ok
  } catch (error) {
    console.error("Error checking API key validity:", error)
    return false
  }
}
