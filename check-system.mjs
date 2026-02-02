import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function checkSystemStatus() {
  console.log('🔍 VÉRIFICATION ÉTAT SYSTÈME NOMOSX\n');
  
  try {
    // Sources
    const sources = await prisma.source.count();
    console.log(`📚 Sources: ${sources}`);
    
    // Signals  
    const signals = await prisma.signal.count();
    console.log(`📡 Signals: ${signals}`);
    
    // Publications
    const publications = await prisma.publication.count();
    console.log(`📄 Publications: ${publications}`);
    
    // Verticals
    const verticals = await prisma.vertical.count();
    console.log(`🎯 Verticals: ${verticals}`);
    
    // Derniers signaux si existants
    if (signals > 0) {
      const recentSignals = await prisma.signal.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { 
          id: true,
          title: true, 
          status: true, 
          createdAt: true,
          type: true
        }
      });
      
      console.log('\n📡 Derniers signaux:');
      recentSignals.forEach(s => {
        console.log(`  - ${s.title} (${s.type}) - ${s.status} - ${s.createdAt}`);
      });
    }
    
    // Dernières publications si existantes
    if (publications > 0) {
      const recentPubs = await prisma.publication.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          type: true,
          status: true,
          createdAt: true
        }
      });
      
      console.log('\n📄 Dernières publications:');
      recentPubs.forEach(p => {
        console.log(`  - ${p.title} (${p.type}) - ${p.status} - ${p.createdAt}`);
      });
    }
    
    console.log('\n✅ Système opérationnel');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSystemStatus();
