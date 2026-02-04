/**
 * Page Settings - Page des paramètres
 * Suivi de la charte graphique OpenClaw
 */

const {Metadata} = require('next');
const {Suspense} = require('react');
const {SettingsClient} = require('@/components/features/user/SettingsClient');
const {Card,CardContent,CardDescription,CardHeader,CardTitle} = require('@/components/ui/Card');
const {cn} = require('@/lib/utils');

export const metadata: Metadata = {
  title: 'Paramètres | NomosX',
  description: 'Configurez vos préférences et paramètres',
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-8 transition-all duration-200 hover:opacity-80">
      <div className="max-w-4xl mx-auto space-y-8 transition-all duration-200 hover:opacity-80">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2 transition-all duration-200 hover:opacity-80">
            Paramètres
          </h1>
          <p className="text-neutral-600 transition-all duration-200 hover:opacity-80">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-200 hover:opacity-80">
              <div className="space-y-3 transition-all duration-200 hover:opacity-80">
                <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                  <span className="text-sm font-medium transition-all duration-200 hover:opacity-80">API Status</span>
                  <span className="text-sm text-accent transition-all duration-200 hover:opacity-80">Opérationnel</span>
                </div>
                <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                  <span className="text-sm font-medium transition-all duration-200 hover:opacity-80">Database</span>
                  <span className="text-sm text-accent transition-all duration-200 hover:opacity-80">Connectée</span>
                </div>
                <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                  <span className="text-sm font-medium transition-all duration-200 hover:opacity-80">Email Service</span>
                  <span className="text-sm text-accent transition-all duration-200 hover:opacity-80">Actif</span>
                </div>
              </div>
              <div className="space-y-3 transition-all duration-200 hover:opacity-80">
                <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                  <span className="text-sm font-medium transition-all duration-200 hover:opacity-80">Version</span>
                  <span className="text-sm text-neutral-600 transition-all duration-200 hover:opacity-80">v2.1.0</span>
                </div>
                <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                  <span className="text-sm font-medium transition-all duration-200 hover:opacity-80">Dernière mise à jour</span>
                  <span className="text-sm text-neutral-600 transition-all duration-200 hover:opacity-80">20/01/2024</span>
                </div>
                <div className="flex items-center justify-between transition-all duration-200 hover:opacity-80">
                  <span className="text-sm font-medium transition-all duration-200 hover:opacity-80">Uptime</span>
                  <span className="text-sm text-accent transition-all duration-200 hover:opacity-80">99.9%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
