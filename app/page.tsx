import { Suspense } from "react"
import WeatherPostGenerator from "@/components/weather-post-generator"
import { CityWeatherSkeleton } from "@/components/city-weather-skeleton"

export default function Home() {
  const cities = ["Yangon", "Mandalay", "Nay Pyi Taw", "New Delhi", "Bangkok", "Chiang Mai", "Mae Sot"]

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Daily Weather News Post Generator</h1>

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
