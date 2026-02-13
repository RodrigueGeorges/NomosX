/**
 * Page Profile - Page de profil utilisateur
 * Suivi de la charte graphique OpenClaw
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileClient } from '@/components/features/user/ProfileClient';
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Profil | NomosX',
  description: 'Gérez votre profil et vos préférences',
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Mon profil
          </h1>
          <p className="text-neutral-600">
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        {/* Profile Content */}
        <Suspense fallback={<div>Chargement de votre profil...</div>}>
          <ProfileClient />
        </Suspense>

        {/* Activity Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Résumé d'activité</CardTitle>
            <CardDescription>
              Vue d'ensemble de votre utilisation de NomosX
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">24</div>
                <div className="text-sm text-neutral-600">Briefs créés</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">156</div>
                <div className="text-sm text-neutral-600">Newsletters envoyées</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">89%</div>
                <div className="text-sm text-neutral-600">Taux d'engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
