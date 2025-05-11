"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getWeatherData, generateBurmeseWeatherText } from "@/app/actions/weather"
import { Download, RefreshCw, Info } from "lucide-react"
import { WeatherPostImage } from "./weather-post-image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface WeatherPostGeneratorProps {
  city: string
}

export default function WeatherPostGenerator({ city }: WeatherPostGeneratorProps) {
  const [weatherData, setWeatherData] = useState<any>(null)
  const [burmeseText, setBurmeseText] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [usingMockData, setUsingMockData] = useState(true)

  useEffect(() => {
    async function loadWeatherData() {
      setIsLoading(true)
      try {
        const data = await getWeatherData(city)
        setWeatherData(data)
        const result = await generateBurmeseWeatherText(data)
        setBurmeseText(result.text)
        setUsingMockData(result.isUsingMockData)
      } catch (error) {
        console.error(`Error loading data for ${city}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadWeatherData()
  }, [city])

  const handleRegenerateText = async () => {
    if (!weatherData) return

    setIsGenerating(true)
    try {
      const result = await generateBurmeseWeatherText(weatherData)
      setBurmeseText(result.text)
      setUsingMockData(result.isUsingMockData)
    } catch (error) {
      console.error("Error regenerating text:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getWeatherBackground = (condition: string) => {
    switch (condition) {
      case "Clear":
        return "/placeholder.svg?height=400&width=600"
      case "Clouds":
        return "/placeholder.svg?height=400&width=600"
      case "Rain":
        return "/placeholder.svg?height=400&width=600"
      case "Thunderstorm":
        return "/placeholder.svg?height=400&width=600"
      case "Snow":
        return "/placeholder.svg?height=400&width=600"
      case "Mist":
      case "Haze":
      case "Fog":
        return "/placeholder.svg?height=400&width=600"
      default:
        return "/placeholder.svg?height=400&width=600"
    }
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
      <CardContent className="p-0">
        {weatherData && (
          <WeatherPostImage
            city={city}
            weatherData={weatherData}
            burmeseText={burmeseText}
            backgroundImage={getWeatherBackground(weatherData.condition)}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 bg-white">
        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={handleRegenerateText} disabled={isGenerating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Regenerate Text"}
          </Button>

          {usingMockData && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="ml-2">
                    <Info className="h-4 w-4 text-amber-500" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Using pre-written Burmese text. OpenAI API unavailable or quota exceeded.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <Button size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Image
        </Button>
      </CardFooter>
    </Card>
  )
}
