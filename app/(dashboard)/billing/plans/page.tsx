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
  title: 'Subscription Plans | NomosX',
  description: 'Choose the subscription plan that fits your needs',
}

export default function BillingPlansPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Subscription Plans
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Choose the plan that fits your needs. All our plans include access to our intelligent analysis platform.
          </p>
        </div>

        {/* Plans Grid */}
        <Suspense fallback={<div>Loading plans...</div>}>
          <BillingPlansClient />
        </Suspense>

        {/* FAQ Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Frequently Asked Questions</CardTitle>
              <CardDescription className="text-center">
                Everything you need to know about our subscription plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Can I change my plan?</h4>
                    <p className="text-neutral-600">
                      Yes, you can upgrade to a higher plan at any time. 
                      Changes take effect immediately.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How can I cancel?</h4>
                    <p className="text-neutral-600">
                      You can cancel your subscription at any time from your dashboard. 
                      Access remains active until the end of the billing period.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Is there a commitment?</h4>
                    <p className="text-neutral-600">
                      Monthly plans have no commitment. Annual plans benefit from 
                      a discount but are committed for 12 months.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What payment methods are accepted?</h4>
                    <p className="text-neutral-600">
                      We accept credit cards (Visa, Mastercard, American Express) 
                      and bank transfers for businesses.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Is billing secure?</h4>
                    <p className="text-neutral-600">
                      Yes, we use Stripe to process all payments. 
                      Your banking information is never stored on our servers.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I get a quote?</h4>
                    <p className="text-neutral-600">
                      For Enterprise and Custom plans, contact our sales team 
                      to get a personalized quote.
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
            <h2 className="text-2xl font-bold mb-4">
              Ready to transform your analysis?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join hundreds of organizations using NomosX 
              to make informed, data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-background text-primary px-6 py-3 rounded-md font-semibold hover:bg-neutral-100 transition-colors">
                Start free trial
              </button>
              <button className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-background hover:text-primary transition-colors">
                Contact sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
