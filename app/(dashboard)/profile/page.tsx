/**
 * Page Profile - Page de profil utilisateur
 * Suivi de la charte graphique OpenClaw
 */

const {Metadata} = require('next');
const {Suspense} = require('react');
const {ProfileClient} = require('@/components/features/user/ProfileClient');
const {Card,CardContent,CardDescription,CardHeader,CardTitle} = require('@/components/ui/Card');
const {cn} = require('@/lib/utils');

export const metadata: Metadata = {
  title: 'Profil | NomosX',
  description: 'Gérez votre profil et vos préférences',
}

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 transition-all duration-200 hover:opacity-80">
      <div className="max-w-4xl mx-auto space-y-8 transition-all duration-200 hover:opacity-80">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2 transition-all duration-200 hover:opacity-80">
            Mon profil
          </h1>
          <p className="text-neutral-600 transition-all duration-200 hover:opacity-80">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-200 hover:opacity-80">
              <div className="text-center transition-all duration-200 hover:opacity-80">
                <div className="text-4xl font-bold text-primary mb-2 transition-all duration-200 hover:opacity-80">24</div>
                <div className="text-sm text-neutral-600 transition-all duration-200 hover:opacity-80">Briefs créés</div>
              </div>
              <div className="text-center transition-all duration-200 hover:opacity-80">
                <div className="text-4xl font-bold text-primary mb-2 transition-all duration-200 hover:opacity-80">156</div>
                <div className="text-sm text-neutral-600 transition-all duration-200 hover:opacity-80">Newsletters envoyées</div>
              </div>
              <div className="text-center transition-all duration-200 hover:opacity-80">
                <div className="text-4xl font-bold text-primary mb-2 transition-all duration-200 hover:opacity-80">89%</div>
                <div className="text-sm text-neutral-600 transition-all duration-200 hover:opacity-80">Taux d'engagement</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
