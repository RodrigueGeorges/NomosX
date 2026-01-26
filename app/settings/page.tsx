/**
 * Settings Page — User Preferences
 * Design Premium : Sections épurées, switches élégants, hiérarchie claire
 */

"use client";

import { useState, useEffect } from "react";
import Shell from "@/components/Shell";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/Toast";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Keyboard,
  Database,
  LogOut,
  Save,
  Trash2
} from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [shortcutsEnabled, setShortcutsEnabled] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email);
    }

    // Load preferences
    const prefs = localStorage.getItem("nomosx_preferences");
    if (prefs) {
      const parsed = JSON.parse(prefs);
      setNotificationsEnabled(parsed.notifications ?? true);
      setShortcutsEnabled(parsed.shortcuts ?? true);
    }
  }, [user]);

  function savePreferences() {
    const prefs = {
      notifications: notificationsEnabled,
      shortcuts: shortcutsEnabled
    };
    localStorage.setItem("nomosx_preferences", JSON.stringify(prefs));
    
    // Update user name
    if (user) {
      const updatedUser = { ...user, name };
      localStorage.setItem("auth_user", JSON.stringify(updatedUser));
    }
    
    toast({ type: "success", title: "Préférences sauvegardées" });
  }

  function clearHistory() {
    if (!confirm("Supprimer tout l'historique des conversations ?")) return;
    localStorage.removeItem("nomosx_conversation_history");
    toast({ type: "success", title: "Historique effacé" });
  }

  function handleLogout() {
    if (confirm("Se déconnecter ?")) {
      logout();
    }
  }

  return (
    <Shell>
      <div className="max-w-3xl mx-auto">
        
        {/* Header Premium */}
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.2)]">
              <SettingsIcon size={28} className="text-purple-400" />
            </div>
            <div>
              <div className="text-xs text-purple-400/60 tracking-[0.25em] uppercase mb-1">
                User Preferences
              </div>
              <h1 className="text-4xl font-light tracking-tight text-white/95">Settings</h1>
            </div>
          </div>
          <p className="text-base text-white/50 leading-relaxed max-w-3xl ml-[4.5rem]">
            Manage your account, preferences, and notifications.
          </p>
        </div>

        <div className="space-y-4">
          
          {/* Profile Section */}
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <User size={18} className="text-cyan-400" />
                <h2 className="text-lg font-semibold text-white">Profil</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Nom d'affichage
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom"
                    className="bg-white/[0.03] border-white/10 focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Email
                  </label>
                  <Input
                    value={email}
                    disabled
                    className="bg-white/[0.02] border-white/10 text-white/40 cursor-not-allowed"
                  />
                  <p className="text-xs text-white/40 mt-1.5">
                    L'email ne peut pas être modifié
                  </p>
                </div>

                <Button 
                  variant="ai" 
                  onClick={savePreferences}
                  className="w-full sm:w-auto"
                >
                  <Save size={16} className="mr-2" />
                  Sauvegarder les modifications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <Bell size={18} className="text-blue-400" />
                <h2 className="text-lg font-semibold text-white">Notifications</h2>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white/80">Notifications de progression</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    Recevoir des alertes sur l'avancement des analyses
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNotificationsEnabled(!notificationsEnabled);
                    setTimeout(savePreferences, 100);
                  }}
                  className={`
                    relative w-11 h-6 rounded-full transition-all
                    ${notificationsEnabled ? 'bg-cyan-500' : 'bg-white/10'}
                  `}
                >
                  <span className={`
                    absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
                    transition-transform duration-200
                    ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}
                  `} />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Keyboard Shortcuts */}
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <Keyboard size={18} className="text-purple-400" />
                <h2 className="text-lg font-semibold text-white">Raccourcis Clavier</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white/80">Activer les raccourcis</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      ⌘K pour focus, ⌘↵ pour générer, etc.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShortcutsEnabled(!shortcutsEnabled);
                      setTimeout(savePreferences, 100);
                    }}
                    className={`
                      relative w-11 h-6 rounded-full transition-all
                      ${shortcutsEnabled ? 'bg-purple-500' : 'bg-white/10'}
                    `}
                  >
                    <span className={`
                      absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white
                      transition-transform duration-200
                      ${shortcutsEnabled ? 'translate-x-5' : 'translate-x-0'}
                    `} />
                  </button>
                </div>

                {shortcutsEnabled && (
                  <div className="pt-3 border-t border-white/10">
                    <p className="text-xs font-medium text-white/50 mb-2">Raccourcis disponibles</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 text-white/40">
                        <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60">⌘K</kbd>
                        <span>Focus input</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60">⌘↵</kbd>
                        <span>Générer</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60">⌘1</kbd>
                        <span>Mode Brief</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-white/60">⌘2</kbd>
                        <span>Mode Council</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card variant="default" className="bg-white/[0.02] border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <Database size={18} className="text-amber-400" />
                <h2 className="text-lg font-semibold text-white">Gestion des données</h2>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                  <p className="text-sm font-medium text-amber-400 mb-1">Effacer l'historique</p>
                  <p className="text-xs text-white/40 mb-3">
                    Supprimer toutes vos conversations et analyses sauvegardées
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearHistory}
                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                  >
                    <Trash2 size={14} className="mr-2" />
                    Effacer l'historique
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card variant="default" className="bg-red-500/5 border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-6">
                <LogOut size={18} className="text-red-400" />
                <h2 className="text-lg font-semibold text-red-400">Zone de danger</h2>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-white/80 mb-1">Déconnexion</p>
                  <p className="text-xs text-white/40 mb-3">
                    Vous serez redirigé vers la page d'accueil
                  </p>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut size={14} className="mr-2" />
                    Se déconnecter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </Shell>
  );
}
