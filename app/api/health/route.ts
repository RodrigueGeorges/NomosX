const {NextRequest,NextResponse} = require('next/server');
const {prisma} = require('@/lib/db');

/**
 * GET /api/health
 * 
 * Health check endpoint for monitoring
 * Returns system status and key metrics
 */
export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now();

    // Check database connection
    let dbStatus = "healthy";
    let dbLatency = 0;
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
    } catch (error) {
      dbStatus = "unhealthy";
      console.error("[Health] Database check failed:", error);
    }

    // Get basic stats
    const [userCount, publicationCount, verticalCount] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.thinkTankPublication.count({ where: { status: "PUBLISHED" } }).catch(() => 0),
      prisma.vertical.count({ where: { isActive: true } }).catch(() => 0),
    ]);

    const totalLatency = Date.now() - startTime;

    return NextResponse.json({
      status: dbStatus === "healthy" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: "2.0",
      checks: {
        database: {
          status: dbStatus,
          latency: `${dbLatency}ms`,
        },
        api: {
          status: "healthy",
          latency: `${totalLatency}ms`,
        },
      },
      metrics: {
        users: userCount,
        publications: publicationCount,
        verticals: verticalCount,
      },
    });
  } catch (error: any) {
    console.error("[Health] Error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error.message,
      },
      { status: 503 }
    );
  }
}
