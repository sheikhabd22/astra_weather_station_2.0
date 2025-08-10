export function describeWmoCode(code) {
  const c = Number(code);
  if (c === 0) return "Sunny";
  if ([1, 2].includes(c)) return "Partly Cloudy";
  if ([3, 45, 48].includes(c)) return "Cloudy";
  if (
    (c >= 51 && c <= 67) ||
    (c >= 61 && c <= 67) ||
    (c >= 80 && c <= 82) ||
    (c >= 95 && c <= 99)
  )
    return "Rainy";
  if (c >= 71 && c <= 86) return "Cloudy";
  return "Partly Cloudy";
}

export async function fetchOpenMeteoWeather({ latitude, longitude, locationLabel }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    // Include precipitation metrics for higher-fidelity "is it raining now" detection
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,precipitation,rain,showers,snowfall,cloud_cover",
    daily: "temperature_2m_max,temperature_2m_min,weather_code",
    timezone: "auto",
    forecast_days: "7",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);
  const data = await res.json();

  const precipitationNow = {
    precipitation: Number(data?.current?.precipitation ?? 0),
    rain: Number(data?.current?.rain ?? 0),
    showers: Number(data?.current?.showers ?? 0),
    snowfall: Number(data?.current?.snowfall ?? 0),
  };

  // Base condition from WMO code
  let condition = describeWmoCode(data.current.weather_code);
  // Override to Rainy if any current precipitation metrics indicate ongoing rain/showers
  if (
    (precipitationNow.rain > 0) ||
    (precipitationNow.showers > 0) ||
    (precipitationNow.precipitation > 0)
  ) {
    condition = "Rainy";
  }

  const now = {
    location: locationLabel ?? `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`,
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    condition,
    updated: new Date().toLocaleTimeString(),
  };

  const days = (data.daily.time || []).map((iso, idx) => {
    const dateObj = new Date(iso);
    const dayName = idx === 0 ? "Today" : dateObj.toLocaleDateString(undefined, { weekday: "long" });
    const dateLabel = dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    return {
      day: dayName,
      date: dateLabel,
      temp: Math.round(data.daily.temperature_2m_max[idx]),
      min: Math.round(data.daily.temperature_2m_min[idx]),
      condition: describeWmoCode(data.daily.weather_code[idx]),
    };
  });

  return { now, forecast: days };
} 

// Fetch recent hourly surface pressure series for a given lat/lon
// Returns arrays of ISO timestamps and corresponding pressure values (hPa)
export async function fetchPressureSeries({ latitude, longitude, pastDays = 2 }) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: "surface_pressure",
    past_days: String(pastDays),
    timezone: "auto",
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo pressure error: ${res.status}`);
  const data = await res.json();

  const labels = (data?.hourly?.time ?? []).map((iso) => new Date(iso));
  const values = (data?.hourly?.surface_pressure ?? []);
  return { labels, values };
}