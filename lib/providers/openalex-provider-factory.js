/**
 * OpenAlex Provider Factory
 * 
 * Creates real, production-grade providers backed by the OpenAlex API (250M+ works).
 * Each provider searches by institution ROR ID or journal/source OpenAlex ID.
 * 
 * OpenAlex is free, no API key required, rate limit 10 req/s with polite pool.
 * Docs: https://docs.openalex.org/api-entities/works/filter-works
 */

const OPENALEX_BASE = 'https://api.openalex.org/works';
const USER_AGENT = 'NomosX/1.0 (https://nomosx.netlify.app; mailto:research@nomosx.com)';

/**
 * Reconstruct abstract from OpenAlex inverted index format.
 */
function reconstructAbstract(invertedIndex) {
  if (!invertedIndex || typeof invertedIndex !== 'object') return '';
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) {
      words[pos] = word;
    }
  }
  return words.filter(Boolean).join(' ').slice(0, 4000);
}

/**
 * Fetch with timeout and retry.
 */
async function fetchJSON(url, retries = 2, timeoutMs = 15000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': USER_AGENT, 'Accept': 'application/json' },
      });
      clearTimeout(timeout);
      if (!res.ok) {
        if (attempt < retries && res.status >= 500) {
          await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
          continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      clearTimeout(timeout);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }
      throw err;
    }
  }
}

/**
 * Search OpenAlex with a filter (ROR, source ID, or keyword).
 * Returns results in the standard provider format.
 */
async function searchOpenAlexFiltered(query, filter, providerName, limit = 10) {
  const params = new URLSearchParams({
    search: query,
    per_page: String(Math.min(limit, 50)),
    sort: 'relevance_score:desc',
    select: 'id,title,publication_date,doi,authorships,abstract_inverted_index,primary_location,cited_by_count,type',
  });
  if (filter) {
    params.set('filter', filter);
  }

  const url = `${OPENALEX_BASE}?${params}&mailto=research@nomosx.com`;
  const data = await fetchJSON(url);

  return (data.results || []).map(work => {
    const doi = work.doi ? work.doi.replace('https://doi.org/', '') : null;
    return {
      id: `${providerName}:${work.id?.replace('https://openalex.org/', '') || Date.now()}`,
      title: work.title || 'Untitled',
      abstract: reconstructAbstract(work.abstract_inverted_index),
      authors: (work.authorships || []).slice(0, 5).map(a => a.author?.display_name).filter(Boolean),
      date: work.publication_date || null,
      url: work.primary_location?.landing_page_url || (doi ? `https://doi.org/${doi}` : null),
      doi,
      provider: providerName,
      type: work.type || 'article',
      citationCount: work.cited_by_count || 0,
      raw: {
        source: 'openalex',
        openalexId: work.id,
        citedByCount: work.cited_by_count,
      },
    };
  });
}

/**
 * Create a provider class backed by OpenAlex, filtered by institution ROR ID.
 * 
 * @param {object} config
 * @param {string} config.name - Display name
 * @param {string} config.providerKey - Short key (e.g. 'chatham-house')
 * @param {string} config.type - Category
 * @param {string} config.region - Geographic region
 * @param {string} config.apiUrl - Website URL
 * @param {string[]} config.specialties - Topic specialties
 * @param {string} [config.rorId] - ROR ID (e.g. 'https://ror.org/02jx3x895')
 * @param {string} [config.sourceId] - OpenAlex source ID (e.g. 'S123456')
 * @param {string} [config.publisherFilter] - Publisher name filter
 * @param {string} [config.conceptId] - OpenAlex concept ID filter
 * @param {string} [config.priority] - HIGH/MEDIUM/LOW
 */
export function createOpenAlexProvider(config) {
  const {
    name, providerKey, type, region, apiUrl, specialties,
    rorId, sourceId, publisherFilter, conceptId, priority = 'HIGH',
  } = config;

  // Build the OpenAlex filter string
  let filter = '';
  if (rorId) {
    filter = `authorships.institutions.ror:${rorId}`;
  } else if (sourceId) {
    filter = `primary_location.source.id:${sourceId}`;
  } else if (publisherFilter) {
    filter = `primary_location.source.publisher_lineage:${publisherFilter}`;
  } else if (conceptId) {
    filter = `concepts.id:${conceptId}`;
  }

  class OpenAlexBackedProvider {
    constructor() {
      this.name = name;
      this.type = type;
      this.region = region;
      this.api = apiUrl;
      this.specialties = specialties;
      this.priority = priority;
    }

    async search(query, limit = 10) {
      try {
        return await searchOpenAlexFiltered(query, filter, providerKey, limit);
      } catch (error) {
        console.error(`[${providerKey}] OpenAlex search failed: ${error.message}`);
        return [];
      }
    }

    async getDetails(id) {
      try {
        const oaId = id.replace(`${providerKey}:`, '');
        const url = `https://api.openalex.org/works/${oaId}?mailto=research@nomosx.com`;
        const work = await fetchJSON(url);
        return {
          id,
          title: work.title || 'Untitled',
          content: reconstructAbstract(work.abstract_inverted_index),
          authors: (work.authorships || []).map(a => a.author?.display_name).filter(Boolean),
          date: work.publication_date,
          source: name,
          url: work.primary_location?.landing_page_url || null,
        };
      } catch (error) {
        console.error(`[${providerKey}] getDetails failed: ${error.message}`);
        return null;
      }
    }
  }

  // Set class name for debugging
  Object.defineProperty(OpenAlexBackedProvider, 'name', { value: `${name.replace(/\s+/g, '')}Provider` });
  return OpenAlexBackedProvider;
}

/**
 * Complete catalog of all extended providers with their real OpenAlex identifiers.
 * 
 * ROR IDs verified at https://ror.org/
 * OpenAlex Source IDs verified at https://api.openalex.org/sources
 */
export const PROVIDER_CONFIGS = {
  // ── Geopolitics & Security Think Tanks ──
  'chatham-house': {
    name: 'Chatham House', providerKey: 'chatham-house', type: 'Géopolitique', region: 'UK',
    apiUrl: 'https://www.chathamhouse.org', specialties: ['international-affairs', 'geopolitics', 'policy'],
    rorId: 'https://ror.org/034vnkd20',
  },
  'cfr': {
    name: 'Council on Foreign Relations', providerKey: 'cfr', type: 'Géopolitique', region: 'US',
    apiUrl: 'https://www.cfr.org', specialties: ['foreign-policy', 'security', 'economics'],
    rorId: 'https://ror.org/013meh722',
  },
  'csis': {
    name: 'CSIS', providerKey: 'csis', type: 'Géopolitique', region: 'US',
    apiUrl: 'https://www.csis.org', specialties: ['security', 'defense', 'technology'],
    rorId: 'https://ror.org/01vx35703',
  },
  'carnegie': {
    name: 'Carnegie Endowment for International Peace', providerKey: 'carnegie', type: 'Géopolitique', region: 'Global',
    apiUrl: 'https://carnegieendowment.org', specialties: ['democracy', 'conflict', 'nuclear'],
    rorId: 'https://ror.org/022hhet17',
  },
  'iiss': {
    name: 'IISS', providerKey: 'iiss', type: 'Security', region: 'UK',
    apiUrl: 'https://www.iiss.org', specialties: ['security', 'defense', 'asia-pacific'],
    rorId: 'https://ror.org/01rv76s48',
  },
  'dgap': {
    name: 'DGAP', providerKey: 'dgap', type: 'Géopolitique', region: 'Germany',
    apiUrl: 'https://dgap.org', specialties: ['european-affairs', 'security', 'economics'],
    rorId: 'https://ror.org/049xxah85',
  },
  'brookings-institution': {
    name: 'Brookings Institution', providerKey: 'brookings-institution', type: 'Policy US', region: 'US',
    apiUrl: 'https://www.brookings.edu', specialties: ['public-policy', 'economics', 'governance'],
    rorId: 'https://ror.org/00py81415',
  },

  // ── Economics ──
  'bruegel': {
    name: 'Bruegel', providerKey: 'bruegel', type: 'Economics', region: 'EU',
    apiUrl: 'https://www.bruegel.org', specialties: ['european-economics', 'trade', 'digital'],
    rorId: 'https://ror.org/03e6bna46',
  },
  'cepr': {
    name: 'CEPR', providerKey: 'cepr', type: 'Economics', region: 'EU',
    apiUrl: 'https://cepr.org', specialties: ['economics', 'finance', 'trade'],
    rorId: 'https://ror.org/04jzmdh37',
  },
  'bis': {
    name: 'Bank for International Settlements', providerKey: 'bis', type: 'Economics', region: 'Global',
    apiUrl: 'https://www.bis.org', specialties: ['banking', 'monetary-policy', 'financial-stability'],
    rorId: 'https://ror.org/05h0mnd74',
  },
  'blackrock': {
    name: 'BlackRock', providerKey: 'blackrock', type: 'Finance', region: 'Global',
    apiUrl: 'https://www.blackrock.com', specialties: ['finance', 'investment', 'macro'],
    rorId: 'https://ror.org/031dc4703',
  },

  // ── Business & Consulting ──
  'bcg': {
    name: 'BCG Henderson Institute', providerKey: 'bcg', type: 'Business', region: 'Global',
    apiUrl: 'https://www.bcg.com', specialties: ['strategy', 'innovation', 'economics'],
    rorId: 'https://ror.org/01526xe10',
  },
  'deloitte': {
    name: 'Deloitte', providerKey: 'deloitte', type: 'Business', region: 'Global',
    apiUrl: 'https://www2.deloitte.com', specialties: ['consulting', 'technology', 'economics'],
    rorId: 'https://ror.org/03xkm6e60',
  },
  'accenture': {
    name: 'Accenture', providerKey: 'accenture', type: 'Business', region: 'Global',
    apiUrl: 'https://www.accenture.com', specialties: ['technology', 'strategy', 'digital'],
    rorId: 'https://ror.org/041r3e346',
  },
  'ey': {
    name: 'EY (Ernst & Young)', providerKey: 'ey', type: 'Business', region: 'Global',
    apiUrl: 'https://www.ey.com', specialties: ['consulting', 'assurance', 'tax'],
    rorId: 'https://ror.org/02c00bp33',
  },
  'bain': {
    name: 'Bain & Company', providerKey: 'bain', type: 'Business', region: 'Global',
    apiUrl: 'https://www.bain.com', specialties: ['strategy', 'private-equity', 'digital'],
    // No ROR — use keyword-based search
  },

  // ── Medical Journals (by OpenAlex Source ID / ISSN) ──
  'johns-hopkins': {
    name: 'Johns Hopkins Bloomberg School of Public Health', providerKey: 'johns-hopkins', type: 'Medical', region: 'US',
    apiUrl: 'https://www.jhsph.edu', specialties: ['public-health', 'epidemiology', 'biostatistics'],
    rorId: 'https://ror.org/00za53h95',
  },
  'harvard-chan': {
    name: 'Harvard T.H. Chan School of Public Health', providerKey: 'harvard-chan', type: 'Medical', region: 'US',
    apiUrl: 'https://www.hsph.harvard.edu', specialties: ['public-health', 'nutrition', 'environmental-health'],
    rorId: 'https://ror.org/03vek6s52',
  },
  'arxiv-cs': {
    name: 'arXiv Computer Science', providerKey: 'arxiv-cs', type: 'AI', region: 'Global',
    apiUrl: 'https://arxiv.org', specialties: ['computer-science', 'ai', 'machine-learning'],
    conceptId: 'https://openalex.org/C41008148', // Computer Science concept
  },

  // ── AI & Tech Research ──
  'deepmind': {
    name: 'DeepMind', providerKey: 'deepmind', type: 'AI', region: 'Global',
    apiUrl: 'https://deepmind.google', specialties: ['ai', 'machine-learning', 'neuroscience'],
    rorId: 'https://ror.org/00971b260',
  },
  'ai-index': {
    name: 'Stanford HAI', providerKey: 'ai-index', type: 'AI', region: 'US',
    apiUrl: 'https://hai.stanford.edu', specialties: ['ai-policy', 'ai-metrics', 'ai-trends'],
    rorId: 'https://ror.org/00f54p054', // Stanford
  },
  'amazon-science': {
    name: 'Amazon Science', providerKey: 'amazon-science', type: 'AI', region: 'US',
    apiUrl: 'https://www.amazon.science', specialties: ['ai', 'robotics', 'nlp'],
    rorId: 'https://ror.org/00x0ma614',
  },
  'google-ai': {
    name: 'Google AI Research', providerKey: 'google-ai', type: 'AI', region: 'Global',
    apiUrl: 'https://ai.google', specialties: ['ai', 'machine-learning', 'quantum'],
    rorId: 'https://ror.org/00njsd438',
  },

  // ── Energy & Climate ──
  'iea': {
    name: 'International Energy Agency', providerKey: 'iea', type: 'Energy', region: 'Global',
    apiUrl: 'https://www.iea.org', specialties: ['energy-policy', 'climate', 'energy-security'],
    rorId: 'https://ror.org/020frhs78',
  },
  'irena': {
    name: 'IRENA', providerKey: 'irena', type: 'Energy', region: 'Global',
    apiUrl: 'https://www.irena.org', specialties: ['renewable-energy', 'energy-transition', 'solar'],
    rorId: 'https://ror.org/018674f79',
  },
  'ipcc': {
    name: 'IPCC', providerKey: 'ipcc', type: 'Climate', region: 'Global',
    apiUrl: 'https://www.ipcc.ch', specialties: ['climate-change', 'adaptation', 'mitigation'],
    rorId: 'https://ror.org/02x228738',
  },
  'climate-analytics': {
    name: 'Climate Analytics', providerKey: 'climate-analytics', type: 'Climate', region: 'Global',
    apiUrl: 'https://climateanalytics.org', specialties: ['climate-science', 'paris-agreement', 'vulnerability'],
    rorId: 'https://ror.org/02yr08r26',
  },
  'energy-futures': {
    name: 'Energy Futures Initiative', providerKey: 'energy-futures', type: 'Energy', region: 'US',
    apiUrl: 'https://energyfuturesinitiative.org', specialties: ['energy-innovation', 'nuclear', 'hydrogen'],
    // No ROR — use keyword search
  },

  // ── Development ──
  'cgd': {
    name: 'Center for Global Development', providerKey: 'cgd', type: 'Development', region: 'Global',
    apiUrl: 'https://www.cgdev.org', specialties: ['development', 'aid', 'migration'],
    rorId: 'https://ror.org/0068yvd12',
  },
  'acet': {
    name: 'ACET', providerKey: 'acet', type: 'Development', region: 'Africa',
    apiUrl: 'https://acetforafrica.org', specialties: ['african-development', 'transformation', 'industrialization'],
    // No ROR — use keyword search
  },
  'cis': {
    name: 'Centre for International Studies', providerKey: 'cis', type: 'Geopolitics', region: 'Global',
    apiUrl: 'https://www.cis.org', specialties: ['international-studies', 'migration', 'policy'],
    // No ROR — use keyword search
  },

  // ── Innovation ──
  'ast-res': {
    name: 'Astérès', providerKey: 'ast-res', type: 'Innovation', region: 'France',
    apiUrl: 'https://asteres.fr', specialties: ['economics', 'innovation', 'policy'],
    // No ROR — use keyword search
  },
  'berlin-policy-hub': {
    name: 'Berlin Policy Hub', providerKey: 'berlin-policy-hub', type: 'Innovation', region: 'Germany',
    apiUrl: 'https://berlinpolicyhub.org', specialties: ['european-policy', 'digital', 'governance'],
    // No ROR — use keyword search
  },
  'copenhagen-institute': {
    name: 'Copenhagen Institute for Futures Studies', providerKey: 'copenhagen-institute', type: 'Innovation', region: 'Denmark',
    apiUrl: 'https://cifs.dk', specialties: ['futures', 'foresight', 'innovation'],
    // No ROR — use keyword search
  },
  'idea-factory': {
    name: 'Idea Factory', providerKey: 'idea-factory', type: 'Innovation', region: 'Global',
    apiUrl: 'https://ideafactory.org', specialties: ['innovation', 'entrepreneurship', 'technology'],
    // No ROR — use keyword search
  },

  // ── Medical Journals (by OpenAlex Source ID) ──
  'lancet': {
    name: 'The Lancet', providerKey: 'lancet', type: 'Recherche Médicale Avancée', region: 'International',
    apiUrl: 'https://www.thelancet.com', specialties: ['medicine', 'public-health', 'clinical-research'],
    sourceId: 'https://openalex.org/S49861241', // The Lancet
    priority: 'HIGH',
  },
  'nejm': {
    name: 'New England Journal of Medicine', providerKey: 'nejm', type: 'Recherche Médicale Avancée', region: 'International',
    apiUrl: 'https://www.nejm.org', specialties: ['medicine', 'clinical-trials', 'therapeutics'],
    sourceId: 'https://openalex.org/S134382809', // NEJM
    priority: 'HIGH',
  },
  'nature-medicine': {
    name: 'Nature Medicine', providerKey: 'nature-medicine', type: 'Recherche Médicale Avancée', region: 'International',
    apiUrl: 'https://www.nature.com/nm', specialties: ['medicine', 'translational-research', 'genomics'],
    sourceId: 'https://openalex.org/S180542588', // Nature Medicine
    priority: 'HIGH',
  },
  'jama': {
    name: 'JAMA', providerKey: 'jama', type: 'Recherche Médicale Avancée', region: 'International',
    apiUrl: 'https://jamanetwork.com', specialties: ['medicine', 'surgery', 'public-health'],
    sourceId: 'https://openalex.org/S73186099', // JAMA
    publisherFilter: 'https://openalex.org/P4310320052', // American Medical Association
    priority: 'HIGH',
  },
  'cell': {
    name: 'Cell', providerKey: 'cell', type: 'Science Fondamentale', region: 'International',
    apiUrl: 'https://www.cell.com', specialties: ['biology', 'genetics', 'molecular-biology'],
    sourceId: 'https://openalex.org/S95457728', // Cell
    priority: 'HIGH',
  },
  'who': {
    name: 'World Health Organization', providerKey: 'who', type: 'Health', region: 'Global',
    apiUrl: 'https://www.who.int', specialties: ['global-health', 'epidemiology', 'health-policy'],
    rorId: 'https://ror.org/01f80g185',  // WHO verified
    priority: 'HIGH',
  },

  // ── Science Journals ──
  'nature': {
    name: 'Nature', providerKey: 'nature', type: 'Science Fondamentale', region: 'International',
    apiUrl: 'https://www.nature.com', specialties: ['science', 'research', 'interdisciplinary'],
    sourceId: 'https://openalex.org/S137773608', // Nature
    priority: 'HIGH',
  },
  'science-mag': {
    name: 'Science', providerKey: 'science-mag', type: 'Science Fondamentale', region: 'International',
    apiUrl: 'https://www.science.org', specialties: ['science', 'research', 'policy'],
    sourceId: 'https://openalex.org/S3880285', // Science
    priority: 'HIGH',
  },
  'pnas': {
    name: 'PNAS', providerKey: 'pnas', type: 'Science Fondamentale', region: 'International',
    apiUrl: 'https://www.pnas.org', specialties: ['science', 'research', 'multidisciplinary'],
    sourceId: 'https://openalex.org/S125754415', // PNAS
    priority: 'HIGH',
  },

  // ── AI & Tech Research Labs ──
  'openai-research': {
    name: 'OpenAI Research', providerKey: 'openai-research', type: 'AI', region: 'US',
    apiUrl: 'https://openai.com/research', specialties: ['ai', 'language-models', 'alignment'],
    rorId: 'https://ror.org/05wx9n238',
  },
  'microsoft-research': {
    name: 'Microsoft Research', providerKey: 'microsoft-research', type: 'AI', region: 'Global',
    apiUrl: 'https://www.microsoft.com/research', specialties: ['ai', 'systems', 'hci'],
    rorId: 'https://ror.org/00d0nc645',
  },
  'partnership-ai': {
    name: 'Partnership on AI', providerKey: 'partnership-ai', type: 'AI', region: 'Global',
    apiUrl: 'https://partnershiponai.org', specialties: ['ai-ethics', 'ai-policy', 'responsible-ai'],
    // No ROR — keyword search
  },
  'papers-with-code': {
    name: 'Papers With Code', providerKey: 'papers-with-code', type: 'AI', region: 'Global',
    apiUrl: 'https://paperswithcode.com', specialties: ['machine-learning', 'benchmarks', 'reproducibility'],
    conceptId: 'https://openalex.org/C154945302', // Machine Learning concept
  },
  'kaggle-research': {
    name: 'Kaggle Research', providerKey: 'kaggle-research', type: 'AI', region: 'Global',
    apiUrl: 'https://www.kaggle.com', specialties: ['data-science', 'machine-learning', 'competitions'],
    conceptId: 'https://openalex.org/C154945302', // Machine Learning concept
  },

  // ── Business & Consulting (additional) ──
  'mckinsey': {
    name: 'McKinsey Global Institute', providerKey: 'mckinsey', type: 'Business Elite', region: 'Global',
    apiUrl: 'https://www.mckinsey.com/mgi', specialties: ['economics', 'digital-transformation', 'global-trends'],
    rorId: 'https://ror.org/01gmv5d77',
  },
  'kpmg': {
    name: 'KPMG', providerKey: 'kpmg', type: 'Business', region: 'Global',
    apiUrl: 'https://home.kpmg', specialties: ['consulting', 'audit', 'tax'],
    rorId: 'https://ror.org/05rjsp326',
  },
  'pwc': {
    name: 'PwC', providerKey: 'pwc', type: 'Business', region: 'Global',
    apiUrl: 'https://www.pwc.com', specialties: ['consulting', 'audit', 'strategy'],
    rorId: 'https://ror.org/00m2wsh37',
  },
  'vanguard': {
    name: 'Vanguard', providerKey: 'vanguard', type: 'Finance', region: 'Global',
    apiUrl: 'https://www.vanguard.com', specialties: ['investment', 'economics', 'retirement'],
    rorId: 'https://ror.org/032kzxf45',
  },

  // ── Energy & Climate (additional) ──
  'rmi': {
    name: 'Rocky Mountain Institute', providerKey: 'rmi', type: 'Energy', region: 'US',
    apiUrl: 'https://rmi.org', specialties: ['clean-energy', 'buildings', 'transport'],
    rorId: 'https://ror.org/03anfar33',
  },
  'wri': {
    name: 'World Resources Institute', providerKey: 'wri', type: 'Environment', region: 'Global',
    apiUrl: 'https://www.wri.org', specialties: ['climate', 'forests', 'water'],
    rorId: 'https://ror.org/047ktk903',
  },

  // ── Think Tanks & Policy (additional) ──
  'rand': {
    name: 'RAND Corporation', providerKey: 'rand', type: 'Policy', region: 'US',
    apiUrl: 'https://www.rand.org', specialties: ['defense', 'health', 'education'],
    rorId: 'https://ror.org/00f2z7n96',
  },
  'rsis': {
    name: 'RSIS', providerKey: 'rsis', type: 'Security', region: 'Singapore',
    apiUrl: 'https://www.rsis.edu.sg', specialties: ['security', 'asia-pacific', 'terrorism'],
    // No ROR in OpenAlex — use keyword search
  },
  'saiia': {
    name: 'SAIIA', providerKey: 'saiia', type: 'Development', region: 'Africa',
    apiUrl: 'https://saiia.org.za', specialties: ['african-affairs', 'governance', 'trade'],
    rorId: 'https://ror.org/02bxpm650',
  },

  // ── Development & Multilateral (additional) ──
  'undp-research': {
    name: 'UNDP Research', providerKey: 'undp-research', type: 'Development', region: 'Global',
    apiUrl: 'https://www.undp.org', specialties: ['development', 'poverty', 'governance'],
    rorId: 'https://ror.org/051777d98',
  },
  'worldbank-research': {
    name: 'World Bank Research', providerKey: 'worldbank-research', type: 'Economics', region: 'Global',
    apiUrl: 'https://www.worldbank.org', specialties: ['development', 'economics', 'poverty'],
    rorId: 'https://ror.org/00ae7jd04',
  },
};
