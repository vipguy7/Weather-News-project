"use client"

import Image from "next/image"
import { useRef } from "react"

interface WeatherPostImageProps {
  city: string
  weatherData: any
  burmeseText: string
  backgroundImage: string
}

export function WeatherPostImage({ city, weatherData, burmeseText, backgroundImage }: WeatherPostImageProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "Clear":
        return "☀️"
      case "Clouds":
        return "☁️"
      case "Rain":
        return "🌧️"
      case "Thunderstorm":
        return "⛈️"
      case "Snow":
        return "❄️"
      case "Mist":
      case "Haze":
      case "Fog":
        return "🌫️"
      default:
        return "🌤️"
    }
  }

  return (
    <div ref={canvasRef} className="relative w-full aspect-[4/3] overflow-hidden">
      {/* Background image with blur effect */}
      <div className="absolute inset-0">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt={`${city} weather background`}
          fill
          className="object-cover blur-sm"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 p-6 flex flex-col h-full text-white">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{city}</h2>
          <div className="text-5xl">{getWeatherIcon(weatherData.condition)}</div>
        </div>

        <div className="mt-4">
          <div className="text-4xl font-bold mb-2">{weatherData.temperature}°C</div>
          <div className="text-xl">{weatherData.condition}</div>
          <div className="mt-2 text-sm">
            Humidity: {weatherData.humidity}% | Wind: {weatherData.windSpeed} km/h
          </div>
        </div>

        <div className="mt-auto">
          <div className="p-3 bg-black/50 rounded-lg">
            <p className="text-lg font-medium">{burmeseText}</p>
          </div>
          <div className="mt-2 text-xs text-right">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            {weatherData.time === "morning" ? "Morning" : "Night"} Update
          </div>
        </div>
      </div>
    </div>
  )
}
