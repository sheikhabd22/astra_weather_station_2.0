import React from "react";

function getWeatherIcon(condition) {
  switch(condition) {
    case "Sunny": return "☀️";
    case "Rainy": return "🌧️";
    case "Cloudy": return "☁️";
    case "Partly Cloudy": return "⛅";
    default: return "🌤️";
  }
}

function mapConditionToVariant(condition) {
  const c = (condition || "").toLowerCase();
  if (c.includes("sun")) return "sunny";
  if (c.includes("rain")) return "rainy";
  if (c.includes("cloud") && c.includes("part")) return "partly";
  if (c.includes("cloud")) return "cloudy";
  return "sunny";
}

function CurrentWeather({ data }) {
  const variant = mapConditionToVariant(data?.condition);

  // Build a wider, more realistic field of raindrops spanning the whole card
  const rainDrops = Array.from({ length: 60 }, (_, i) => {
    const leftPercent = Math.round((i / 59) * 100);
    const durationMs = 900 + (i % 6) * 120; // subtle variety
    const delayMs = -(i % 20) * 80; // staggered starts
    return { leftPercent, durationMs, delayMs };
  });

  return (
    <section className="current-weather glass-panel">
      <div className={`weather-anim ${variant}`}>
        {variant === "sunny" && (
          <>
            <div className="sun" />
            <div className="sun-haze" />
          </>
        )}
        {variant === "partly" && (
          <>
            <div className="sun small" />
            <div className="cloud c1" />
            <div className="cloud c2" />
            <div className="cloud rc1" />
          </>
        )}
        {variant === "cloudy" && (
          <>
            <div className="cloud c1" />
            <div className="cloud c2" />
            <div className="cloud c3" />
            <div className="cloud rc1" />
            <div className="cloud rc2" />
          </>
        )}
        {variant === "rainy" && (
          <div className="rain">
            {rainDrops.map((d, i) => (
              <span
                key={i}
                className="drop"
                style={{ left: `${d.leftPercent}%`, animationDuration: `${d.durationMs}ms`, animationDelay: `${d.delayMs}ms` }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="weather-main-left">
        <span className="weather-bigicon">{getWeatherIcon(data.condition)}</span>
        <div className="main-info">
          <h3 className="city">{data.location}</h3>
          <div className="temp-details">
            <span className="temp">{data.temperature}°C</span>
            <span className="condition">{data.condition}</span>
          </div>
        </div>
      </div>
      <div className="weather-stats">
        <div className="stat-block">
          <span className="label">
            <span className="weather-icon" role="img" aria-label="Air Quality">🫧</span>
            AQI
          </span>
          <span className="stat-value">Moderate</span>
        </div>
        <div className="stat-block">
          <span className="label">
            <span className="weather-icon" role="img" aria-label="Humidity">💧</span>
            Humidity
          </span>
          <span className="stat-value">{data.humidity}%</span>
        </div>
        <div className="stat-block">
          <span className="label">
            <span className="weather-icon" role="img" aria-label="Clock">🕒</span>
            Updated
          </span>
          <span className="stat-value">{data.updated}</span>
        </div>
      </div>
    </section>
  );
}

export default CurrentWeather;
