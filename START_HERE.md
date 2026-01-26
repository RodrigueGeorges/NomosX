# 🚀 START HERE - NomosX Institutional Providers

**3 commandes pour voir ton système en action**

---

## ⚡ ÉTAPE 1 : Build (30 secondes)

```bash
npm run build
```

---

## ⚡ ÉTAPE 2 : Test Complet (2-3 minutes)

```bash
npm run test:complete
```

**Ça va faire** :
- Collecter 80 sources (2 academic + 6 institutional providers)
- Générer un brief HTML complet
- Te montrer que 10/12 sources sont institutionnelles (vs 0 chez competitors)

**Résultat attendu** :
```
✅ TEST COMPLET RÉUSSI

Academic sources: 2
Institutional: 10 🚀

Brief: http://localhost:3000/brief/test-xxx
```

---

## ⚡ ÉTAPE 3 : Voir le Brief (si app lancée)

```bash
# Terminal 1: App
npm run dev

# Terminal 2: Ouvre
http://localhost:3000/brief/test-xxx
```

---

## 📊 CE QUE TU VAS VOIR

Un brief avec **10 sources institutionnelles** :
- CISA advisories (CVEs réels)
- NIST standards
- World Bank reports
- NATO assessments
- ODNI threat intel
- UN reports

**Vs competitors : 0 sources institutionnelles**

---

## 🎯 APRÈS LE TEST

Si ça marche → Lance le monitoring :

```bash
# Monitoring continu 24/7
pm2 start scripts/start-monitoring.mjs --name nomosx-monitoring

# Dashboard temps réel
npm run monitoring:dashboard
```

---

## 📚 DOCS

- `TOUT_EST_PRET.md` → Quick start complet
- `TEST_COMPLETE_GUIDE.md` → Guide détaillé
- `QUICKSTART_MONITORING.md` → Setup monitoring

---

## ✅ C'EST TOUT

```bash
npm run build
npm run test:complete
```

**2-3 minutes → Brief avec 10 sources institutionnelles** 🎯
