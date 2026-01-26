/**
 * INSEE client for French economic data
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
const INSEE_INDICATORS = {
  "000857179": { name: "PIB France", unit: "EUR million" },
  "001759970": { name: "IPC France", unit: "Index base 100" },
  "001688579": { name: "Taux de chômage", unit: "%" },
};

export async function fetchINSEESeries(code: string): Promise<MacroSeries | null> {
  const base = env.INSEE_API;
  const url = `${base}/series/${code}`;
  
  try {
    const data: any = await fetchFromProvider("insee", url, { 
      timeout: 20000, 
      retries: 2,
      headers: {
        "Accept": "application/json",
      },
    });
    
    // INSEE series format
    const observations = data?.Obs || [];
    const points: MacroDataPoint[] = observations
      .map((obs: any) => {
        const value = obs?.OBS_VALUE;
        const period = obs?.TIME_PERIOD;
        
        if (value == null || !period) return null;
        
        // Parse period (e.g., "2023-01", "2023-Q1", "2023")
        let date: Date;
        if (period.includes("-")) {
          const [year, month] = period.split("-");
          date = new Date(Number(year), Number(month) - 1, 1);
        } else {
          date = new Date(Number(period), 0, 1);
        }
        
        return { date, value: Number(value) };
      })
      .filter((p: any): p is MacroDataPoint => p !== null);
    
    const metadata = INSEE_INDICATORS[code as keyof typeof INSEE_INDICATORS] || {
      name: code,
      unit: "units",
    };
    
    return {
      provider: "insee",
      code,
      name: metadata.name,
      unit: metadata.unit,
      frequency: data?.Freq || "monthly",
      points,
    };
  } catch (error: any) {
    console.error(`[INSEE] Fetch failed for ${code}: ${error.message}`);
    return null;
  }
}

export async function ingestINSEEIndicators(): Promise<MacroSeries[]> {
  const series: MacroSeries[] = [];
  
  for (const code of Object.keys(INSEE_INDICATORS)) {
    const data = await fetchINSEESeries(code);
    if (data) {
      series.push(data);
    }
  }
  
  return series;
}
