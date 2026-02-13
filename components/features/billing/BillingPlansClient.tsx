
"use client";
import React from 'react';
import { useState } from 'react';
/**
 * Billing Plans Client - Composant client pour les plans d'abonnement
 * Suivi de la charte graphique OpenClaw
 */


import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Check,X,Star,Zap,Shield,Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BillingPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  description: string
  features: string[]
  limits: {
    newsletters: number
    briefs: number
    storage: number
    apiCalls: number
    teamMembers: number
  }
  popular?: boolean
  icon: React.ReactNode
}

const billingPlans: BillingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Parfait pour découvrir NomosX',
    features: [
      '3 newsletters par mois',
      '1 brief par mois',
      'Stockage de 1GB',
      'Support communautaire',
      'Accès aux templates de base'
    ],
    limits: {
      newsletters: 3,
      briefs: 1,
      storage: 1024,
      apiCalls: 1000,
      teamMembers: 1
    },
    icon: <Star className="h-6 w-6" />
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 49,
    interval: 'month',
    description: 'Idéal pour les professionnels et petites équipes',
    features: [
      'Newsletters illimitées',
      '10 briefs par mois',
      'Stockage de 50GB',
      'Support prioritaire',
      'Templates premium',
      'Analytics avancées',
      '5 membres d\'équipe'
    ],
    limits: {
      newsletters: -1,
      briefs: 10,
      storage: 51200,
      apiCalls: 10000,
      teamMembers: 5
    },
    popular: true,
    icon: <Zap className="h-6 w-6" />
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    description: 'Pour les grandes organisations',
    features: [
      'Newsletters illimitées',
      'Briefs illimités',
      'Stockage illimité',
      'Support dédié 24/7',
      'Templates personnalisés',
      'Analytics enterprise',
      'Membres d\'équipe illimités',
      'API avancée',
      'SLA garanti',
      'Formation personnalisée'
    ],
    limits: {
      newsletters: -1,
      briefs: -1,
      storage: -1,
      apiCalls: -1,
      teamMembers: -1
    },
    icon: <Shield className="h-6 w-6" />
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 0,
    interval: 'month',
    description: 'Solution sur mesure pour vos besoins spécifiques',
    features: [
      'Toutes les fonctionnalités Enterprise',
      'Développement sur mesure',
      'Intégrations personnalisées',
      'Hébergement dédié',
      'Account manager dédié',
      'Formation sur site',
      'Audit de sécurité',
      'Conformité personnalisée'
    ],
    limits: {
      newsletters: -1,
      briefs: -1,
      storage: -1,
      apiCalls: -1,
      teamMembers: -1
    },
    icon: <Users className="h-6 w-6" />
  }
]

export function BillingPlansClient() {
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month')
  const [selectedPlan, setSelectedPlan] = useState<string>('professional')

  const getPlanPrice = (plan: BillingPlan) => {
    if (plan.id === 'custom') return 'Sur devis'
    if (billingInterval === 'year' && plan.price > 0) {
      const yearlyPrice = plan.price * 12 * 0.8 // 20% de réduction
      return `€${yearlyPrice}/an`
    }
    return plan.price === 0 ? 'Gratuit' : `€${plan.price}/mois`
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    // Ici, ajouter la logique de redirection vers le checkout
    console.log('Plan sélectionné:', planId)
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-neutral-100 rounded-lg p-1 flex">
          <button
            onClick={() => setBillingInterval('month')}
            className={cn(
              'px-4 py-2 rounded-md transition-colors',
              billingInterval === 'month'
                ? 'bg-white text-primary shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={cn(
              'px-4 py-2 rounded-md transition-colors',
              billingInterval === 'year'
                ? 'bg-white text-primary shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            )}
          >
            Annuel <span className="text-green-600 text-sm">-20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {billingPlans.map((plan) => (
          <Card
            key={plan.id}
            className={cn(
              'relative transition-all hover:shadow-lg',
              plan.popular && 'border-primary shadow-lg scale-105',
              selectedPlan === plan.id && 'ring-2 ring-primary'
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-white">
                  Le plus populaire
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2 text-primary">
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="text-3xl font-bold text-primary">
                  {getPlanPrice(plan)}
                </div>
                {plan.id !== 'custom' && billingInterval === 'year' && plan.price > 0 && (
                  <div className="text-sm text-green-600">
                    Économisez €{(plan.price * 12 * 0.2).toFixed(0)}/an
                  </div>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Features List */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-neutral-600">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => handlePlanSelect(plan.id)}
                className={cn(
                  'w-full',
                  plan.popular
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
                )}
                variant={plan.popular ? 'primary' : 'ghost'}
              >
                {plan.id === 'custom' 
                  ? 'Contacter le commercial' 
                  : selectedPlan === plan.id 
                    ? 'Sélectionné' 
                    : plan.price === 0 
                      ? 'Commencer gratuitement' 
                      : 'S\'abonner'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center mb-8">Comparaison des fonctionnalités</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Fonctionnalité</th>
                {billingPlans.map((plan) => (
                  <th key={plan.id} className="text-center p-4">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-neutral-50">
                <td className="p-4 font-medium">Newsletters</td>
                <td className="text-center p-4">3/mois</td>
                <td className="text-center p-4">Illimité</td>
                <td className="text-center p-4">Illimité</td>
                <td className="text-center p-4">Illimité</td>
              </tr>
              <tr className="border-b hover:bg-neutral-50">
                <td className="p-4 font-medium">Briefs</td>
                <td className="text-center p-4">1/mois</td>
                <td className="text-center p-4">10/mois</td>
                <td className="text-center p-4">Illimité</td>
                <td className="text-center p-4">Illimité</td>
              </tr>
              <tr className="border-b hover:bg-neutral-50">
                <td className="p-4 font-medium">Stockage</td>
                <td className="text-center p-4">1GB</td>
                <td className="text-center p-4">50GB</td>
                <td className="text-center p-4">Illimité</td>
                <td className="text-center p-4">Illimité</td>
              </tr>
              <tr className="border-b hover:bg-neutral-50">
                <td className="p-4 font-medium">Support</td>
                <td className="text-center p-4">
                  <Badge variant="outline">Communautaire</Badge>
                </td>
                <td className="text-center p-4">
                  <Badge variant="secondary">Prioritaire</Badge>
                </td>
                <td className="text-center p-4">
                  <Badge className="bg-primary text-white">Dédié 24/7</Badge>
                </td>
                <td className="text-center p-4">
                  <Badge className="bg-primary text-white">Premium</Badge>
                </td>
              </tr>
              <tr className="hover:bg-neutral-50">
                <td className="p-4 font-medium">Membres d\'équipe</td>
                <td className="text-center p-4">1</td>
                <td className="text-center p-4">5</td>
                <td className="text-center p-4">Illimité</td>
                <td className="text-center p-4">Illimité</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
