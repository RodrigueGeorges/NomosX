/**
 * Page Plans Billing - Page des plans d'abonnement
 * Suivi de la charte graphique OpenClaw
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import { BillingPlansClient } from '@/components/features/billing/BillingPlansClient';
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Plans d\'abonnement | NomosX',
  description: 'Choisissez le plan d\'abonnement qui correspond à vos besoins',
}

export default function BillingPlansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Plans d'abonnement
          </h1>
          <p className="text-4xl text-neutral-600 max-w-2xl mx-auto">
            Choisissez le plan qui correspond à vos besoins. Tous nos plans incluent l'accès à notre plateforme d'analyse intelligente.
          </p>
        </div>

        {/* Plans Grid */}
        <Suspense fallback={<div>Chargement des plans...</div>}>
          <BillingPlansClient />
        </Suspense>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl text-center">Questions fréquentes</CardTitle>
              <CardDescription className="text-center">
                Tout ce que vous devez savoir sur nos plans d'abonnement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Puis-je changer de plan ?</h4>
                    <p className="text-neutral-600">
                      Oui, vous pouvez passer à un plan supérieur à tout moment. 
                      Les changements prennent effet immédiatement.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Comment puis-je annuler ?</h4>
                    <p className="text-neutral-600">
                      Vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. 
                      L'accès reste actif jusqu'à la fin de la période facturée.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Y a-t-il un engagement ?</h4>
                    <p className="text-neutral-600">
                      Nos plans mensuels sont sans engagement. Les plans annuels bénéficient 
                      d'une réduction mais sont engagés pour 12 mois.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Quelles méthodes de paiement ?</h4>
                    <p className="text-neutral-600">
                      Nous acceptons les cartes de crédit (Visa, Mastercard, American Express) 
                      et les virements bancaires pour les entreprises.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">La facturation est-elle sécurisée ?</h4>
                    <p className="text-neutral-600">
                      Oui, nous utilisons Stripe pour traiter tous les paiements. 
                      Vos informations bancaires ne sont jamais stockées sur nos serveurs.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Puis-je avoir un devis ?</h4>
                    <p className="text-neutral-600">
                      Pour les plans Enterprise et Custom, contactez notre équipe commerciale 
                      pour obtenir un devis personnalisé.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-8 text-white">
            <h2 className="text-4xl font-bold mb-4">
              Prêt à transformer votre analyse ?
            </h2>
            <p className="text-4xl mb-6 opacity-90">
              Rejoignez des centaines d'organisations qui utilisent NomosX 
              pour prendre des décisions éclairées basées sur des données.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-background text-primary px-6 py-3 rounded-md font-semibold hover:bg-neutral-100 transition-colors">
                Commencer l'essai gratuit
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-background hover:text-primary transition-colors">
                Contacter le commercial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
