import { Redis } from "@upstash/redis"

// Initialize Redis client using environment variables from Upstash integration
const redis = Redis.fromEnv()

// Cache TTL values (in seconds)
const CACHE_TTL = {
  WEATHER: 30 * 60, // 30 minutes for weather data
  FORECAST: 60 * 60, // 1 hour for forecast data
  ICONS: 7 * 24 * 60 * 60, // 7 days for icons/graphics (rarely change)
}

// Weather data cache
export async function getCachedWeatherData(city: string): Promise<any | null> {
  try {
    const cacheKey = `weather:${city.toLowerCase()}`
    const cachedData = await redis.get(cacheKey)
    return cachedData
  } catch (error) {
    console.error("Redis error getting weather data:", error)
    return null
  }
}

export async function setCachedWeatherData(city: string, data: any): Promise<void> {
  try {
    const cacheKey = `weather:${city.toLowerCase()}`
    await redis.set(cacheKey, data, { ex: CACHE_TTL.WEATHER })
  } catch (error) {
    console.error("Redis error setting weather data:", error)
  }
}

// Forecast data cache
export async function getCachedForecastData(city: string): Promise<any | null> {
  try {
    const cacheKey = `forecast:${city.toLowerCase()}`
    const cachedData = await redis.get(cacheKey)
    return cachedData
  } catch (error) {
    console.error("Redis error getting forecast data:", error)
    return null
  }
}

export async function setCachedForecastData(city: string, data: any): Promise<void> {
  try {
    const cacheKey = `forecast:${city.toLowerCase()}`
    await redis.set(cacheKey, data, { ex: CACHE_TTL.FORECAST })
  } catch (error) {
    console.error("Redis error setting forecast data:", error)
  }
}

// Icon and graphic cache (for binary data)
export async function getCachedIconData(iconCode: string): Promise<string | null> {
  try {
    const cacheKey = `icon:${iconCode}`
    const cachedData = await redis.get(cacheKey)
    return cachedData as string | null
  } catch (error) {
    console.error("Redis error getting icon data:", error)
    return null
  }
}

export async function setCachedIconData(iconCode: string, data: string): Promise<void> {
  try {
    const cacheKey = `icon:${iconCode}`
    await redis.set(cacheKey, data, { ex: CACHE_TTL.ICONS })
  } catch (error) {
    console.error("Redis error setting icon data:", error)
  }
}

// Clear all cache for a city
export async function clearCityCache(city: string): Promise<void> {
  try {
    const weatherKey = `weather:${city.toLowerCase()}`
    const forecastKey = `forecast:${city.toLowerCase()}`

    await redis.del(weatherKey)
    await redis.del(forecastKey)
  } catch (error) {
    console.error("Redis error clearing cache:", error)
  }
}

// Ping Redis to check connectivity
export async function pingRedis(): Promise<boolean> {
  try {
    const result = await redis.ping()
    return result === "PONG"
  } catch (error) {
    console.error("Redis connectivity error:", error)
    return false
  }
}
