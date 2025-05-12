import { Suspense } from "react"
import WeatherPostGenerator from "@/components/weather-post-generator"
import { CityWeatherSkeleton } from "@/components/city-weather-skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ExternalLink, CheckCircle, AlertTriangle, MapPin, MessageSquare } from "lucide-react"
import { isApiKeyValid } from "@/lib/weather-api"

export default async function Home() {
  const cities = ["Yangon", "Mandalay", "Nay Pyi Taw", "New Delhi", "Bangkok", "Chiang Mai", "Mae Sot"]
  const hasApiKey = process.env.OPENWEATHER_API_KEY
  const isKeyValid = hasApiKey ? await isApiKeyValid() : false

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4">Daily Weather News Post Generator</h1>

        {hasApiKey && isKeyValid ? (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">OpenWeather API Connected</AlertTitle>
            <AlertDescription className="text-green-700">
              Using real-time weather data from OpenWeatherMap API.
            </AlertDescription>
          </Alert>
        ) : hasApiKey && !isKeyValid ? (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">Invalid OpenWeather API Key</AlertTitle>
            <AlertDescription className="flex flex-col gap-2 text-amber-700">
              <p>Your API key appears to be invalid or not yet activated. Using mock weather data instead.</p>
              <p className="text-sm">
                <a
                  href="https://openweathermap.org/faq#error401"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-800 hover:underline inline-flex items-center"
                >
                  Learn more about API key activation
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6">
            <AlertTitle>OpenWeather API Key Missing</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <p>
                You're currently using mock weather data. To get real-time weather data, add your OpenWeather API key.
              </p>
              <p className="text-sm">
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline inline-flex items-center"
                >
                  Get an API key from OpenWeatherMap
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4 mb-6">
          <Alert className="bg-blue-50 border-blue-200">
            <MapPin className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800">City-Specific Backgrounds Added</AlertTitle>
            <AlertDescription className="text-blue-700">
              Each city now has its own unique background image. Toggle between city view and weather view using the
              button on each card.
            </AlertDescription>
          </Alert>

          <Alert className="bg-purple-50 border-purple-200">
            <MessageSquare className="h-4 w-4 text-purple-600" />
            <AlertTitle className="text-purple-800">Friendly Burmese Messages</AlertTitle>
            <AlertDescription className="text-purple-700">
              Weather messages are now more conversational and include city names in Burmese. They also provide helpful
              advice based on weather conditions.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <Suspense key={city} fallback={<CityWeatherSkeleton />}>
              <WeatherPostGenerator city={city} />
            </Suspense>
          ))}
        </div>
      </div>
    </main>
  )
}
