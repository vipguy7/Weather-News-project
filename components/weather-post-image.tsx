"use client"

import Image from "next/image"
import { useRef } from "react"
import type { WeatherCondition } from "@/lib/weather-api"
import type { HourlyForecast } from "@/lib/weather-api"
import { cityNamesBurmese } from "@/lib/burmese-utils"
import { getWeatherIconUrl, getWeatherColorClasses, getWeatherConditionText } from "@/lib/icon-utils"

interface WeatherPostImageProps {
  city: string
  weatherData: any
  burmeseText: string
}

export function WeatherPostImage({ city, weatherData, burmeseText }: WeatherPostImageProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const cityBurmese = cityNamesBurmese[city] || city

  // Get weather color classes
  const { background, text } = getWeatherColorClasses(weatherData.condition as WeatherCondition)
  const textColorClass = text

  // Get detailed weather description
  const weatherDescription = getWeatherConditionText(
    weatherData.description || weatherData.condition,
    weatherData.weatherCode,
  )

  return (
    <div
      ref={canvasRef}
      className={`weather-card relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gradient-to-br ${background}`}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>

      {/* Content overlay */}
      <div className={`relative z-10 p-5 flex flex-col h-full ${textColorClass}`}>
        {/* Header with city name and temperature */}
        <div className="glassmorphism-light rounded-xl p-3 mb-3">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold drop-shadow-sm">{city}</h2>
              <p className="text-sm font-medium">{cityBurmese}</p>
            </div>
            <div className="flex items-center">
              <span className="text-4xl font-bold mr-1 drop-shadow-sm">{weatherData.temperature}°C</span>
              {weatherData.icon && (
                <Image
                  src={getWeatherIconUrl(weatherData.icon, 4) || "/placeholder.svg"}
                  alt={weatherData.condition}
                  width={80}
                  height={80}
                  className="w-20 h-20 drop-shadow-md"
                  unoptimized={true}
                />
              )}
            </div>
          </div>
        </div>

        {/* Weather details */}
        <div className="glassmorphism-light rounded-xl p-3 mb-3">
          <div className="text-xl font-semibold drop-shadow-sm">{weatherDescription}</div>
          <div className="text-sm mt-1">
            <span className="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14.5v.5a2 2 0 01-2 2h-4a2 2 0 01-2-2v-.5M14 10.5h.01M14 3v1.5M14 7v1.5"
                />
              </svg>
              Humidity: {weatherData.humidity}%
            </span>
            <span className="inline-flex items-center ml-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
              Wind: {weatherData.windSpeed} km/h
            </span>
          </div>
        </div>

        {/* Hourly forecast */}
        {weatherData.hourlyForecast && weatherData.hourlyForecast.length > 0 && (
          <div className="glassmorphism-light rounded-xl p-3 mb-3">
            <div className="flex justify-between items-center">
              {weatherData.hourlyForecast.map((hour: HourlyForecast, index: number) => (
                <div key={index} className="flex flex-col items-center">
                  <span className="text-xs font-semibold">{hour.time}</span>
                  <Image
                    src={getWeatherIconUrl(hour.icon) || "/placeholder.svg"}
                    alt={hour.condition}
                    width={36}
                    height={36}
                    className="w-9 h-9 my-1 drop-shadow-md"
                    unoptimized={true}
                  />
                  <span className="text-sm font-medium">{hour.temperature}°</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Burmese weather message */}
        <div className="mt-auto">
          <div className="glassmorphism-light rounded-xl p-4 mt-2">
            <p className="font-burmese text-base font-medium break-words leading-relaxed text-shadow">{burmeseText}</p>
          </div>
          <div className="mt-2 text-xs flex justify-between items-center">
            <span className="text-xs opacity-80 drop-shadow-sm">
              {weatherData.lastUpdated ? `Updated: ${weatherData.lastUpdated}` : ""}
            </span>
            <span className="drop-shadow-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}{" "}
              {weatherData.time === "morning" ? "Morning" : "Night"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
