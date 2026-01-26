/**
 * ECB (European Central Bank) client for monetary data
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
const ECB_INDICATORS = {
  "FM.B.U2.EUR.4F.KR.MRR_FR.LEV": { name: "MRO Rate", unit: "%" },
  "ICP.M.U2.N.000000.4.ANR": { name: "HICP Euro Area", unit: "Annual rate %" },
};

export async function fetchECBSeries(code: string): Promise<MacroSeries | null> {
  const base = env.ECB_API;
  const url = `${base}/${code}`;
  
  try {
    const data: any = await fetchFromProvider("ecb", url, { timeout: 20000, retries: 2 });
    
    // ECB SDMX format parsing (simplified for V1)
    // Note: Real implementation would need proper SDMX parser
    const observations = data?.dataSets?.[0]?.series?.["0:0"]?.observations || {};
    
    const points: MacroDataPoint[] = Object.entries(observations)
      .map(([key, value]: [string, any]) => {
        const numValue = Array.isArray(value) ? value[0] : value;
        if (numValue == null) return null;
        
        // Simplified date parsing
        const date = new Date();
        date.setMonth(date.getMonth() - (Object.keys(observations).length - Number(key)));
        
        return { date, value: Number(numValue) };
      })
      .filter((p): p is MacroDataPoint => p !== null);
    
    const metadata = ECB_INDICATORS[code as keyof typeof ECB_INDICATORS] || {
      name: code,
      unit: "units",
    };
    
    return {
      provider: "ecb",
      code,
      name: metadata.name,
      unit: metadata.unit,
      frequency: "monthly",
      points,
    };
  } catch (error: any) {
    console.error(`[ECB] Fetch failed for ${code}: ${error.message}`);
    return null;
  }
}

export async function ingestECBIndicators(): Promise<MacroSeries[]> {
  const series: MacroSeries[] = [];
  
  for (const code of Object.keys(ECB_INDICATORS)) {
    const data = await fetchECBSeries(code);
    if (data) {
      series.push(data);
    }
  }
  
  return series;
}
