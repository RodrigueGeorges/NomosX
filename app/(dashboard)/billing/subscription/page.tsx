/**
 * Page Subscription Billing - Page de gestion d'abonnement
 * Suivi de la charte graphique OpenClaw
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { SubscriptionClient } from '@/components/features/billing/SubscriptionClient';
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Abonnement | NomosX',
  description: 'Gérez votre abonnement NomosX',
}

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Mon abonnement
          </h1>
          <p className="text-neutral-600">
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
            <div className="text-center py-8 text-neutral-500">
              <p>Aucune facture trouvée</p>
              <p className="text-sm mt-2">
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
            <div className="text-center py-8 text-neutral-500">
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
