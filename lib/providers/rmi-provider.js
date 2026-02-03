/**
 * RMI - Rocky Mountain Institute Provider
 * Type: Énergie Transition
 * Region: US
 * Priority: HIGH
 * API: https://rmi.org/insights
 */

export class RMIProvider {
  constructor() {
    this.name = 'RMI - Rocky Mountain Institute';
    this.type = 'Énergie Transition';
    this.region = 'US';
    this.api = 'https://rmi.org/insights';
    this.specialties = ["energy-efficiency","clean-energy","transportation"];
    this.priority = 'HIGH';
  }

  async search(query, limit = 10) {
    try {
      // Simulation recherche RMI - Rocky Mountain Institute
      const mockResults = [
        {
          id: 'rmi---rocky-mountain-institute:1',
          title: 'Research from RMI - Rocky Mountain Institute',
          abstract: 'Comprehensive research from RMI - Rocky Mountain Institute on ' + query,
          authors: ['Research Team', 'Expert Panel'],
          date: new Date().toISOString(),
          url: 'https://rmi.org/insights',
          provider: this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-'),
          type: 'research',
          raw: { 
            source: 'RMI - Rocky Mountain Institute', 
            type: this.type,
            region: this.region,
            specialties: this.specialties,
            mock: true 
          }
        }
      ];
      
      return mockResults.slice(0, limit);
    } catch (error) {
      console.error('Error searching RMI - Rocky Mountain Institute:', error);
      return [];
    }
  }

  async getDetails(id) {
    try {
      return {
        id: id,
        title: 'Detailed research from RMI - Rocky Mountain Institute',
        content: 'Comprehensive analysis and findings from RMI - Rocky Mountain Institute',
        authors: ['Expert Researchers', 'Analysis Team'],
        date: new Date().toISOString(),
        source: 'RMI - Rocky Mountain Institute',
        type: this.type,
        region: this.region,
        url: 'https://rmi.org/insights'
      };
    } catch (error) {
      console.error('Error getting details from RMI - Rocky Mountain Institute:', error);
      return null;
    }
  }
}
