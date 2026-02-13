/**
 * Page Settings - Page des paramètres
 * Suivi de la charte graphique OpenClaw
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { SettingsClient } from '@/components/features/user/SettingsClient';
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Paramètres | NomosX',
  description: 'Configurez vos préférences et paramètres',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Paramètres
          </h1>
          <p className="text-neutral-600">
            Configurez vos préférences et paramètres système
          </p>
        </div>

        {/* Settings Content */}
        <Suspense fallback={<div>Chargement des paramètres...</div>}>
          <SettingsClient />
        </Suspense>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>État du système</CardTitle>
            <CardDescription>
              Informations sur l'état actuel de la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Status</span>
                  <span className="text-sm text-accent">Opérationnel</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-sm text-accent">Connectée</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Service</span>
                  <span className="text-sm text-accent">Actif</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Version</span>
                  <span className="text-sm text-neutral-600">v2.1.0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Dernière mise à jour</span>
                  <span className="text-sm text-neutral-600">20/01/2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Uptime</span>
                  <span className="text-sm text-accent">99.9%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
