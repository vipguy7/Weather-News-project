// Modern weather icon URLs
export function getWeatherIconUrl(iconCode: string, size: 2 | 4 = 2): string {
  // Map OpenWeatherMap icon codes to modern icon set
  const iconMap: Record<string, string> = {
    // Day icons
    "01d": "/images/modern-icons/clear-day.svg",
    "02d": "/images/modern-icons/partly-cloudy-day.svg",
    "03d": "/images/modern-icons/cloudy.svg",
    "04d": "/images/modern-icons/cloudy.svg",
    "09d": "/images/modern-icons/rain.svg",
    "10d": "/images/modern-icons/rain-day.svg",
    "11d": "/images/modern-icons/thunderstorm.svg",
    "13d": "/images/modern-icons/snow.svg",
    "50d": "/images/modern-icons/fog.svg",

    // Night icons
    "01n": "/images/modern-icons/clear-night.svg",
    "02n": "/images/modern-icons/partly-cloudy-night.svg",
    "03n": "/images/modern-icons/cloudy.svg",
    "04n": "/images/modern-icons/cloudy.svg",
    "09n": "/images/modern-icons/rain.svg",
    "10n": "/images/modern-icons/rain-night.svg",
    "11n": "/images/modern-icons/thunderstorm.svg",
    "13n": "/images/modern-icons/snow.svg",
    "50n": "/images/modern-icons/fog.svg",
  }

  return iconMap[iconCode] || `/images/modern-icons/clear-day.svg`
}

// Weather condition specific colors
export function getWeatherColorClasses(condition: string): { background: string; text: string } {
  switch (condition) {
    case "Clear":
      return {
        background: "from-blue-500 to-blue-300",
        text: "text-white",
      }
    case "Clouds":
      return {
        background: "from-gray-400 to-blue-300",
        text: "text-white",
      }
    case "Rain":
    case "Drizzle":
      return {
        background: "from-gray-600 to-blue-500",
        text: "text-white",
      }
    case "Thunderstorm":
      return {
        background: "from-gray-800 to-purple-700",
        text: "text-white",
      }
    case "Snow":
      return {
        background: "from-blue-100 to-blue-200",
        text: "text-gray-800",
      }
    case "Mist":
    case "Fog":
    case "Haze":
      return {
        background: "from-gray-400 to-gray-300",
        text: "text-white",
      }
    case "Dust":
    case "Smoke":
      return {
        background: "from-yellow-300 to-yellow-200",
        text: "text-gray-800",
      }
    default:
      return {
        background: "from-blue-500 to-blue-300",
        text: "text-white",
      }
  }
}

// Get translated weather condition
export function getWeatherConditionText(condition: string, weatherCode?: number): string {
  // If no weather code, use basic condition
  if (!weatherCode) {
    return condition.charAt(0).toUpperCase() + condition.slice(1)
  }

  // More specific descriptions based on OpenWeatherMap codes
  // https://openweathermap.org/weather-conditions
  if (weatherCode === 800) return "Clear Sky"
  if (weatherCode === 801) return "Few Clouds"
  if (weatherCode === 802) return "Scattered Clouds"
  if (weatherCode === 803) return "Broken Clouds"
  if (weatherCode === 804) return "Overcast Clouds"

  if (weatherCode >= 200 && weatherCode < 300) {
    if (weatherCode >= 210 && weatherCode <= 221) return "Thunderstorm"
    return "Thunderstorm with Rain"
  }

  if (weatherCode >= 300 && weatherCode < 400) return "Drizzle"

  if (weatherCode >= 500 && weatherCode < 600) {
    if (weatherCode === 500) return "Light Rain"
    if (weatherCode === 501) return "Moderate Rain"
    if (weatherCode >= 502 && weatherCode <= 504) return "Heavy Rain"
    if (weatherCode === 511) return "Freezing Rain"
    if (weatherCode >= 520) return "Shower Rain"
    return "Rain"
  }

  if (weatherCode >= 600 && weatherCode < 700) {
    if (weatherCode === 600) return "Light Snow"
    if (weatherCode === 601) return "Snow"
    if (weatherCode === 602) return "Heavy Snow"
    if (weatherCode >= 611 && weatherCode <= 616) return "Sleet"
    if (weatherCode >= 620) return "Shower Snow"
    return "Snow"
  }

  if (weatherCode === 701) return "Mist"
  if (weatherCode === 711) return "Smoke"
  if (weatherCode === 721) return "Haze"
  if (weatherCode === 731 || weatherCode === 761) return "Dust"
  if (weatherCode === 741) return "Fog"
  if (weatherCode === 751) return "Sand"
  if (weatherCode === 762) return "Volcanic Ash"
  if (weatherCode === 771) return "Squalls"
  if (weatherCode === 781) return "Tornado"

  // Fallback to basic condition
  return condition.charAt(0).toUpperCase() + condition.slice(1)
}
