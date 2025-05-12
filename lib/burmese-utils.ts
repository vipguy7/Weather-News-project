import type { WeatherCondition } from "./weather-api"

// Map city names to their Burmese translations
export const cityNamesBurmese: Record<string, string> = {
  Yangon: "ရန်ကုန်",
  Mandalay: "မန္တလေး",
  "Nay Pyi Taw": "နေပြည်တော်",
  "New Delhi": "နယူးဒေလီ",
  Bangkok: "ဘန်ကောက်",
  "Chiang Mai": "ချင်းမိုင်",
  "Mae Sot": "မဲဆော့",
}

// Friendly greeting phrases for different times of day
export const greetingsBurmese: Record<string, string[]> = {
  morning: ["မင်္ဂလာနံနက်ခင်းပါ", "နံနက်ခင်း မင်္ဂလာပါ", "နေကောင်းကြပါစေ"],
  night: ["မင်္ဂလာညနေခင်းပါ", "ညနေခင်း မင်္ဂလာပါ", "ညနေစောင်းအချိန် မင်္ဂလာရှိပါစေ"],
}

// Friendly weather descriptions
export const friendlyWeatherDescriptions: Record<WeatherCondition, string[]> = {
  Clear: [
    "ကောင်းကင်ပြာလင်းနေပြီး နေရောင်ခြည် ပြည့်ဝနေပါတယ်",
    "နေရောင်ခြည် ထွန်းလင်းပြီး ရာသီဥတု သာယာနေပါတယ်",
    "မိုးကောင်းကင် ကြည်လင်ပြီး နေသာနေပါတယ်",
  ],
  Clouds: ["မိုးတိမ်တွေ ဖုံးလွှမ်းနေပြီး အေးမြနေပါတယ်", "တိမ်တွေ ထူထပ်နေပေမယ့် မိုးရွာဖွယ် မရှိပါဘူး", "မိုးတိမ်တွေ ရှိနေပေမယ့် ရာသီဥတု သင့်တင့်နေပါတယ်"],
  Rain: ["မိုးရွာသွန်းနေတာမို့ ထီးဆောင်းဖို့ မမေ့ပါနဲ့", "မိုးရွာနေပါတယ်၊ အပြင်ထွက်ရင် ထီးယူသွားဖို့ လိုပါမယ်", "မိုးရွာနေတာမို့ လမ်းတွေ စိုစွတ်နေပါတယ်"],
  Drizzle: [
    "မိုးဖွဲလေးတွေ ရွာနေပါတယ်၊ အပြင်ထွက်ရင် ထီးဆောင်းသင့်ပါတယ်",
    "မိုးဖွဲလေးတွေ ရွာနေပေမယ့် သိပ်မစိုပါဘူး",
    "မိုးဖွဲလေးတွေ ရွာနေတာမို့ လေထီးလေး ယူသွားပါ",
  ],
  Thunderstorm: [
    "မိုးသက်မုန်တိုင်း ဖြစ်ပေါ်နေတာမို့ အပြင်မထွက်သင့်ပါဘူး",
    "မိုးကြိုးပစ်နေတာမို့ အိမ်ထဲမှာပဲ နေပါ",
    "မိုးသည်းထန်စွာရွာပြီး လျှပ်စီးလက်နေပါတယ်၊ သတိထားပါ",
  ],
  Snow: ["နှင်းကျနေတာမို့ နွေးနွေးထွေးထွေး ဝတ်ဆင်ပါ", "နှင်းပွင့်လေးတွေ ကျနေပြီး အလွန်အေးမြနေပါတယ်", "နှင်းကျနေတာမို့ လမ်းတွေ ချော်နိုင်ပါတယ်၊ သတိထားပါ"],
  Mist: [
    "မြူခိုးတွေ ဖုံးလွှမ်းနေတာမို့ မြင်ကွင်း မှုန်ဝါးနေပါတယ်",
    "မြူခိုးတွေကြောင့် ကားမောင်းရင် သတိထားပါ",
    "မြူခိုးတွေ ထူထပ်နေပြီး အမြင်အာရုံ ကန့်သတ်နေပါတယ်",
  ],
  Fog: ["မြူထူထပ်နေတာမို့ ခရီးသွားရင် သတိထားပါ", "မြူထူနေတာမို့ မြင်ကွင်း မှုန်ဝါးနေပါတယ်", "မြူထူထပ်နေတာမို့ ယာဉ်မောင်းရင် အရှိန်လျှော့ပါ"],
  Haze: ["မြူမှုန်တွေ ဖုံးလွှမ်းနေပြီး လေထုညစ်ညမ်းနေပါတယ်", "မြူမှုန်တွေကြောင့် မြင်ကွင်း မှုန်ဝါးနေပါတယ်", "မြူမှုန်တွေ ရှိနေတာမို့ နှာခေါင်းစည်း တပ်သင့်ပါတယ်"],
  Dust: [
    "ဖုန်မှုန့်တွေ လေထဲမှာ ပျံ့နှံ့နေတာမို့ နှာခေါင်းစည်း တပ်ပါ",
    "ဖုန်မှုန့်တွေ များနေတာမို့ အသက်ရှူလမ်းကြောင်း ဂရုစိုက်ပါ",
    "ဖုန်မှုန့်တွေကြောင့် လေထုညစ်ညမ်းနေပါတယ်",
  ],
  Smoke: ["မီးခိုးငွေ့တွေ လေထဲမှာ ရှိနေတာမို့ နှာခေါင်းစည်း တပ်ပါ", "မီးခိုးငွေ့တွေကြောင့် လေထုညစ်ညမ်းနေပါတယ်", "မီးခိုးငွေ့တွေ ရှိနေတာမို့ အပြင်ထွက်ရင် သတိထားပါ"],
}

// Temperature feeling descriptions
export const temperatureDescriptions: Record<string, string[]> = {
  hot: ["အပူချိန်မြင့်နေတာမို့ ရေများများသောက်ပါ", "နွေးနွေးပူပူရှိနေတာမို့ အရိပ်ထဲမှာ နေပါ", "အပူချိန်မြင့်နေတာမို့ နေရောင်ခြည်ဒဏ် သတိထားပါ"],
  warm: ["အပူချိန်သင့်တင့်နေပြီး သက်တောင့်သက်သာ ရှိပါတယ်", "ရာသီဥတု သင့်တင့်နေပြီး အပြင်ထွက်ဖို့ ကောင်းပါတယ်", "အပူချိန်သင့်တင့်နေပြီး နေထိုင်ရ အဆင်ပြေပါတယ်"],
  cool: ["အေးမြနေတာမို့ အကျႌလက်ရှည်လေး ဝတ်သင့်ပါတယ်", "လေအေးလေးတိုက်နေတာမို့ နွေးနွေးထွေးထွေး ဝတ်ပါ", "အပူချိန်နည်းနေတာမို့ ချမ်းလာနိုင်ပါတယ်"],
  cold: ["အလွန်အေးမြနေတာမို့ နွေးနွေးထွေးထွေး ဝတ်ဆင်ပါ", "အပူချိန်အလွန်နိမ့်နေတာမို့ အပြင်ထွက်ရင် ဂရုစိုက်ပါ", "အေးလွန်းနေတာမို့ ဂျာကင်ထူထူလေး ဝတ်ပါ"],
}

// Get temperature category based on actual temperature
export function getTemperatureCategory(temp: number): string {
  if (temp > 30) return "hot"
  if (temp > 25) return "warm"
  if (temp > 15) return "cool"
  return "cold"
}

// Generate a friendly Burmese weather message
export function generateFriendlyBurmeseWeatherMessage(
  city: string,
  condition: WeatherCondition,
  time: string,
  temp: number,
): string {
  // Get Burmese city name or use original if not available
  const cityBurmese = cityNamesBurmese[city] || city

  // Get random greeting for time of day
  const greetings = greetingsBurmese[time] || greetingsBurmese["morning"]
  const greeting = greetings[Math.floor(Math.random() * greetings.length)]

  // Get random weather description
  const weatherDescriptions = friendlyWeatherDescriptions[condition] || friendlyWeatherDescriptions["Clear"]
  const weatherDesc = weatherDescriptions[Math.floor(Math.random() * weatherDescriptions.length)]

  // Get temperature feeling description
  const tempCategory = getTemperatureCategory(temp)
  const tempDescriptions = temperatureDescriptions[tempCategory] || temperatureDescriptions["warm"]
  const tempDesc = tempDescriptions[Math.floor(Math.random() * tempDescriptions.length)]

  // Construct the message with emoji
  return `${greeting}! ${cityBurmese} မြို့မှာ ${weatherDesc}။ အပူချိန် ${temp}°C ရှိပြီး ${tempDesc}။ ကောင်းမွန်သော နေ့တစ်နေ့ ဖြစ်ပါစေ။`
}
