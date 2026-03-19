# 🌸 Reset Métabolique

Application web complète avec paiement Stripe, authentification Auth0 et automation email SendGrid pour le programme nutritionnel "Reset Métabolique" destiné aux femmes de 30-50 ans.

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Édite .env avec tes vraies clés

# 3. Vérifier la configuration
./test-local.sh

# 4. Lancer en local
netlify dev
```

👉 **Voir [QUICKSTART.md](QUICKSTART.md) pour le guide complet**

---

## ✨ Fonctionnalités

- ✅ **Paiement Stripe** - Checkout sécurisé avec webhook
- ✅ **Authentification Auth0** - Login/logout avec sessions persistantes
- ✅ **Email automation SendGrid** - Templates dynamiques + séquence marketing
- ✅ **Mot de passe oublié** - Réinitialisation via Auth0
- ✅ **Notifications admin** - Email récap à chaque paiement
- ✅ **Application protégée** - 5 modules nutritionnels complets
- ✅ **Responsive** - Design mobile-first élégant

---

## 📚 Documentation

### Pour démarrer
- 📄 [QUICKSTART.md](QUICKSTART.md) - Démarrage en 10 minutes
- 📄 [ARCHITECTURE.md](ARCHITECTURE.md) - Diagrammes et flux visuels

### Pour développer
- 📄 [TECHNICAL_README.md](TECHNICAL_README.md) - Documentation technique complète
- 📄 [SENDGRID_GUIDE.md](SENDGRID_GUIDE.md) - Configuration SendGrid pas-à-pas

### Pour comprendre
- 📄 [CHANGELOG.md](CHANGELOG.md) - Liste de toutes les améliorations
- 📄 [SUMMARY.md](SUMMARY.md) - Récapitulatif final

---

## 🏗️ Architecture

```
Landing → Stripe Checkout → Webhook
    ↓
    ├── Création compte Auth0
    ├── Ajout contact SendGrid
    ├── Envoi email credentials (template)
    └── Notification admin
    ↓
Login → Auth0 → Protected Area
    ↓
Application (5 modules nutritionnels)
```

👉 **Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour les diagrammes complets**

---

## 🛠️ Stack technique

| Composant | Technologie | Pourquoi |
|-----------|-------------|----------|
| **Hosting** | Netlify | Serverless functions + déploiement auto |
| **Paiement** | Stripe | Standard industrie, webhooks fiables |
| **Auth** | Auth0 | Gestion utilisateurs + reset password |
| **Email** | SendGrid | Templates + automation marketing |
| **Frontend** | HTML/CSS/JS vanilla | Simplicité, performance |
| **Backend** | Netlify Functions (Node.js) | Serverless, scalable |

---

## 📦 Structure du projet

```
.
├── index.html                    # Landing page
├── login/                        # Page de connexion
│   ├── index.html
│   ├── login.js
│   └── login.css
├── protected/                    # Application protégée
│   ├── index.html               # 5 modules nutritionnels
│   ├── auth-guard.js            # Vérification tokens
│   ├── app.js
│   └── styles.css
└── netlify/functions/           # API Backend
    ├── send_credentials.js      # Webhook Stripe principal
    ├── auth_login.js            # Authentification
    ├── auth_refresh.js          # Refresh tokens
    └── auth_reset_password.js   # Mot de passe oublié
```

---

## 🔐 Variables d'environnement

Voir [.env.example](.env.example) pour la liste complète.

**Essentielles** :
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRODUCT_ID=prod_...
AUTH0_M2M_CLIENT_ID=...
AUTH0_M2M_CLIENT_SECRET=...
SENDGRID_API_KEY=SG....
EMAIL_FROM=ton-email@example.com
ROOT_URL=http://localhost:8888
```

**Optionnelles** :
```env
SENDGRID_TEMPLATE_CREDENTIALS=d-...  # Template pour email credentials
```

---

## 🧪 Tests

### Test local complet

```bash
# 1. Vérifier la config
./test-local.sh

# 2. Lancer le site
netlify dev

# 3. Lancer le listener Stripe (autre terminal)
stripe listen --forward-to localhost:8888/.netlify/functions/send_credentials

# 4. Faire un achat test
# Carte : 4242 4242 4242 4242
# Vérifie que tu reçois l'email avec credentials
```

### Tests unitaires

```bash
# Vérifier la syntaxe JavaScript
node -c netlify/functions/*.js
node -c protected/*.js
node -c login/*.js
```

---

## 🚀 Déploiement

### Sur Netlify

```bash
# 1. Push sur GitHub
git add .
git commit -m "feat: amélioration complète système"
git push

# 2. Connecte ton repo sur Netlify
# https://app.netlify.com → New site from Git

# 3. Ajoute les variables d'environnement
# Site settings → Environment variables

# 4. Configure le webhook Stripe en production
# Dashboard Stripe → Webhooks → Add endpoint
# URL : https://ton-site.netlify.app/.netlify/functions/send_credentials
```

👉 **Voir [QUICKSTART.md](QUICKSTART.md#déploiement) pour le guide complet**

---

## 📊 Monitoring

### Logs disponibles

1. **Netlify Functions** → Functions → Logs  
   Logs structurés en JSON pour chaque requête

2. **Stripe Dashboard** → Webhooks  
   Status de chaque événement webhook

3. **SendGrid Activity** → Marketing → Activity  
   Taux d'ouverture, clics, bounces

4. **Auth0 Users** → User Management  
   Liste des utilisateurs + logs de connexion

5. **Email admin** (maud@gmail.com)  
   Récap après chaque paiement avec tous les statuts

---

## 🤝 Contribution

Ce projet est privé mais voici les conventions :

### Commits

```bash
feat: nouvelle fonctionnalité
fix: correction de bug
docs: mise à jour documentation
refactor: refactoring du code
test: ajout de tests
chore: tâches de maintenance
```

### Branches

```bash
main              # Production
develop           # Développement
feature/xxx       # Nouvelles features
fix/xxx           # Corrections de bugs
```

---

## 📝 Changelog

Voir [CHANGELOG.md](CHANGELOG.md) pour l'historique complet des modifications.

### Dernières améliorations (v2.0 - Mars 2026)

- ✅ Authentification persistante (localStorage)
- ✅ SendGrid amélioré (contacts + templates)
- ✅ Notifications admin automatiques
- ✅ Mot de passe oublié (Auth0)
- ✅ Code réorganisé en modules
- ✅ Documentation complète

---

## 🐛 Troubleshooting

### Problème courant 1 : Webhook Stripe ne fonctionne pas

**Solution** :
1. Vérifie que `STRIPE_WEBHOOK_SECRET` est correct
2. Regarde les logs Netlify Functions
3. En local : utilise `stripe listen`

### Problème courant 2 : Email non reçu

**Solution** :
1. Vérifie que `EMAIL_FROM` est vérifié dans SendGrid
2. Regarde SendGrid Activity
3. Vérifie les spams

### Problème courant 3 : Token expired

**Solution** :
- Les tokens expirent après 24h
- Reconnecte-toi sur `/login/`
- À long terme : implémenter PKCE pour refresh tokens

👉 **Voir [TECHNICAL_README.md#troubleshooting](TECHNICAL_README.md#troubleshooting) pour plus de solutions**

---

## 🆘 Support

En cas de problème :

1. Consulte la [documentation](TECHNICAL_README.md)
2. Vérifie les logs (Netlify, Stripe, SendGrid)
3. Lance le script de test : `./test-local.sh`
4. Contacte maud@gmail.com avec les détails

---

## 📄 Licence

Propriétaire - Tous droits réservés

---

## 👥 Auteurs

- **Tristan Monteiro** - Développement complet
- **Maud** - Contenu nutritionnel et programme

---

## 🙏 Remerciements

- [Stripe](https://stripe.com) pour l'infrastructure de paiement
- [Auth0](https://auth0.com) pour la gestion des utilisateurs
- [SendGrid](https://sendgrid.com) pour l'email marketing
- [Netlify](https://netlify.com) pour l'hébergement serverless

---

**Version** : 2.0  
**Statut** : ✅ Production Ready  
**Dernière mise à jour** : Mars 2026
