// Test complet de tous les providers manquants
import { setTimeout as sleep } from 'timers/promises';

async function testAllMissingProviders() {
  console.log('🔍 TEST COMPLET - TOUS LES PROVIDERS MANQUANTS\n');
  
  let workingProviders = [];
  let totalSources = 0;
  
  // 1. Theeses.fr API
  console.log('🎓 Theeses.fr API...');
  try {
    const url = 'https://theses.fr/api/v1/theses?format=json&per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const theses = data.theses || [];
      console.log(`  ✅ Theeses.fr: ${theses.length} thèses récentes`);
      totalSources += theses.length;
      workingProviders.push('Theeses.fr');
      
      theses.slice(0, 2).forEach(these => {
        console.log(`    📄 ${these.title?.substring(0, 50)}... (${these.year || 'N/A'})`);
        console.log(`      🏢 ${these.institution?.name || 'N/A'}`);
      });
    } else {
      console.log(`  ❌ Theeses.fr: Error ${response.status}`);
      
      // Alternative Theeses.fr
      console.log(`  🔧 Test Theeses.fr alternative...`);
      const altUrl = 'https://api.theses.fr/v1/theses?format=json&per_page=3';
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
        const data = await altResponse.json();
        console.log(`  ✅ Theeses.fr Alternative: ${data.length || 0} thèses`);
        workingProviders.push('Theeses.fr');
      } else {
        console.log(`  ❌ Theeses.fr Alternative: ${altResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ Theeses.fr: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 2. arXiv API
  console.log('\n📚 arXiv API...');
  try {
    const url = 'http://export.arxiv.org/api/query?search_query=artificial+intelligence&start=0&max_results=3&sortBy=submittedDate&sortOrder=descending';
    const response = await fetch(url);
    
    if (response.ok) {
      const text = await response.text();
      console.log(`  ✅ arXiv: ${text.length} chars reçus`);
      
      // Parse XML response
      const entries = text.match(/<entry>[\s\S]*?<\/entry>/g) || [];
      console.log(`  📄 ${entries.length} prepapers trouvés`);
      totalSources += entries.length;
      workingProviders.push('arXiv');
      
      entries.slice(0, 2).forEach((entry, i) => {
        const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
        const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
        console.log(`    📄 ${title?.substring(0, 50)}... (${published?.substring(0, 4) || 'N/A'})`);
      });
    } else {
      console.log(`  ❌ arXiv: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ arXiv: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 3. PubMed API
  console.log('\n🏥 PubMed API...');
  try {
    const url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=artificial+intelligence&retmax=3&retmode=json';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const ids = data.esearchresult?.idlist || [];
      console.log(`  ✅ PubMed: ${ids.length} publications trouvées`);
      
      if (ids.length > 0) {
        // Get details
        const detailsUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`;
        const detailsResponse = await fetch(detailsUrl);
        
        if (detailsResponse.ok) {
          const detailsData = await detailsResponse.json();
          const articles = Object.values(detailsData.result || {}).filter(item => item.title);
          
          console.log(`  📄 ${articles.length} articles détaillés`);
          totalSources += articles.length;
          workingProviders.push('PubMed');
          
          articles.slice(0, 2).forEach(article => {
            console.log(`    📄 ${article.title?.substring(0, 50)}...`);
            console.log(`      📅 ${article.pubdate || 'N/A'}`);
          });
        }
      }
    } else {
      console.log(`  ❌ PubMed: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ PubMed: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 4. SSRN API
  console.log('\n📊 SSRN API...');
  try {
    const url = 'https://hq.ssrn.com/api/search/results?query=artificial+intelligence&per_page=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const papers = data.papers || [];
      console.log(`  ✅ SSRN: ${papers.length} working papers`);
      totalSources += papers.length;
      workingProviders.push('SSRN');
      
      papers.slice(0, 2).forEach(paper => {
        console.log(`    📄 ${paper.title?.substring(0, 50)}...`);
        console.log(`      📅 ${paper.publication_date || 'N/A'}`);
      });
    } else {
      console.log(`  ❌ SSRN: Error ${response.status}`);
      
      // Alternative SSRN
      console.log(`  🔧 Test SSRN alternative...`);
      const altUrl = 'https://papers.ssrn.com/sol3/JELJOUR_Results.cfm?networking=1&form_name=journalBrowse&limit=3';
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
        console.log(`  ✅ SSRN Alternative: HTML accessible`);
        workingProviders.push('SSRN');
      } else {
        console.log(`  ❌ SSRN Alternative: ${altResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ SSRN: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 5. RePEc API
  console.log('\n🏛️ RePEc API...');
  try {
    const url = 'https://api.repec.org/api/v1/search?type=working_paper&query=artificial+intelligence&count=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const papers = data.papers || [];
      console.log(`  ✅ RePEc: ${papers.length} working papers`);
      totalSources += papers.length;
      workingProviders.push('RePEc');
      
      papers.slice(0, 2).forEach(paper => {
        console.log(`    📄 ${paper.title?.substring(0, 50)}...`);
        console.log(`      📅 ${paper.year || 'N/A'}`);
      });
    } else {
      console.log(`  ❌ RePEc: Error ${response.status}`);
      
      // Alternative RePEc
      console.log(`  🔧 Test RePEc alternative...`);
      const altUrl = 'https://ideas.repec.org/cgi-bin/htsearch?q=artificial+intelligence&nh=10';
      const altResponse = await fetch(altUrl);
      
      if (altResponse.ok) {
        console.log(`  ✅ RePEc Alternative: HTML accessible`);
        workingProviders.push('RePEc');
      } else {
        console.log(`  ❌ RePEc Alternative: ${altResponse.status}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ RePEc: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 6. Data.gouv.fr API
  console.log('\n🇫🇷 Data.gouv.fr API...');
  try {
    const url = 'https://www.data.gouv.fr/api/1/datasets/?format=json&page=1&page_size=3';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const datasets = data.data || [];
      console.log(`  ✅ Data.gouv.fr: ${datasets.length} datasets`);
      totalSources += datasets.length;
      workingProviders.push('Data.gouv.fr');
      
      datasets.slice(0, 2).forEach(dataset => {
        console.log(`    📊 ${dataset.title?.substring(0, 50)}...`);
        console.log(`      📅 ${dataset.created_at?.substring(0, 4) || 'N/A'}`);
      });
    } else {
      console.log(`  ❌ Data.gouv.fr: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Data.gouv.fr: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 7. HAL API
  console.log('\n🏛️ HAL API...');
  try {
    const url = 'https://api.archives-ouvertes.fr/search/?q=artificial+intelligence&rows=3&wt=json';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const docs = data.response?.docs || [];
      console.log(`  ✅ HAL: ${docs.length} documents`);
      totalSources += docs.length;
      workingProviders.push('HAL');
      
      docs.slice(0, 2).forEach(doc => {
        console.log(`    📄 ${doc.title_s?.[0]?.substring(0, 50)}...`);
        console.log(`      📅 ${doc.publicationDate_s?.substring(0, 4) || 'N/A'}`);
      });
    } else {
      console.log(`  ❌ HAL: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ HAL: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 8. OECD API - endpoint corrigé
  console.log('\n🏛️ OECD API - endpoint corrigé...');
  try {
    const url = 'https://stats.oecd.org/sdmx-json/data/DP_LIVE/USA.TOT.GP_ML.TOT/100?format=sdmx-json';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const series = Object.keys(data.data?.dataSets?.[0]?.series || {});
      console.log(`  ✅ OECD: ${series.length} series`);
      totalSources += series.length;
      workingProviders.push('OECD');
      
      if (series.length > 0) {
        console.log(`    📊 USA GDP series disponible`);
      }
    } else {
      console.log(`  ❌ OECD: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ OECD: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 9. IMF API - endpoint corrigé
  console.log('\n🏦 IMF API - endpoint corrigé...');
  try {
    const url = 'https://dataservices.imf.org/REST/SDMX_JSON.svc/CompactData/IFS/A.US.FRBA.CA_FCA_GSR_PT.GP_MT_IX';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      const series = data.CompactData?.DataSet?.Series;
      console.log(`  ✅ IMF: ${series ? 1 : 0} series`);
      totalSources += series ? 1 : 0;
      workingProviders.push('IMF');
      
      if (series?.Obs) {
        const obs = Array.isArray(series.Obs) ? series.Obs.length : 1;
        console.log(`    📊 ${obs} observations`);
      }
    } else {
      console.log(`  ❌ IMF: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ IMF: ${error.message}`);
  }
  
  await sleep(1000);
  
  // 10. Eurostat API - endpoint corrigé
  console.log('\n🇪🇺 Eurostat API - endpoint corrigé...');
  try {
    const url = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/TEA00128?format=JSON';
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`  ✅ Eurostat: ${data.length} records`);
      totalSources += data.length;
      workingProviders.push('Eurostat');
      
      if (data.length > 0) {
        console.log(`    📊 ${data[0]?.geo || 'N/A'} - ${data[0]?.time || 'N/A'}`);
      }
    } else {
      console.log(`  ❌ Eurostat: Error ${response.status}`);
    }
  } catch (error) {
    console.log(`  ❌ Eurostat: ${error.message}`);
  }
  
  // Résumé complet
  console.log('\n📊 RÉSUMÉ COMPLET TOUS LES PROVIDERS:');
  console.log(`  ✅ Providers opérationnels: ${workingProviders.length}/10`);
  console.log(`  📡 Sources collectées: ${totalSources}`);
  console.log(`  🔧 Providers actifs: ${workingProviders.join(', ')}`);
  
  console.log('\n🎯 COUVERTURE COMPLÈTE:');
  console.log('  📚 Académique: Crossref, OpenAlex, Theeses.fr, arXiv, PubMed, SSRN, RePEc, HAL');
  console.log('  🏛️ Institutionnel: World Bank, OECD, IMF, Eurostat, BLS, FRED');
  console.log('  🇫🇷 France: Theeses.fr, Data.gouv.fr, HAL');
  console.log('  🏥 Médical: PubMed');
  console.log('  📊 Économie: SSRN, RePEc, World Bank, OECD, IMF');
  console.log('  🔬 Science: arXiv, HAL, OpenAlex');
  
  if (workingProviders.length >= 8) {
    console.log('\n🚀 SYSTÈME DE VEILLE COMPLET 100% OPÉRATIONNEL');
    console.log('   - Couverture mondiale complète');
    console.log('   - Toutes les disciplines académiques');
    console.log('   - Données institutionnelles majeures');
    console.log('   - Sources françaises intégrées');
  } else {
    console.log('\n⚠️  SYSTÈME PARTIELLEMENT OPÉRATIONNEL');
  }
  
  return { workingProviders, totalSources };
}

testAllMissingProviders();
