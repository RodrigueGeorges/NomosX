
"use client";
import React from 'react';
import { useState } from 'react';
/**
 * Subscription Client - Composant client pour la gestion d'abonnement
 * Suivi de la charte graphique OpenClaw
 */


import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger } from '@/components/ui/Dialog';
import { CreditCard,Download,Trash2,Plus,AlertCircle,CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Subscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  plan: {
    id: string
    name: string
    price: number
    currency: string
    interval: 'month' | 'year'
    features: string[]
  }
  cancelAtPeriodEnd: boolean
}

interface Invoice {
  id: string
  number: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void'
  dueDate: Date
  paidAt?: Date
  pdfUrl?: string
}

interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  brand?: string
  last4?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export function SubscriptionClient() {
  const [subscription] = useState<Subscription>({
    id: 'sub_1234567890',
    status: 'active',
    currentPeriodStart: new Date('2024-01-01'),
    currentPeriodEnd: new Date('2024-02-01'),
    plan: {
      id: 'professional',
      name: 'Professional',
      price: 49,
      currency: 'EUR',
      interval: 'month',
      features: [
        'Newsletters illimitées',
        '10 briefs par mois',
        'Stockage de 50GB',
        'Support prioritaire',
        'Templates premium'
      ]
    },
    cancelAtPeriodEnd: false
  })

  const [invoices] = useState<Invoice[]>([
    {
      id: 'inv_1234567890',
      number: 'INV-2024-001',
      amount: 49,
      currency: 'EUR',
      status: 'paid',
      dueDate: new Date('2024-01-15'),
      paidAt: new Date('2024-01-14'),
      pdfUrl: '/invoices/inv_1234567890.pdf'
    }
  ])

  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1234567890',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true
    }
  ])

  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      case 'past_due':
        return 'bg-yellow-100 text-yellow-800'
      case 'trialing':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif'
      case 'canceled':
        return 'Annulé'
      case 'past_due':
        return 'En retard'
      case 'trialing':
        return 'Période d\'essai'
      default:
        return status
    }
  }

  const handleCancelSubscription = async () => {
    setCancelling(true)
    try {
      // Logique d'annulation
      await new Promise(resolve => setTimeout(resolve, 2000))
      setShowCancelDialog(false)
    } catch (error) {
      console.error('Error cancelling subscription:', error)
    } finally {
      setCancelling(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Abonnement actuel
                <Badge className={getStatusColor(subscription.status)}>
                  {getStatusText(subscription.status)}
                </Badge>
              </CardTitle>
              <CardDescription>
                {subscription.cancelAtPeriodEnd 
                  ? `Votre abonnement sera annulé le ${formatDate(subscription.currentPeriodEnd)}`
                  : `Prochain renouvellement le ${formatDate(subscription.currentPeriodEnd)}`
                }
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formatPrice(subscription.plan.price, subscription.plan.currency)}
              </div>
              <div className="text-sm text-neutral-600">
                par {subscription.plan.interval === 'month' ? 'mois' : 'an'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">{subscription.plan.name}</h4>
            <ul className="space-y-2">
              {subscription.plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" size="sm">
              Changer de plan
            </Button>
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  Annuler l'abonnement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Annuler votre abonnement</DialogTitle>
                  <DialogDescription>
                    Êtes-vous sûr de vouloir annuler votre abonnement ? 
                    Vous continuerez à avoir accès aux fonctionnalités jusqu'à la fin de la période facturée.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Important</p>
                        <p className="text-yellow-700 mt-1">
                          Après l'annulation, vous perdrez l'accès à :
                        </p>
                        <ul className="mt-2 list-disc list-inside text-yellow-700">
                          <li>Newsletters illimitées</li>
                          <li>Briefs personnalisés</li>
                          <li>Support prioritaire</li>
                          <li>Templates premium</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelDialog(false)}
                      disabled={cancelling}
                    >
                      Annuler
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                    >
                      {cancelling ? 'Annulation...' : 'Confirmer l\'annulation'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Méthodes de paiement</CardTitle>
              <CardDescription>
                Gérez vos cartes bancaires et méthodes de paiement
              </CardDescription>
            </div>
            <Button size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-neutral-300" />
              <p>Aucune méthode de paiement enregistrée</p>
              <Button variant="outline" className="mt-4">
                Ajouter une méthode de paiement
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-lg",
                    method.isDefault && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-medium">
                        {method.brand} •••• {method.last4}
                      </div>
                      {method.expiryMonth && method.expiryYear && (
                        <div className="text-sm text-neutral-600">
                          Expire {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                        </div>
                      )}
                    </div>
                    {method.isDefault && (
                      <Badge variant="secondary">Par défaut</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button variant="outline" size="sm">
                        Définir par défaut
                      </Button>
                    )}
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des factures</CardTitle>
          <CardDescription>
            Consultez et téléchargez vos factures précédentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              <p>Aucune facture trouvée</p>
              <p className="text-sm mt-2">
                Vos factures apparaîtront ici dès que votre premier paiement sera traité
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{invoice.number}</div>
                    <div className="text-sm text-neutral-600">
                      {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-medium">
                        {formatPrice(invoice.amount, invoice.currency)}
                      </div>
                      <Badge
                        className={cn(
                          "text-xs",
                          invoice.status === 'paid'
                            ? "bg-green-100 text-green-800"
                            : invoice.status === 'open'
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        )}
                      >
                        {invoice.status === 'paid' ? 'Payée' : 
                         invoice.status === 'open' ? 'En attente' : invoice.status}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
