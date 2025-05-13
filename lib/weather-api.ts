"use server"

import {
  getCachedWeatherData,
  setCachedWeatherData,
  getCachedForecastData,
  setCachedForecastData,
  clearCityCache,
} from "./redis"

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
  hourlyForecast?: HourlyForecast[]
  weatherCode?: number // Raw weather code from API
}

// Define hourly forecast type
export interface HourlyForecast {
  time: string
  temperature: number
  icon: string
  condition: WeatherCondition
  weatherCode?: number
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

// OpenWeatherMap forecast response
interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number
    main: {
      temp: number
    }
    weather: Array<{
      id: number
      main: string
      description: string
      icon: string
    }>
  }>
  city: {
    name: string
  }
}

// Error response from OpenWeatherMap
interface OpenWeatherErrorResponse {
  cod: number | string
  message: string
}

// Map OpenWeatherMap condition codes to our weather conditions
export async function mapWeatherCondition(weatherId: number): Promise<WeatherCondition> {
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

// Track if we've detected an invalid API key
let isApiKeyInvalid = false

// Format date for display
export async function formatLastUpdated(timestamp: number): Promise<string> {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Export the fetchWeatherData function with caching
export async function fetchWeatherData(city: string, forceRefresh = false): Promise<WeatherData | null> {
  // If we already know the API key is invalid, don't try to fetch
  if (isApiKeyInvalid) {
    console.log("Skipping API call - API key previously detected as invalid")
    return null
  }

  // Check Redis cache first (unless force refresh is requested)
  if (!forceRefresh) {
    const cachedData = await getCachedWeatherData(city)
    if (cachedData) {
      console.log(`Using cached weather data for ${city}`)
      return cachedData as WeatherData
    }
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

    // Get hourly forecast data
    const hourlyForecast = await fetchHourlyForecast(city, forceRefresh)

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
      hourlyForecast,
      weatherCode: data.weather[0].id,
    }

    // Cache the result in Redis
    await setCachedWeatherData(city, weatherData)

    return weatherData
  } catch (error) {
    console.error(`Error fetching weather data for ${city}:`, error)
    return null
  }
}

// Fetch hourly forecast data
export async function fetchHourlyForecast(city: string, forceRefresh = false): Promise<HourlyForecast[] | undefined> {
  // If we already know the API key is invalid, don't try to fetch
  if (isApiKeyInvalid) {
    return undefined
  }

  // Check Redis cache first (unless force refresh is requested)
  if (!forceRefresh) {
    const cachedForecast = await getCachedForecastData(city)
    if (cachedForecast) {
      console.log(`Using cached forecast data for ${city}`)
      return cachedForecast as HourlyForecast[]
    }
  }

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey || apiKey.trim() === "") {
    return undefined
  }

  try {
    const encodedCity = encodeURIComponent(city)
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 1800 }, // Revalidate every 30 minutes
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Forecast API error: ${response.status} ${response.statusText}`)
    }

    const data: OpenWeatherForecastResponse = await response.json()

    // Get today's date
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Filter forecast for today and get specific hours (10am, 12pm, 2pm, 4pm, 6pm)
    const targetHours = [10, 12, 14, 16, 18]
    const hourlyData: HourlyForecast[] = []

    // Process the forecast data
    for (const item of data.list) {
      const forecastDate = new Date(item.dt * 1000)
      const forecastHour = forecastDate.getHours()

      // Check if this forecast is for today and one of our target hours
      if (forecastDate.getDate() === today.getDate() && targetHours.includes(forecastHour)) {
        const weatherId = item.weather[0].id
        hourlyData.push({
          time: forecastHour === 12 ? "12pm" : forecastHour < 12 ? `${forecastHour}am` : `${forecastHour - 12}pm`,
          temperature: Math.round(item.main.temp),
          icon: item.weather[0].icon,
          condition: await mapWeatherCondition(weatherId),
          weatherCode: weatherId,
        })
      }
    }

    // If we couldn't get all hours for today (maybe it's late in the day),
    // generate mock data for the missing hours
    if (hourlyData.length < targetHours.length) {
      const mockCondition = hourlyData.length > 0 ? hourlyData[0].condition : "Clear"
      const mockCode = hourlyData.length > 0 && hourlyData[0].weatherCode ? hourlyData[0].weatherCode : 800
      const mockBaseTemp = hourlyData.length > 0 ? hourlyData[0].temperature : 25

      for (const hour of targetHours) {
        if (
          !hourlyData.some((data) => data.time === (hour === 12 ? "12pm" : hour < 12 ? `${hour}am` : `${hour - 12}pm`))
        ) {
          // Generate mock data for this hour
          const mockTemp = mockBaseTemp + Math.floor(Math.random() * 5) - 2 // +/- 2 degrees
          hourlyData.push({
            time: hour === 12 ? "12pm" : hour < 12 ? `${hour}am` : `${hour - 12}pm`,
            temperature: mockTemp,
            icon: hour < 18 ? "01d" : "01n", // Default icon (day/night)
            condition: mockCondition,
            weatherCode: mockCode,
          })
        }
      }

      // Sort by hour
      hourlyData.sort((a, b) => {
        const hourA = a.time.includes("am")
          ? Number.parseInt(a.time.replace("am", ""))
          : Number.parseInt(a.time.replace("pm", "")) === 12
            ? 12
            : Number.parseInt(a.time.replace("pm", "")) + 12
        const hourB = b.time.includes("am")
          ? Number.parseInt(b.time.replace("am", ""))
          : Number.parseInt(b.time.replace("pm", "")) === 12
            ? 12
            : Number.parseInt(b.time.replace("pm", "")) + 12
        return hourA - hourB
      })
    }

    // Cache the forecast data in Redis
    await setCachedForecastData(city, hourlyData)

    return hourlyData
  } catch (error) {
    console.error(`Error fetching forecast data for ${city}:`, error)
    return undefined
  }
}

// Function to clear the cache for a specific city
export async function clearWeatherCache(city: string): Promise<void> {
  await clearCityCache(city)
}

// Function to check if the API key is valid
export async function isApiKeyValid(): Promise<boolean> {
  if (isApiKeyInvalid) return false

  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey || apiKey.trim() === "") return false

  try {
    // Try to fetch weather for a well-known city
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=${apiKey}`,
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

// Generate mock weather data for fallback
export async function generateMockWeatherData(city: string): Promise<WeatherData> {
  const currentDate = new Date()
  const isMorning = currentDate.getHours() < 12
  const conditions: WeatherCondition[] = ["Clear", "Clouds", "Rain", "Thunderstorm", "Mist", "Haze"]
  const condition = conditions[Math.floor(Math.random() * conditions.length)]
  const baseTemp = Math.floor(Math.random() * 15) + 20 // Random temp between 20-35°C

  // Generate mock hourly forecast
  const hourlyForecast: HourlyForecast[] = []
  const hours = ["10am", "12pm", "2pm", "4pm", "6pm"]

  for (let i = 0; i < hours.length; i++) {
    // Temperature increases until 2pm, then decreases
    let tempOffset = 0
    if (i < 2) tempOffset = i + 1
    else if (i === 2) tempOffset = 3
    else tempOffset = 5 - i

    // Icon depends on time of day and condition
    let icon = "01d" // default clear day
    switch (condition) {
      case "Clear":
        icon = i < 4 ? "01d" : "01n"
        break
      case "Clouds":
        icon = i < 4 ? "03d" : "03n"
        break
      case "Rain":
        icon = i < 4 ? "10d" : "10n"
        break
      case "Thunderstorm":
        icon = i < 4 ? "11d" : "11n"
        break
      case "Mist":
      case "Haze":
        icon = i < 4 ? "50d" : "50n"
        break
    }

    hourlyForecast.push({
      time: hours[i],
      temperature: baseTemp + tempOffset,
      icon,
      condition,
    })
  }

  return {
    city,
    temperature: baseTemp,
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
    icon: isMorning ? "01d" : "01n", // default icon
    hourlyForecast,
  }
}
