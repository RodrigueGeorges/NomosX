
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
    description: 'Perfect for discovering NomosX',
    features: [
      '3 newsletters per month',
      '1 brief per month',
      '1GB storage',
      'Community support',
      'Access to basic templates'
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
    description: 'Ideal for professionals and small teams',
    features: [
      'Unlimited newsletters',
      '10 briefs per month',
      '50GB storage',
      'Priority support',
      'Premium templates',
      'Advanced analytics',
      '5 team members'
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
    description: 'For large organizations',
    features: [
      'Unlimited newsletters',
      'Unlimited briefs',
      'Unlimited storage',
      'Dedicated 24/7 support',
      'Custom templates',
      'Enterprise analytics',
      'Unlimited team members',
      'Advanced API',
      'Guaranteed SLA',
      'Personalized training'
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
    description: 'Tailored solution for your specific needs',
    features: [
      'All Enterprise features',
      'Custom development',
      'Custom integrations',
      'Dedicated hosting',
      'Dedicated account manager',
      'On-site training',
      'Security audit',
      'Custom compliance'
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
    if (plan.id === 'custom') return 'Custom quote'
    if (billingInterval === 'year' && plan.price > 0) {
      const yearlyPrice = plan.price * 12 * 0.8
      return `€${yearlyPrice}/year`
    }
    return plan.price === 0 ? 'Free' : `€${plan.price}/month`
  }

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    console.log('Plan selected:', planId)
  }

  return (
    <div className="space-y-8">
      {/* Billing Toggle */}
      <div className="flex justify-center">
        <div className="bg-white/[0.06] rounded-lg p-1 flex">
          <button
            onClick={() => setBillingInterval('month')}
            className={cn(
              'px-4 py-2 rounded-md transition-colors',
              billingInterval === 'month'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white/80'
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingInterval('year')}
            className={cn(
              'px-4 py-2 rounded-md transition-colors',
              billingInterval === 'year'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white/80'
            )}
          >
            Annual <span className="text-green-400 text-sm">-20%</span>
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
                  Most popular
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
                  <div className="text-sm text-green-400">
                    Save €{(plan.price * 12 * 0.2).toFixed(0)}/year
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
                    : 'bg-white/[0.06] text-white/80 hover:bg-white/[0.1]'
                )}
                variant={plan.popular ? 'primary' : 'ghost'}
              >
                {plan.id === 'custom' 
                  ? 'Contact sales' 
                  : selectedPlan === plan.id 
                    ? 'Selected' 
                    : plan.price === 0 
                      ? 'Get started for free' 
                      : 'Subscribe'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Feature</th>
                {billingPlans.map((plan) => (
                  <th key={plan.id} className="text-center p-4">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-white/[0.02]">
                <td className="p-4 font-medium">Newsletters</td>
                <td className="text-center p-4">3/month</td>
                <td className="text-center p-4">Unlimited</td>
                <td className="text-center p-4">Unlimited</td>
                <td className="text-center p-4">Unlimited</td>
              </tr>
              <tr className="border-b hover:bg-white/[0.02]">
                <td className="p-4 font-medium">Briefs</td>
                <td className="text-center p-4">1/month</td>
                <td className="text-center p-4">10/month</td>
                <td className="text-center p-4">Unlimited</td>
                <td className="text-center p-4">Unlimited</td>
              </tr>
              <tr className="border-b hover:bg-white/[0.02]">
                <td className="p-4 font-medium">Storage</td>
                <td className="text-center p-4">1GB</td>
                <td className="text-center p-4">50GB</td>
                <td className="text-center p-4">Unlimited</td>
                <td className="text-center p-4">Unlimited</td>
              </tr>
              <tr className="border-b hover:bg-white/[0.02]">
                <td className="p-4 font-medium">Support</td>
                <td className="text-center p-4">
                  <Badge variant="outline">Community</Badge>
                </td>
                <td className="text-center p-4">
                  <Badge variant="secondary">Priority</Badge>
                </td>
                <td className="text-center p-4">
                  <Badge className="bg-primary text-white">Dedicated 24/7</Badge>
                </td>
                <td className="text-center p-4">
                  <Badge className="bg-primary text-white">Premium</Badge>
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02]">
                <td className="p-4 font-medium">Team members</td>
                <td className="text-center p-4">1</td>
                <td className="text-center p-4">5</td>
                <td className="text-center p-4">Unlimited</td>
                <td className="text-center p-4">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
