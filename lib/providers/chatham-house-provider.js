/**
 * Chatham House Provider
 * Type: Géopolitique
 * Region: UK
 * API: https://www.chathamhouse.org
 */

export class ChathamHouseProvider {
  constructor() {
    this.name = 'Chatham House';
    this.type = 'Géopolitique';
    this.region = 'UK';
    this.api = 'https://www.chathamhouse.org';
    this.specialties = ["international-affairs","geopolitics","policy"];
  }

  async search(query, limit = 10) {
    try {
      // Simulation de recherche pour Chatham House
      const mockResults = [
        {
          id: 'chatham-house:1',
          title: 'Research from Chatham House',
          abstract: 'Mock abstract from Chatham House',
          authors: ['Research Team'],
          date: new Date().toISOString(),
          url: 'https://www.chathamhouse.org',
          provider: this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
          type: 'research',
          raw: { source: 'Chatham House', mock: true }
        }
      ];
      
      return mockResults.slice(0, limit);
    } catch (error) {
      console.error('Error searching Chatham House:', error);
      return [];
    }
  }

  async getDetails(id) {
    try {
      return {
        id: id,
        title: 'Detailed research from Chatham House',
        content: 'Full content from Chatham House',
        source: 'Chatham House'
      };
    } catch (error) {
      console.error('Error getting details from Chatham House:', error);
      return null;
    }
  }
}
