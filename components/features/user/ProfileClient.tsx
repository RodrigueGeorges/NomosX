
"use client";
import React from 'react';
import { useState } from 'react';
/**
 * Profile Client - Composant client pour le profil utilisateur
 * Suivi de la charte graphique OpenClaw
 */


import { Card,CardContent,CardDescription,CardHeader,CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '@/components/ui/Textarea';
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger } from '@/components/ui/Dialog';
import { User,Mail,Phone,Building,Calendar,Shield,Bell,Globe,Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserProfile {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  company?: string
  jobTitle?: string
  timezone: string
  language: string
  avatar?: string
  role: 'user' | 'admin' | 'superadmin'
  plan: 'free' | 'professional' | 'enterprise' | 'custom'
  emailVerified: boolean
  createdAt: Date
  lastLoginAt: Date
}

interface NotificationSettings {
  email: boolean
  push: boolean
  newsletter: boolean
  updates: boolean
  security: boolean
  marketing: boolean
}

interface Preferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
  timeFormat: '24h' | '12h'
}

export function ProfileClient() {
  const [profile] = useState<UserProfile>({
    id: 'user_1234567890',
    email: 'jean.dupont@nomosx.ai',
    name: 'Jean Dupont',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '+33 6 12 34 56 78',
    company: 'NomosX Corp',
    jobTitle: 'Directeur de la Recherche',
    timezone: 'Europe/Paris',
    language: 'fr',
    role: 'admin',
    plan: 'professional',
    emailVerified: true,
    createdAt: new Date('2023-01-15'),
    lastLoginAt: new Date('2024-01-20')
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    push: true,
    newsletter: true,
    updates: true,
    security: true,
    marketing: false
  })

  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'system',
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h'
  })

  const [editingProfile, setEditingProfile] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      // Logique de sauvegarde
      await new Promise(resolve => setTimeout(resolve, 1500))
      setEditingProfile(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }))
  }

  const handlePreferenceChange = (key: keyof Preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return 'bg-gray-100 text-gray-800'
      case 'professional':
        return 'bg-blue-100 text-blue-800'
      case 'enterprise':
        return 'bg-purple-100 text-purple-800'
      case 'custom':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'user':
        return 'bg-blue-100 text-blue-800'
      case 'admin':
        return 'bg-orange-100 text-orange-800'
      case 'superadmin':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Gérez vos informations de base
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPlanColor(profile.plan)}>
                {profile.plan.charAt(0).toUpperCase() + profile.plan.slice(1)}
              </Badge>
              <Badge className={getRoleColor(profile.role)}>
                {profile.role === 'superadmin' ? 'Super Admin' : 
                 profile.role === 'admin' ? 'Admin' : 'Utilisateur'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {editingProfile ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  defaultValue={profile.firstName}
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  defaultValue={profile.lastName}
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={profile.email}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  defaultValue={profile.phone}
                  placeholder="Votre numéro de téléphone"
                />
              </div>
              <div>
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  defaultValue={profile.company}
                  placeholder="Votre entreprise"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Poste</Label>
                <Input
                  id="jobTitle"
                  defaultValue={profile.jobTitle}
                  placeholder="Votre poste"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="timezone">Fuseau horaire</Label>
                <Select defaultValue={profile.timezone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Europe/Paris">Europe/Paris</SelectItem>
                    <SelectItem value="America/New_York">America/New_York</SelectItem>
                    <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-neutral-500" />
                  <div>
                    <div className="font-medium">{profile.email}</div>
                    <div className="text-sm text-neutral-600">Email</div>
                  </div>
                  {profile.emailVerified && (
                    <Badge variant="secondary" className="text-green-600">
                      Vérifié
                    </Badge>
                  )}
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-medium">{profile.phone}</div>
                      <div className="text-sm text-neutral-600">Téléphone</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-neutral-500" />
                  <div>
                    <div className="font-medium">{profile.name}</div>
                    <div className="text-sm text-neutral-600">Nom complet</div>
                  </div>
                </div>
                {profile.company && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-neutral-500" />
                    <div>
                      <div className="font-medium">{profile.company}</div>
                      <div className="text-sm text-neutral-600">Entreprise</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-neutral-500" />
                  <div>
                    <div className="font-medium">Membre depuis le {formatDate(profile.createdAt)}</div>
                    <div className="text-sm text-neutral-600">Dernière connexion: {formatDate(profile.lastLoginAt)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3 pt-4 border-t">
            {editingProfile ? (
              <>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button variant="outline" onClick={() => setEditingProfile(false)}>
                  Annuler
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditingProfile(true)}>
                Modifier le profil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Gérez vos préférences de notification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <div className="font-medium capitalize">
                  {key === 'email' ? 'Emails' :
                   key === 'push' ? 'Notifications push' :
                   key === 'newsletter' ? 'Newsletter' :
                   key === 'updates' ? 'Mises à jour produit' :
                   key === 'security' ? 'Alertes de sécurité' :
                   key === 'marketing' ? 'Marketing' : key}
                </div>
                <div className="text-sm text-neutral-600">
                  {key === 'email' ? 'Recevoir des notifications par email' :
                   key === 'push' ? 'Recevoir des notifications push dans le navigateur' :
                   key === 'newsletter' ? 'Recevoir la newsletter hebdomadaire' :
                   key === 'updates' ? 'Être informé des nouvelles fonctionnalités' :
                   key === 'security' ? 'Alertes importantes de sécurité' :
                   key === 'marketing' ? 'Offres promotionnelles et marketing' : ''}
                </div>
              </div>
              <button
                onClick={() => handleNotificationChange(key as keyof NotificationSettings, !value)}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                  value ? "bg-primary" : "bg-neutral-200"
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    value ? "translate-x-6" : "translate-x-1"
                  )}
                />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Préférences
          </CardTitle>
          <CardDescription>
            Personnalisez votre expérience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Thème</Label>
              <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Clair</SelectItem>
                  <SelectItem value="dark">Sombre</SelectItem>
                  <SelectItem value="system">Système</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Langue</Label>
              <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
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
            <div>
              <Label>Format de date</Label>
              <Select value={preferences.dateFormat} onValueChange={(value) => handlePreferenceChange('dateFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">JJ/MM/AAAA</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/JJ/AAAA</SelectItem>
                  <SelectItem value="YYYY-MM-DD">AAAA-MM-JJ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Format d'heure</Label>
              <Select value={preferences.timeFormat} onValueChange={(value) => handlePreferenceChange('timeFormat', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24 heures</SelectItem>
                  <SelectItem value="12h">12 heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité
          </CardTitle>
          <CardDescription>
            Gérez la sécurité de votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Mot de passe</div>
                <div className="text-sm text-neutral-600">Dernière modification: Il y a 3 mois</div>
              </div>
              <Button variant="outline">Modifier</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Authentification à deux facteurs</div>
                <div className="text-sm text-neutral-600">Non configurée</div>
              </div>
              <Button variant="outline">Configurer</Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-medium">Sessions actives</div>
                <div className="text-sm text-neutral-600">3 sessions actives</div>
              </div>
              <Button variant="outline">Gérer</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
