import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * GET /api/researchers/status
 * 
 * Returns live status of research council
 * For dashboard visualization
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user subscription for tier-based info
    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: { subscription: true },
    });

    const tier = user?.subscription?.plan || 'ANALYST';

    // Mock researcher data - in production, this would be real-time
    const researchers = [
      {
        id: 'elena-vasquez',
        name: 'Dr. Elena Vasquez',
        initials: 'EV',
        domain: 'Economic Strategy',
        status: 'analyzing',
        currentTask: 'Analyzing Fed policy impact on tech valuations',
        progress: 75,
      },
      {
        id: 'james-chen',
        name: 'Dr. James Chen',
        initials: 'JC',
        domain: 'Technology Policy',
        status: 'debating',
        currentTask: 'Evaluating AI regulation frameworks',
        progress: 45,
      },
      {
        id: 'amara-okonkwo',
        name: 'Dr. Amara Okonkwo',
        initials: 'AO',
        domain: 'Climate Economics',
        status: 'synthesizing',
        currentTask: 'Synthesizing carbon market trends',
        progress: 90,
      },
      {
        id: 'marcus-weber',
        name: 'Dr. Marcus Weber',
        initials: 'MW',
        domain: 'Geopolitical Risk',
        status: 'analyzing',
        currentTask: 'Assessing supply chain disruptions',
        progress: 60,
      },
      {
        id: 'sarah-kim',
        name: 'Dr. Sarah Kim',
        initials: 'SK',
        domain: 'Healthcare Innovation',
        status: 'idle',
        currentTask: 'Available for analysis',
        progress: 0,
      },
      {
        id: 'david-patel',
        name: 'Dr. David Patel',
        initials: 'DP',
        domain: 'Financial Markets',
        status: 'debating',
        currentTask: 'Modeling market volatility scenarios',
        progress: 30,
      },
      {
        id: 'lisa-anderson',
        name: 'Dr. Lisa Anderson',
        initials: 'LA',
        domain: 'Energy Policy',
        status: 'analyzing',
        currentTask: 'Tracking renewable energy adoption',
        progress: 55,
      },
      {
        id: 'roberto-garcia',
        name: 'Dr. Roberto Garcia',
        initials: 'RG',
        domain: 'International Trade',
        status: 'synthesizing',
        currentTask: 'Analyzing trade agreement impacts',
        progress: 80,
      },
    ];

    // For ANALYST/TRIAL users, show limited info
    const filteredResearchers = (tier === 'TRIAL' || tier === 'ANALYST')
      ? researchers.slice(0, 4).map(r => ({
          ...r,
          currentTask: r.domain, // Hide specific tasks
          progress: undefined, // Hide progress
        }))
      : researchers;

    return NextResponse.json({
      researchers: filteredResearchers,
      tier,
      councilActive: tier !== 'TRIAL' && tier !== 'ANALYST',
    });

  } catch (error) {
    console.error('[API/Researchers/Status] Error:', error);
    return NextResponse.json(
      { error: "Failed to fetch researcher status" },
      { status: 500 }
    );
  }
}
