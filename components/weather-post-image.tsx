"use client"

import Image from "next/image"
import { useRef } from "react"
import { getBackgroundImage, getWeatherOverlay, getTextColorClass } from "@/lib/background-utils"
import type { WeatherCondition } from "@/lib/weather-api"
import { cityNamesBurmese } from "@/lib/burmese-utils"

interface WeatherPostImageProps {
  city: string
  weatherData: any
  burmeseText: string
  backgroundImage?: string
  useWeatherBackground?: boolean
}

export function WeatherPostImage({
  city,
  weatherData,
  burmeseText,
  backgroundImage,
  useWeatherBackground = false,
}: WeatherPostImageProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const cityBurmese = cityNamesBurmese[city] || city

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return "☀️"
      case "Clouds":
        return "☁️"
      case "Rain":
      case "Drizzle":
        return "🌧️"
      case "Thunderstorm":
        return "⛈️"
      case "Snow":
        return "❄️"
      case "Mist":
      case "Haze":
      case "Fog":
      case "Dust":
      case "Smoke":
        return "🌫️"
      default:
        return "🌤️"
    }
  }

  // Get the background image based on city and weather condition
  const cityBackground = getBackgroundImage(city, weatherData.condition as WeatherCondition, useWeatherBackground)

  // Get weather overlay if needed
  const weatherOverlay = !useWeatherBackground ? getWeatherOverlay(weatherData.condition as WeatherCondition) : null

  // Get text color based on city and condition
  const textColorClass = getTextColorClass(city, weatherData.condition as WeatherCondition)

  return (
    <div ref={canvasRef} className="relative w-full aspect-[4/3] overflow-hidden">
      {/* City background image */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || cityBackground}
          alt={`${city} background`}
          fill
          className="object-cover"
          priority
        />

        {/* Semi-transparent overlay for better text readability */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Weather condition overlay if applicable */}
        {weatherOverlay && (
          <div className="absolute inset-0">
            <Image
              src={weatherOverlay || "/placeholder.svg"}
              alt={`${weatherData.condition} overlay`}
              fill
              className="object-cover opacity-40 mix-blend-overlay"
            />
          </div>
        )}
      </div>

      {/* Content overlay */}
      <div className={`relative z-10 p-6 flex flex-col h-full ${textColorClass}`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold drop-shadow-md">{city}</h2>
            <p className="text-sm font-medium drop-shadow-md">{cityBurmese}</p>
          </div>
          <div className="text-5xl">{getWeatherIcon(weatherData.condition)}</div>
        </div>

        <div className="mt-4">
          <div className="text-4xl font-bold mb-2 drop-shadow-md">{weatherData.temperature}°C</div>
          <div className="text-xl drop-shadow-md capitalize">{weatherData.description || weatherData.condition}</div>
          <div className="mt-2 text-sm drop-shadow-md">
            Humidity: {weatherData.humidity}% | Wind: {weatherData.windSpeed} km/h
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-3 bg-black/50 rounded-lg">
            <p className="text-lg font-medium text-white">{burmeseText}</p>
          </div>
          <div className="mt-2 text-xs text-right drop-shadow-md flex justify-between items-center">
            <span className="text-xs opacity-80">
              {weatherData.lastUpdated ? `Updated: ${weatherData.lastUpdated}` : ""}
            </span>
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              {weatherData.time === "morning" ? "Morning" : "Night"} Update
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
