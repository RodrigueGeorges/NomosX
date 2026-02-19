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
  title: 'Subscription | NomosX',
  description: 'Manage your NomosX subscription',
}

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            My Subscription
          </h1>
          <p className="text-neutral-600">
            Manage your subscription and payment information
          </p>
        </div>

        {/* Subscription Details */}
        <Suspense fallback={<div>Loading your subscription...</div>}>
          <SubscriptionClient />
        </Suspense>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              View and download your previous invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-neutral-500">
              <p>No invoices found</p>
              <p className="text-sm mt-2">
                Your invoices will appear here once your first payment is processed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>
              Manage your payment cards and methods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-neutral-500">
              <p>No payment method on file</p>
              <button className="mt-4 text-primary hover:underline transition-all duration-200">
                Add a payment method
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
