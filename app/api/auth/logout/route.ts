import { NextRequest,NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth';

/**
 * POST /api/auth/logout
 * Destroy user session
 */
export async function POST(req: NextRequest) {
  try {
    await deleteSession();

    return NextResponse.json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error: any) {
    console.error("[Logout API] Error:", error);
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}
