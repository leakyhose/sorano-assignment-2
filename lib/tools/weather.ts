import { tool } from "ai";
import { z } from "zod";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

// Default set of daily weather variables that cover the most common forecast needs.
// The LLM can override these when the user asks about specific metrics.
const DEFAULT_DAILY_VARIABLES = [
  "temperature_2m_max",
  "temperature_2m_min",
  "precipitation_sum",
  "windspeed_10m_max",
  "weathercode",
];

export const weatherTool = tool({
  description:
    "Get weather forecast data for a location. Use this when the user asks about weather, temperature, rain, wind, or forecasts for any location.",
  parameters: z.object({
    latitude: z
      .number()
      .min(-90)
      .max(90)
      .describe("Latitude of the location (-90 to 90)"),
    longitude: z
      .number()
      .min(-180)
      .max(180)
      .describe("Longitude of the location (-180 to 180)"),
    forecast_days: z
      .number()
      .int()
      .min(1)
      .max(7)
      .default(3)
      .describe("Number of forecast days (1-7)"),
    daily: z
      .array(z.string())
      .default(DEFAULT_DAILY_VARIABLES)
      .describe(
        "Daily weather variables to fetch, e.g. temperature_2m_max, precipitation_sum, windspeed_10m_max, weathercode"
      ),
  }),
  execute: async ({ latitude, longitude, forecast_days, daily }) => {
    // Build query string, timezone "auto" lets Open-Meteo resolve the
    // correct timezone from the coordinates, so the LLM doesn't need to.
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      forecast_days: forecast_days.toString(),
      daily: daily.join(","),
      timezone: "auto",
    });

    try {
      const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

      // Surface the API error body so the LLM can relay a meaningful message
      if (!response.ok) {
        const body = await response.text();
        return { error: `Open-Meteo API error (${response.status}): ${body}` };
      }

      const data = await response.json();

      // Sanity-check: the daily block should always be present when daily
      // variables are requested. Guard against unexpected response shapes.
      if (!data.daily) {
        return { error: "Unexpected API response: missing daily forecast data" };
      }

      // Return forecast data with units so the LLM can format values correctly
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        elevation: data.elevation,
        timezone: data.timezone,
        daily_units: data.daily_units,
        daily: data.daily,
      };
    } catch (err: unknown) {
      // Covers network failures, DNS errors, timeouts, etc.
      const message = err instanceof Error ? err.message : String(err);
      return { error: `Failed to fetch weather data: ${message}` };
    }
  },
});
