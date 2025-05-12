"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getWeatherData, generateBurmeseWeatherText } from "@/app/actions/weather"
import { Download, RefreshCw, Info, Sun, Moon, AlertTriangle, ImageIcon } from "lucide-react"
import { WeatherPostImage } from "./weather-post-image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import html2canvas from "@/lib/html2canvas"

interface WeatherPostGeneratorProps {
  city: string
}

export default function WeatherPostGenerator({ city }: WeatherPostGeneratorProps) {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [burmeseText, setBurmeseText] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)
  const [useWeatherBackground, setUseWeatherBackground] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "night">(() => {
    const hour = new Date().getHours()
    return hour < 12 ? "morning" : "night"
  })
  const imageRef = useRef<HTMLDivElement>(null)

  const loadWeatherData = async (forceRefresh = false) => {
    setIsLoading(true)
    setApiError(null)
    try {
      const data = await getWeatherData(city, forceRefresh)

      // Override the time with our selected time
      const updatedData = { ...data, time: timeOfDay }
      setWeatherData(updatedData)

      const result = await generateBurmeseWeatherText(updatedData)
      setBurmeseText(result.text)
    } catch (error) {
      console.error(`Error loading data for ${city}:`, error)
      setApiError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadWeatherData()
  }, [city])

  // When time of day changes, update the weather data
  useEffect(() => {
    if (weatherData) {
      const updatedData = { ...weatherData, time: timeOfDay }
      setWeatherData(updatedData)

      // Generate new text for the new time of day
      const generateText = async () => {
        const result = await generateBurmeseWeatherText(updatedData)
        setBurmeseText(result.text)
      }

      generateText()
    }
  }, [timeOfDay])

  const handleRefreshWeather = async () => {
    setIsRefreshing(true)
    await loadWeatherData(true) // Force refresh
    setIsRefreshing(false)
  }

  const handleRegenerateText = async () => {
    if (!weatherData) return

    setIsGenerating(true)
    try {
      const result = await generateBurmeseWeatherText(weatherData)
      setBurmeseText(result.text)
    } catch (error) {
      console.error("Error regenerating text:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadImage = async () => {
    if (!imageRef.current) return

    setIsDownloading(true)
    try {
      const canvas = await html2canvas(imageRef.current, {
        useCORS: true,
        scale: 2, // Higher quality
        logging: false,
        allowTaint: true,
        backgroundColor: null,
      })

      const image = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = image
      link.download = `${city}-weather-${timeOfDay}-${new Date().toISOString().split("T")[0]}.png`
      link.click()
    } catch (error) {
      console.error("Error downloading image:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleTimeToggle = () => {
    setTimeOfDay((prev) => (prev === "morning" ? "night" : "morning"))
  }

  const toggleBackgroundType = () => {
    setUseWeatherBackground(!useWeatherBackground)
  }

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{city}</h2>
          <p>Loading weather data...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0 relative">
        {weatherData && (
          <>
            <div ref={imageRef}>
              <WeatherPostImage
                city={city}
                weatherData={weatherData}
                burmeseText={burmeseText}
                useWeatherBackground={useWeatherBackground}
              />
            </div>
            <div className="absolute top-2 right-2 flex gap-2">
              {weatherData.isRealData ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                  Real Data
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                  Mock Data
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col p-4 bg-white gap-3">
        {apiError && (
          <div className="w-full p-2 bg-red-50 text-red-800 text-xs rounded flex items-start mb-2">
            <AlertTriangle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
            <span>
              Error: Using mock data.{" "}
              {apiError.includes("Invalid API key") ? "API key is invalid or not activated." : apiError}
            </span>
          </div>
        )}

        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={handleRegenerateText} disabled={isGenerating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Regenerate Text"}
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2">
                    <Info className="h-4 w-4 text-amber-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Using pre-written Burmese text templates.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button size="sm" onClick={handleDownloadImage} disabled={isDownloading}>
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? "Processing..." : "Download Image"}
          </Button>
        </div>

        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-2">
            <Sun className={`h-4 w-4 ${timeOfDay === "morning" ? "text-amber-500" : "text-gray-400"}`} />
            <Switch checked={timeOfDay === "night"} onCheckedChange={handleTimeToggle} id={`time-toggle-${city}`} />
            <Moon className={`h-4 w-4 ${timeOfDay === "night" ? "text-blue-500" : "text-gray-400"}`} />
            <Label htmlFor={`time-toggle-${city}`} className="text-xs">
              {timeOfDay === "morning" ? "Morning" : "Night"}
            </Label>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleBackgroundType} className="h-8 px-2 text-xs">
              <ImageIcon className="h-3 w-3 mr-1" />
              {useWeatherBackground ? "City View" : "Weather View"}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleRefreshWeather} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
