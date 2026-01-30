# Instructions de Test Manuel — Flow Complet

**Email de test**: rodrigue.etifier@gmail.com

---

## 🎯 **OBJECTIF**

Tester le flow complet :
1. Signup → Onboarding → Dashboard
2. Sélection verticals
3. Réception email hebdomadaire

---

## 📋 **PRÉREQUIS**

### **1. Variables d'environnement configurées sur Netlify**
```bash
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
JWT_SECRET=...
PASSWORD_SALT=...
RESEND_API_KEY=re_...  # CRITIQUE pour email
EMAIL_FROM=briefs@nomosx.com
CRON_SECRET=...
NEXT_PUBLIC_APP_URL=https://nomosx.com
```

### **2. Database migrée**
```bash
npx prisma db push
npx prisma generate
```

### **3. Site déployé sur Netlify**
- Build réussi
- Fonctions serverless actives

---

## 🧪 **MÉTHODE 1 : Test Manuel via Interface**

### **Étape 1 : Signup**
1. Aller sur https://nomosx.com
2. Cliquer "Sign In"
3. Toggle vers "Create account"
4. Remplir :
   - Email : `rodrigue.etifier@gmail.com`
   - Password : `TestPassword123!`
   - Name : `Rodrigue Test`
5. Cliquer "Create account"

**Résultat attendu** :
- ✅ AuthModal se ferme
- ✅ OnboardingModal s'ouvre automatiquement
- ✅ Logo NomosX visible (SVG gradient)

---

### **Étape 2 : Onboarding**
1. OnboardingModal affiche les verticals
2. 3 verticals pré-sélectionnés (top 3)
3. Toggle d'autres verticals si souhaité
4. Cliquer "Continue to Dashboard"

**Résultat attendu** :
- ✅ Modal se ferme
- ✅ Redirect vers `/dashboard`
- ✅ Dashboard affiche "Your Intelligence Desk"
- ✅ Bouton "Manage Preferences" visible en haut à droite

---

### **Étape 3 : Vérifier Preferences**
1. Cliquer "Manage Preferences" (dashboard header)
2. Vérifier verticals sélectionnés
3. Vérifier "Receive weekly briefs by email" = ON
4. Vérifier "Delivery frequency" = WEEKLY

**Résultat attendu** :
- ✅ Page `/dashboard/preferences` s'affiche
- ✅ Verticals sélectionnés ont check icon cyan
- ✅ Email toggle = ON
- ✅ Frequency = WEEKLY

---

### **Étape 4 : Déclencher Email Manuellement**

**Option A : Via cURL (recommandé)**
```bash
curl -X POST https://nomosx.com/api/cron/weekly-briefs \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

**Option B : Via Netlify Functions**
1. Aller sur Netlify Dashboard
2. Functions → weekly-briefs
3. Trigger manually

**Résultat attendu** :
```json
{
  "success": true,
  "stats": {
    "totalUsers": 1,
    "sent": 1,
    "skipped": 0,
    "failed": 0
  }
}
```

---

### **Étape 5 : Vérifier Email**
1. Ouvrir Gmail : rodrigue.etifier@gmail.com
2. Chercher email de "briefs@nomosx.com"
3. Subject : "Your Weekly Intelligence Brief · [Date]"

**Vérifier dans l'email** :
- ✅ Logo NomosX (SVG avec gradient)
- ✅ "Nomos**X**" avec X en cyan
- ✅ Date range (Week of ...)
- ✅ Greeting personnalisé ("Hi Rodrigue Test,")
- ✅ Verticals sélectionnés affichés (tags cyan)
- ✅ Briefs groupés par vertical
- ✅ Trust score badges (vert)
- ✅ Boutons "Read Full Brief" (gradient cyan-blue)
- ✅ Footer avec liens (Manage Preferences, Unsubscribe)
- ✅ Dark theme (#0B0B0D background)

---

## 🧪 **MÉTHODE 2 : Test Automatisé via Script**

### **1. Installer dépendances**
```bash
npm install -D tsx
```

### **2. Configurer variables locales**
```bash
# .env.local
NEXT_PUBLIC_APP_URL=https://nomosx.com
CRON_SECRET=your-cron-secret
```

### **3. Exécuter script**
```bash
npx tsx scripts/test-user-flow.ts
```

**Résultat attendu** :
```
🧪 Starting Complete User Flow Test

📧 Test Email: rodrigue.etifier@gmail.com
🌐 Base URL: https://nomosx.com

1️⃣ Testing Registration...
✅ Registration successful: rodrigue.etifier@gmail.com

2️⃣ Fetching Available Verticals...
✅ Found 8 verticals
📋 Selected verticals: AI Policy, Climate, Economics

3️⃣ Saving User Preferences...
✅ Preferences saved successfully

4️⃣ Triggering Weekly Email Delivery...
✅ Email delivery triggered: { sent: 1, skipped: 0, failed: 0 }

5️⃣ Verifying User Preferences...
✅ Preferences verified:
   - Email enabled: true
   - Email frequency: WEEKLY
   - Verticals selected: 3

✅ ✅ ✅ COMPLETE USER FLOW TEST PASSED ✅ ✅ ✅

📧 Check your email at: rodrigue.etifier@gmail.com
⏰ Email should arrive on next Monday at 8am UTC

🎉 All systems operational!
```

---

## 🐛 **TROUBLESHOOTING**

### **Problème : Email non reçu**

**Vérifier** :
1. RESEND_API_KEY configuré dans Netlify ?
2. EMAIL_FROM = email vérifié dans Resend ?
3. Logs Netlify Functions → Erreurs ?
4. Spam folder Gmail ?

**Debug** :
```bash
# Vérifier logs Netlify
netlify functions:log weekly-briefs

# Tester Resend API directement
curl https://api.resend.com/emails \
  -H "Authorization: Bearer YOUR_RESEND_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "briefs@nomosx.com",
    "to": "rodrigue.etifier@gmail.com",
    "subject": "Test",
    "html": "<p>Test email</p>"
  }'
```

---

### **Problème : Onboarding ne s'ouvre pas**

**Vérifier** :
1. AuthModal a bien `onSignupSuccess` prop ?
2. Console browser → Erreurs JS ?
3. `/api/user/verticals` retourne des données ?

**Debug** :
```javascript
// Console browser
fetch('/api/user/verticals')
  .then(r => r.json())
  .then(console.log)
```

---

### **Problème : Preferences ne se sauvent pas**

**Vérifier** :
1. Database schema migré ? (`npx prisma db push`)
2. Table `UserVerticalPreference` existe ?
3. Logs API `/api/user/preferences` ?

**Debug** :
```sql
-- Vérifier dans database
SELECT * FROM "UserVerticalPreference" 
WHERE "userId" = (SELECT id FROM "User" WHERE email = 'rodrigue.etifier@gmail.com');
```

---

## ✅ **CHECKLIST DE VALIDATION**

### **Frontend**
- [ ] Logo NomosX identique partout (homepage, nav, email, onboarding)
- [ ] Couleurs cohérentes (#0B0B0D, #00D4FF, gradients)
- [ ] Typography Space Grotesk
- [ ] Animations fluides (fade-in, hover)
- [ ] Responsive mobile

### **Backend**
- [ ] Signup fonctionne
- [ ] Session créée (JWT cookie)
- [ ] Verticals chargés
- [ ] Preferences sauvées
- [ ] Email envoyé

### **Email**
- [ ] Logo SVG visible
- [ ] Dark theme
- [ ] Briefs groupés par vertical
- [ ] Trust scores affichés
- [ ] Liens fonctionnent (Read Brief, Preferences, Unsubscribe)

---

## 🎯 **RÉSULTAT ATTENDU**

**Score** : 10/10 si tous les checks passent

**Email reçu** :
- ✅ Design premium (logo, dark theme, gradient)
- ✅ Contenu personnalisé (verticals sélectionnés)
- ✅ Briefs récents (dernière semaine)
- ✅ Liens fonctionnels

**Flow complet** :
- ✅ Signup → Onboarding → Dashboard → Email
- ✅ Fluide, professionnel, cohérent
- ✅ Aucune erreur

---

## 📧 **CONTACT**

Si problème, vérifier :
1. Logs Netlify Functions
2. Database (Prisma Studio)
3. Resend Dashboard (email delivery logs)

**Email de test** : rodrigue.etifier@gmail.com  
**Next email delivery** : Lundi 8h UTC (automatique)
