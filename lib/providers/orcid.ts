/**
 * ORCID client for author identity enrichment
 */

import { fetchFromProvider } from '../http-client';
import { env } from '../env';

export interface ORCIDData {
  orcid: string;
  name: string;
  otherNames?: string[];
  biography?: string;
  affiliations?: string[];
  raw: any;
}

export async function getORCIDById(orcid: string): Promise<ORCIDData | null> {
  const cleanOrcid = orcid.replace("https://orcid.org/", "");
  const base = env.ORCID_API;
  const url = `${base}/${cleanOrcid}/person`;
  
  try {
    const data: any = await fetchFromProvider("orcid", url, { 
      timeout: 10000, 
      retries: 2,
      headers: {
        "Accept": "application/json",
      },
    });
    
    const givenName = data?.name?.["given-names"]?.value || "";
    const familyName = data?.name?.["family-name"]?.value || "";
    const name = `${givenName} ${familyName}`.trim();
    
    const otherNames = (data?.["other-names"]?.["other-name"] || [])
      .map((n: any) => n?.content)
      .filter(Boolean);
    
    const biography = data?.biography?.content || null;
    
    // Note: Full employment/affiliation data requires separate API calls
    // For V1, we extract basic info only
    
    return {
      orcid: cleanOrcid,
      name,
      otherNames,
      biography,
      affiliations: [],
      raw: data,
    };
  } catch (error: any) {
    console.error(`[ORCID] Fetch failed for ${cleanOrcid}: ${error.message}`);
    return null;
  }
}
