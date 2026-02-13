
"use client";
import React from 'react';
import { useState } from 'react';
/**
 * Settings Client - Composant client pour les paramètres
 * Suivi de la charte graphique OpenClaw
 */


import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { Badge } from '@/components/ui/Badge';
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger } from '@/components/ui/Dialog';
import { Settings,Database,Mail,Shield,Globe,Bell,Palette,Zap,AlertTriangle,CheckCircle,XCircle,Clock,Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemSettings {
  general: {
    siteName: string
    siteDescription: string
    contactEmail: string
    supportEmail: string
    defaultLanguage: string
    defaultTimezone: string
  }
  email: {
    provider: 'resend' | 'sendgrid' | 'smtp'
    fromEmail: string;
fromName: string
    replyTo: string
    smtpHost?: string
    smtpPort?: number
    smtpUser?: string
    smtpPassword?: string
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    maxLoginAttempts: number
    lockoutDuration: number
    passwordMinLength: number
    requireEmailVerification: boolean
  }
  notifications: {
    emailNotifications: boolean
    pushNotifications: boolean
    newsletterEnabled: boolean
    marketingEmails: boolean
    securityAlerts: boolean
  }
  features: {
    betaFeatures: boolean
    advancedAnalytics: boolean
    customBranding: boolean
    apiAccess: boolean
    integrations: boolean
  }
}

export function SettingsClient() {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'NomosX',
      siteDescription: 'Intelligence Artificielle pour Think Tanks',
      contactEmail: 'contact@nomosx.ai',
      supportEmail: 'support@nomosx.ai',
      defaultLanguage: 'fr',
      defaultTimezone: 'Europe/Paris'
    },
    email: {
      provider: 'resend',
      fromEmail: 'noreply@nomosx.ai',
      fromName: 'NomosX',
      replyTo: 'support@nomosx.ai'
    },
    security: {
      twoFactorEnabled: true,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      passwordMinLength: 8,
      requireEmailVerification: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      newsletterEnabled: true,
      marketingEmails: false,
      securityAlerts: true
    },
    features: {
      betaFeatures: false,
      advancedAnalytics: true,
      customBranding: false,
      apiAccess: true,
      integrations: true
    }
  })

  const [activeTab, setActiveTab] = useState<'general' | 'email' | 'security' | 'notifications' | 'features'>('general')
  const [saving, setSaving] = useState(false)
  const [showRestartDialog, setShowRestartDialog] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Logique de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500))
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleRestart = async () => {
    setShowRestartDialog(false)
    // Logique de redémarrage
    console.log('Restarting system...')
  }

  const updateSetting = (category: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }))
  }

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'features', label: 'Fonctionnalités', icon: Zap }
  ] as const

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 py-2 px-1 border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres généraux</CardTitle>
              <CardDescription>
                Configurez les informations de base de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nom du site</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email de contact</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={settings.general.contactEmail}
                    onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="supportEmail">Email de support</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={settings.general.supportEmail}
                    onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="defaultLanguage">Langue par défaut</Label>
                  <Select value={settings.general.defaultLanguage} onValueChange={(value) => updateSetting('general', 'defaultLanguage', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="siteDescription">Description du site</Label>
                <Textarea
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Email Settings */}
        {activeTab === 'email' && (
          <Card>
            <CardHeader>
              <CardTitle>Configuration email</CardTitle>
              <CardDescription>
                Configurez les paramètres d'envoi d'emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emailProvider">Fournisseur email</Label>
                  <Select value={settings.email.provider} onValueChange={(value) => updateSetting('email', 'provider', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resend">Resend</SelectItem>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="smtp">SMTP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="fromEmail">Email d'envoi</Label>
                  <Input
                    id="fromEmail"
                    type="email"
                    value={settings.email.fromEmail}
                    onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fromName">Nom d'envoi</Label>
                  <Input
                    id="fromName"
                    value={settings.email.fromName}
                    onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="replyTo">Email de réponse</Label>
                  <Input
                    id="replyTo"
                    type="email"
                    value={settings.email.replyTo}
                    onChange={(e) => updateSetting('email', 'replyTo', e.target.value)}
                  />
                </div>
              </div>
              
              {settings.email.provider === 'smtp' && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Configuration SMTP</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="smtpHost">Hôte SMTP</Label>
                      <Input
                        id="smtpHost"
                        value={settings.email.smtpHost || ''}
                        onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                        placeholder="smtp.example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPort">Port SMTP</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.email.smtpPort || ''}
                        onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpUser">Utilisateur SMTP</Label>
                      <Input
                        id="smtpUser"
                        value={settings.email.smtpUser || ''}
                        onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="smtpPassword">Mot de passe SMTP</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.email.smtpPassword || ''}
                        onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-900">Test email</div>
                    <div className="text-sm text-blue-700">Envoyer un email de test pour vérifier la configuration</div>
                  </div>
                </div>
                <Button variant="outline">Envoyer un test</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de sécurité</CardTitle>
              <CardDescription>
                Configurez les options de sécurité de votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Authentification à deux facteurs</div>
                    <div className="text-sm text-neutral-600">Exiger 2FA pour tous les utilisateurs</div>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSetting('security', 'twoFactorEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Vérification email obligatoire</div>
                    <div className="text-sm text-neutral-600">Les utilisateurs doivent vérifier leur email</div>
                  </div>
                  <Switch
                    checked={settings.security.requireEmailVerification}
                    onCheckedChange={(checked) => updateSetting('security', 'requireEmailVerification', checked)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionTimeout">Délai d'expiration de session (heures)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="maxLoginAttempts">Tentatives de connexion max</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={settings.security.maxLoginAttempts}
                    onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="lockoutDuration">Durée de verrouillage (minutes)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    value={settings.security.lockoutDuration}
                    onChange={(e) => updateSetting('security', 'lockoutDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Longueur min. mot de passe</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de notification</CardTitle>
              <CardDescription>
                Configurez les notifications système et marketing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notifications email</div>
                    <div className="text-sm text-neutral-600">Activer les notifications par email</div>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Notifications push</div>
                    <div className="text-sm text-neutral-600">Activer les notifications push</div>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Newsletter</div>
                    <div className="text-sm text-neutral-600">Autoriser les newsletters</div>
                  </div>
                  <Switch
                    checked={settings.notifications.newsletterEnabled}
                    onCheckedChange={(checked) => updateSetting('notifications', 'newsletterEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Emails marketing</div>
                    <div className="text-sm text-neutral-600">Envoyer des emails promotionnels</div>
                  </div>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) => updateSetting('notifications', 'marketingEmails', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Alertes de sécurité</div>
                    <div className="text-sm text-neutral-600">Notifier en cas d'activité suspecte</div>
                  </div>
                  <Switch
                    checked={settings.notifications.securityAlerts}
                    onCheckedChange={(checked) => updateSetting('notifications', 'securityAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feature Settings */}
        {activeTab === 'features' && (
          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités</CardTitle>
              <CardDescription>
                Activez ou désactivez les fonctionnalités de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Fonctionnalités bêta</div>
                    <div className="text-sm text-neutral-600">Accès aux fonctionnalités expérimentales</div>
                  </div>
                  <Switch
                    checked={settings.features.betaFeatures}
                    onCheckedChange={(checked) => updateSetting('features', 'betaFeatures', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Analytics avancés</div>
                    <div className="text-sm text-neutral-600">Rapports détaillés et analyses avancées</div>
                  </div>
                  <Switch
                    checked={settings.features.advancedAnalytics}
                    onCheckedChange={(checked) => updateSetting('features', 'advancedAnalytics', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Branding personnalisé</div>
                    <div className="text-sm text-neutral-600">Personnalisation de l'interface</div>
                  </div>
                  <Switch
                    checked={settings.features.customBranding}
                    onCheckedChange={(checked) => updateSetting('features', 'customBranding', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Accès API</div>
                    <div className="text-sm text-neutral-600">API REST et webhooks</div>
                  </div>
                  <Switch
                    checked={settings.features.apiAccess}
                    onCheckedChange={(checked) => updateSetting('features', 'apiAccess', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Intégrations</div>
                    <div className="text-sm text-neutral-600">Intégrations tierces</div>
                  </div>
                  <Switch
                    checked={settings.features.integrations}
                    onCheckedChange={(checked) => updateSetting('features', 'integrations', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setShowRestartDialog(true)}>
            Redémarrer le système
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
          </Button>
        </div>
      </div>

      {/* Restart Dialog */}
      <Dialog open={showRestartDialog} onOpenChange={setShowRestartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redémarrer le système</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir redémarrer le système ? Cela entraînera une interruption temporaire du service.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Attention</p>
                  <p className="text-yellow-700 mt-1">
                    Le redémarrage prendra environ 2-3 minutes. Pendant ce temps, la plateforme sera inaccessible.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowRestartDialog(false)}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleRestart}>
                Redémarrer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
