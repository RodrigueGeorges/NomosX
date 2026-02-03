/**
 * WHO - World Health Organization Provider
 * Type: Santé Publique
 * Region: International
 * API: https://www.who.int
 */

export class WHOProvider {
  constructor() {
    this.name = 'WHO - World Health Organization';
    this.type = 'Santé Publique';
    this.region = 'International';
    this.api = 'https://www.who.int';
    this.specialties = ["public-health","global-health","policy"];
  }

  async search(query, limit = 10) {
    try {
      // Simulation de recherche pour WHO - World Health Organization
      const mockResults = [
        {
          id: 'who---world-health-organization:1',
          title: 'Research from WHO - World Health Organization',
          abstract: 'Mock abstract from WHO - World Health Organization',
          authors: ['Research Team'],
          date: new Date().toISOString(),
          url: 'https://www.who.int',
          provider: this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
          type: 'research',
          raw: { source: 'WHO - World Health Organization', mock: true }
        }
      ];
      
      return mockResults.slice(0, limit);
    } catch (error) {
      console.error('Error searching WHO - World Health Organization:', error);
      return [];
    }
  }

  async getDetails(id) {
    try {
      return {
        id: id,
        title: 'Detailed research from WHO - World Health Organization',
        content: 'Full content from WHO - World Health Organization',
        source: 'WHO - World Health Organization'
      };
    } catch (error) {
      console.error('Error getting details from WHO - World Health Organization:', error);
      return null;
    }
  }
}
