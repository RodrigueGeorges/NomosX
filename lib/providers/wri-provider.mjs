/**
 * WRI - World Resources Institute Provider
 * Type: Climate Research
 * Region: International
 * API: https://www.wri.org
 */

export class WRIProvider {
  constructor() {
    this.name = 'WRI - World Resources Institute';
    this.type = 'Climate Research';
    this.region = 'International';
    this.api = 'https://www.wri.org';
    this.specialties = ["resources","sustainability","climate"];
  }

  async search(query, limit = 10) {
    try {
      // Simulation de recherche pour WRI - World Resources Institute
      const mockResults = [
        {
          id: 'wri---world-resources-institute:1',
          title: 'Research from WRI - World Resources Institute',
          abstract: 'Mock abstract from WRI - World Resources Institute',
          authors: ['Research Team'],
          date: new Date().toISOString(),
          url: 'https://www.wri.org',
          provider: this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
          type: 'research',
          raw: { source: 'WRI - World Resources Institute', mock: true }
        }
      ];
      
      return mockResults.slice(0, limit);
    } catch (error) {
      console.error('Error searching WRI - World Resources Institute:', error);
      return [];
    }
  }

  async getDetails(id) {
    try {
      return {
        id: id,
        title: 'Detailed research from WRI - World Resources Institute',
        content: 'Full content from WRI - World Resources Institute',
        source: 'WRI - World Resources Institute'
      };
    } catch (error) {
      console.error('Error getting details from WRI - World Resources Institute:', error);
      return null;
    }
  }
}
