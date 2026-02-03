
/**
 * Copenhagen Institute Provider
 * Type: Climate Think Tank
 * Focus: Climat, énergie, durabilité
 * Innovation: Modèles climatiques hybrides
 */

export class CopenhagenInstituteProvider {
  constructor() {
    this.name = 'Copenhagen Institute';
    this.type = 'Climate Think Tank';
    this.api = 'https://api.copenhageninstitute.dk/data';
    this.specialties = ["climate","energy","sustainability"];
  }

  async search(query, limit = 10) {
    // Implémentation recherche Copenhagen Institute
    try {
      const response = await fetch(`${this.api}/search?q=${query}&limit=${limit}`);
      const data = await response.json();
      
      return data.results.map(item => ({
        id: `${this.name.toLowerCase()}:${item.id}`,
        title: item.title,
        abstract: item.abstract,
        authors: item.authors,
        date: item.publishedAt,
        url: item.url,
        provider: this.name.toLowerCase(),
        type: 'research',
        raw: item,
        innovation: 'Modèles climatiques hybrides'
      }));
    } catch (error) {
      console.error('Error searching Copenhagen Institute:', error);
      return [];
    }
  }

  async getDetails(id) {
    // Implémentation détails
    try {
      const response = await fetch(`${this.api}/details/${id}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting details from Copenhagen Institute:', error);
      return null;
    }
  }
}
