# Documentation Technique - Glow Reset

## 1. Contexte & Objectifs

### Objectif principal
Créer un site web avec une **ressource protégée** (le programme Reset Métabolique) accessible uniquement aux utilisateurs ayant acheté le produit via Stripe.

### Architecture générale

```
Client achète sur Stripe
    ↓
Webhook déclenche la Netlify fonction send_credentials (Ajout a une liste sendgrid, creation d'identifiants Auth0, envoi de ces credentials via sendgrid, et envoi d'un mail recap a maud.glowcose@gmail pour savoir si tout s'est bien passé)
    ↓
Connexion sur /login/ avec email/mot de passe
    ↓
Accès à /protected/ (contenu premium)
```

### Rôle des services

- **Stripe** : Gestion des paiements et Payment Links
- **Auth0** : Authentification et gestion des utilisateurs (base de données sécurisée des logins)
- **SendGrid** : Envoi automatique des emails avec identifiants de connexion
- **Cloudflare** : Gestion DNS, sécurité et configuration des emails (DKIM, SPF, DMARC)
- **Netlify** : Hébergement du site et exécution des fonctions serverless
- **GitHub** : Stockage et versioning du code source

---

## 2. Gestion des DNS et Email

### Domaines
- **Achat** : Domaines achetés sur **Ionos** (glowreset.fr, glow-cose.com)
- **Gestion** : DNS gérés sur **Cloudflare** (plus performant et flexible qu'Ionos)

### Configuration dans Cloudflare

#### DNS Records
```
Type A    : glowreset.fr → IP Netlify
Type CNAME: www → glowreset.fr
```

#### Configuration Email (SendGrid)
Pour que les emails envoyés depuis `maud@glow-cose.com` arrivent bien en boîte de réception :

1. **SPF** (Sender Policy Framework)
   - Type : `TXT`
   - Nom : `glow-cose.com`
   - Contenu : `v=spf1 include:sendgrid.net ~all`
   - Rôle : Autorise SendGrid à envoyer des emails au nom du domaine

2. **DKIM** (DomainKeys Identified Mail)
   - Type : `CNAME`
   - Nom : `s1._domainkey` et `s2._domainkey`
   - Contenu : Fourni par SendGrid
   - Rôle : Signature cryptographique qui prouve que l'email vient bien de nous

3. **DMARC** (Domain-based Message Authentication)
   - Type : `TXT`
   - Nom : `_dmarc.glow-cose.com`
   - Contenu : `v=DMARC1; p=none; rua=mailto:maud.glowcose@gmail.com`
   - Rôle : Politique de sécurité email (évite le spam/phishing)

**Important** : Ces enregistrements DNS permettent aux emails d'arriver en boîte de réception au lieu de spam.

---

## 3. Ressources de Code

### Hébergement et versioning
- **Repository** : GitHub (code source du projet)
- **Hébergement** : Netlify (déploiement automatique depuis GitHub)

### Structure du projet

```
/
├── index.html              # Page d'accueil (landing page)
├── /login/                 # Page de connexion
│   ├── index.html
│   ├── login.js           # Authentification Auth0
│   └── login.css
├── /protected/            # Contenu premium (programme Reset)
│   ├── index.html         # Programme complet
│   ├── auth-guard.js      # Protection de la page
│   └── app.js
├── /netlify/functions/
│   └── send_credentials.js # Webhook Stripe → Création compte
└── config.js              # Configuration Auth0 (domain, clientId)
```

### Scripts clés

#### 1. `protected/auth-guard.js`
**Rôle** : Protège l'accès au contenu premium

- Vérifie si l'utilisateur est connecté (via tokens dans sessionStorage)
- Valide le token auprès d'Auth0
- Redirige vers `/login/` si non authentifié
- Permet l'accès au contenu si authentifié

#### 2. `netlify/functions/send_credentials.js`
**Rôle** : Automatisation complète après un achat Stripe

**Déclenchement** : Webhook Stripe (`checkout.session.completed`)

**Actions réalisées** :
1. Récupère les informations du client (email, nom, produit acheté)
2. Génère un mot de passe aléatoire sécurisé
3. **Crée l'utilisateur dans Auth0** (base de données des logins)
4. **Ajoute l'email à la liste SendGrid** (pour newsletters futures)
5. **Envoie l'email au client** avec ses identifiants :
   - Email de connexion
   - Mot de passe généré
   - Lien vers /login/
6. **Envoie une copie à Maud** (maud.glowcose@gmail.com) pour suivi

**Variables d'environnement nécessaires** (dans Netlify) :
```
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
AUTH0_DOMAIN
AUTH0_M2M_CLIENT_ID
AUTH0_M2M_CLIENT_SECRET
SENDGRID_API_KEY
EMAIL_FROM=maud@glow-cose.com
```

### Flux utilisateur complet

1. **Achat** : Client achète sur Stripe Payment Link
2. **Webhook** : Stripe notifie Netlify (`send_credentials.js`)
3. **Création automatique** :
   - Compte Auth0 créé avec email/password
   - Contact ajouté à SendGrid
4. **Email** : Client reçoit ses identifiants par email
5. **Connexion** : Client va sur `glowreset.fr/login/`
6. **Authentification** : Auth0 vérifie email/password
7. **Accès** : Redirection vers `/protected/` avec le contenu premium
8. **Protection** : `auth-guard.js` vérifie à chaque visite

---

## Configuration Auth0

### Application Regular Web App
- **Type** : Regular Web Application
- **Grant Types** : Password activé
- **Database** : Username-Password-Authentication
- **Allowed Web Origins** : `http://localhost:3000, https://glowreset.fr`
- **Allowed Callback URLs** : `https://glowreset.fr/protected/`

### Machine-to-Machine App
Pour la création automatique d'utilisateurs via l'API Auth0 :
- Permissions : `create:users`, `read:users`
- Utilisé par `send_credentials.js`

---

## Support & Maintenance

### Logs et monitoring
- **Stripe** : Dashboard → Webhooks → Voir les événements
- **Netlify** : Functions → Logs en temps réel
- **Auth0** : Users → Voir les comptes créés
- **SendGrid** : Activity → Voir les emails envoyés

### En cas de problème
1. Vérifier les logs Netlify Functions
2. Vérifier que le webhook Stripe est actif
3. Vérifier les DNS Cloudflare (propagation peut prendre 24h)
4. Tester manuellement la création d'utilisateur Auth0
