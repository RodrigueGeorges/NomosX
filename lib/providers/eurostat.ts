/**
 * Eurostat client for European macro-economic data
 */

import { fetchFromProvider } from "../http-client";
import { env } from "../env";

export interface MacroDataPoint {
  date: Date;
  value: number;
}

export interface MacroSeries {
  provider: string;
  code: string;
  name: string;
  description?: string;
  unit?: string;
  frequency?: string;
  points: MacroDataPoint[];
}

// Curated indicators for V1
const EUROSTAT_INDICATORS = {
  "nama_10_gdp": { name: "GDP and main components", unit: "EUR million" },
  "prc_hicp_midx": { name: "HICP - Monthly index", unit: "Index 2015=100" },
  "une_rt_m": { name: "Unemployment rate - monthly", unit: "%" },
};

export async function fetchEurostatSeries(code: string): Promise<MacroSeries | null> {
  const base = env.EUROSTAT_API;
  const url = `${base}/${code}`;
  
  try {
    const data: any = await fetchFromProvider("eurostat", url, { timeout: 20000, retries: 2 });
    
    // Eurostat JSON-stat format parsing (simplified for V1)
    const values = data?.value || {};
    const dimensions = data?.dimension || {};
    const timeLabels = dimensions?.time?.category?.label || {};
    
    const points: MacroDataPoint[] = Object.entries(timeLabels)
      .map(([key, label]: [string, any]) => {
        const value = values[key];
        if (value == null) return null;
        
        // Parse time label (e.g., "2023M01", "2023-Q1", "2023")
        let date: Date;
        if (key.includes("M")) {
          const [year, month] = key.split("M");
          date = new Date(Number(year), Number(month) - 1, 1);
        } else if (key.includes("Q")) {
          const [year, quarter] = key.split("Q");
          date = new Date(Number(year), (Number(quarter) - 1) * 3, 1);
        } else {
          date = new Date(Number(key), 0, 1);
        }
        
        return { date, value: Number(value) };
      })
      .filter((p): p is MacroDataPoint => p !== null);
    
    const metadata = EUROSTAT_INDICATORS[code as keyof typeof EUROSTAT_INDICATORS] || {
      name: code,
      unit: "units",
    };
    
    return {
      provider: "eurostat",
      code,
      name: metadata.name,
      unit: metadata.unit,
      frequency: "monthly",
      points,
    };
  } catch (error: any) {
    console.error(`[Eurostat] Fetch failed for ${code}: ${error.message}`);
    return null;
  }
}

export async function ingestEurostatIndicators(): Promise<MacroSeries[]> {
  const series: MacroSeries[] = [];
  
  for (const code of Object.keys(EUROSTAT_INDICATORS)) {
    const data = await fetchEurostatSeries(code);
    if (data) {
      series.push(data);
    }
  }
  
  return series;
}
