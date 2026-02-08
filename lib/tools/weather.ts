import { tool } from "ai";
import { z } from "zod";

const OPEN_METEO_BASE_URL = "https://api.open-meteo.com/v1/forecast";

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
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      forecast_days: forecast_days.toString(),
      daily: daily.join(","),
      timezone: "auto",
    });

    try {
      const response = await fetch(`${OPEN_METEO_BASE_URL}?${params}`);

      if (!response.ok) {
        return { error: `Open-Meteo API error: ${response.status} ${response.statusText}` };
      }

      const data = await response.json();
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { error: `Failed to fetch weather data: ${message}` };
    }
  },
});
