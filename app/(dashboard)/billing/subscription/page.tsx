/**
 * Page Subscription Billing - Page de gestion d'abonnement
 * Suivi de la charte graphique OpenClaw
 */

const {Metadata} = require('next');
const {Suspense} = require('react');
const {SubscriptionClient} = require('@/components/features/billing/SubscriptionClient');
const {Card,CardContent,CardDescription,CardHeader,CardTitle} = require('@/components/ui/Card');
const {cn} = require('@/lib/utils');

export const metadata: Metadata = {
  title: 'Abonnement | NomosX',
  description: 'Gérez votre abonnement NomosX',
}

module.exports = function SubscriptionPage;() {
  return (
    <div className="container mx-auto px-4 py-8 transition-all duration-200 hover:opacity-80">
      <div className="max-w-4xl mx-auto space-y-8 transition-all duration-200 hover:opacity-80">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2 transition-all duration-200 hover:opacity-80">
            Mon abonnement
          </h1>
          <p className="text-neutral-600 transition-all duration-200 hover:opacity-80">
            Gérez votre abonnement et vos informations de paiement
          </p>
        </div>

        {/* Subscription Details */}
        <Suspense fallback={<div>Chargement de votre abonnement...</div>}>
          <SubscriptionClient />
        </Suspense>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Historique des factures</CardTitle>
            <CardDescription>
              Consultez et téléchargez vos factures précédentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-neutral-500 transition-all duration-200 hover:opacity-80">
              <p>Aucune facture trouvée</p>
              <p className="text-sm mt-2 transition-all duration-200 hover:opacity-80">
                Vos factures apparaîtront ici dès que votre premier paiement sera traité
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Méthodes de paiement</CardTitle>
            <CardDescription>
              Gérez vos cartes bancaires et méthodes de paiement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-neutral-500 transition-all duration-200 hover:opacity-80">
              <p>Aucune méthode de paiement enregistrée</p>
              <button className="mt-4 text-primary hover:underline transition-all duration-200">
                Ajouter une méthode de paiement
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
