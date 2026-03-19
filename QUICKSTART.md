# 🚀 Guide de démarrage rapide

Ce guide te permet de démarrer en 10 minutes.

---

## ⚡ Installation rapide (5 min)

### 1. Cloner et installer

```bash
cd "/Users/tristanmonteiro/1. Projects/Code/Git-TM/wondrous-alpaca-a225c4"
npm install
```

### 2. Configurer les clés

```bash
cp .env.example .env
```

Édite `.env` avec tes vraies clés :

```env
# Stripe (Dashboard → API Keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Obtenu avec 'stripe listen'
STRIPE_PRODUCT_ID=prod_...       # ID de ton produit

# Auth0 (Dashboard → Applications → M2M App)
AUTH0_M2M_CLIENT_ID=...
AUTH0_M2M_CLIENT_SECRET=...

# SendGrid (Dashboard → Settings → API Keys)
SENDGRID_API_KEY=SG....
EMAIL_FROM=ton-email@example.com

# Site
ROOT_URL=http://localhost:8888
```

### 3. Vérifier que tout est OK

```bash
./test-local.sh
```

Si tout est vert ✅, tu peux lancer le site !

---

## 🎯 Lancement local (2 min)

### Terminal 1 : Site

```bash
netlify dev
```

Le site sera accessible sur http://localhost:8888

### Terminal 2 : Webhooks Stripe (optionnel)

```bash
stripe listen --forward-to localhost:8888/.netlify/functions/send_credentials
```

Copie le webhook secret (`whsec_...`) et mets-le dans `.env`

---

## 🧪 Test complet (3 min)

### 1. Créer un compte test

Va sur http://localhost:8888 et clique sur le bouton de paiement.

Utilise la carte test Stripe :
- Numéro : `4242 4242 4242 4242`
- Date : n'importe quelle date future
- CVC : n'importe quel code à 3 chiffres

### 2. Vérifier les emails

Tu devrais recevoir :
- ✅ Un email avec tes credentials (toi)
- ✅ Un email de notification admin (maud@gmail.com)

### 3. Te connecter

Va sur http://localhost:8888/login/ et connecte-toi avec les credentials reçus.

### 4. Tester le mot de passe oublié

Sur la page login, clique sur "Mot de passe oublié ?" et entre ton email.
Tu devrais recevoir un email Auth0 pour réinitialiser.

---

## 📚 Documentation complète

Pour plus de détails, consulte :

- **`TECHNICAL_README.md`** - Documentation technique complète
- **`SENDGRID_GUIDE.md`** - Configuration SendGrid avec templates
- **`CHANGELOG.md`** - Liste de toutes les améliorations

---

## 🚢 Déploiement sur Netlify

### 1. Commiter et pousser

```bash
git add .
git commit -m "feat: amélioration système auth + sendgrid + notifications"
git push
```

### 2. Connecter à Netlify

1. Va sur [app.netlify.com](https://app.netlify.com)
2. New site from Git → Choisis ton repo
3. Deploy settings : laisse par défaut
4. Deploy

### 3. Ajouter les variables d'environnement

Site settings → Environment variables → Add variables

Copie toutes les variables de ton `.env` :
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRODUCT_ID`
- `AUTH0_M2M_CLIENT_ID`
- `AUTH0_M2M_CLIENT_SECRET`
- `SENDGRID_API_KEY`
- `EMAIL_FROM`
- `ROOT_URL` (change pour ton URL Netlify : `https://ton-site.netlify.app`)
- `SENDGRID_TEMPLATE_CREDENTIALS` (optionnel)

### 4. Configurer le webhook Stripe en production

1. Va sur [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint
3. URL : `https://ton-site.netlify.app/.netlify/functions/send_credentials`
4. Events : Sélectionne `checkout.session.completed`
5. Copie le Signing Secret et mets-le dans Netlify env vars

### 5. Redéployer

Triggers → Deploy site

---

## ✅ Checklist de mise en production

Avant de lancer :

- [ ] Variables d'environnement configurées sur Netlify
- [ ] Webhook Stripe configuré en production
- [ ] Email expéditeur vérifié dans SendGrid
- [ ] Template SendGrid créé (optionnel)
- [ ] Auth0 Grant Types activés (Password + Client Credentials)
- [ ] Test d'achat complet en production
- [ ] Vérification que l'email admin arrive bien

---

## 🆘 Problèmes fréquents

### "Webhook signature verification failed"

**Cause** : Mauvais STRIPE_WEBHOOK_SECRET

**Solution** :
- En local : utilise le secret obtenu avec `stripe listen`
- En prod : utilise le secret obtenu sur le dashboard Stripe

### "Email not sent"

**Cause** : EMAIL_FROM non vérifié dans SendGrid

**Solution** :
1. Va sur SendGrid → Settings → Sender Authentication
2. Vérifie ton email expéditeur
3. Redéploie

### "Token expired"

**Cause** : Les tokens Auth0 expirent après 24h

**Solution** :
- Reconnecte-toi sur `/login/`
- À long terme : implémenter Authorization Code Flow + PKCE pour les refresh tokens

---

## 📞 Support

En cas de problème :

1. Vérifie les logs Netlify (Functions → Logs)
2. Vérifie SendGrid Activity
3. Vérifie Stripe Webhooks → Événements récents
4. Contacte maud@gmail.com

---

**Prêt à lancer !** 🚀
