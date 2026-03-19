# 📧 Guide SendGrid - Workflow optimisé

Ce guide explique le workflow complet pour gérer les emails transactionnels ET le nurturing marketing.

---

## 🎯 Vue d'ensemble du système

### Architecture email complète

```
Paiement Stripe validé
    ↓
1️⃣ Email TRANSACTIONNEL immédiat (< 5 secondes)
   → Template SendGrid avec credentials
   → Variables : {{email}}, {{password}}, {{loginUrl}}
    ↓
2️⃣ Ajout contact dans LISTE MARKETING
   → Liste "Clients Reset Métabolique"
   → Custom fields : credentials_sent, date_achat, produit
    ↓
3️⃣ Automation Marketing DÉCLENCHÉE automatiquement
   → J+1  : Email "Bienvenue & premiers pas"
   → J+3  : Email "Comment utiliser le tracker ?"
   → J+7  : Email "Check-in Semaine 1"
   → J+14 : Email "Mi-parcours"
```

**Pourquoi ce workflow ?**
- ✅ Credentials arrivent **immédiatement** (critique pour UX)
- ✅ Nurturing géré dans SendGrid UI (facile à modifier)
- ✅ Segmentation propre avec liste dédiée
- ✅ Custom fields pour personnalisation avancée
- ✅ Stats unifiées dans SendGrid Marketing

---

## 🎨 Étape 1 : Créer le template TRANSACTIONNEL "Credentials"

### Pourquoi transactionnel ?

L'email avec les credentials doit partir **immédiatement** après le paiement. C'est un email transactionnel critique, pas du marketing.

### Création du template

1. Va sur [SendGrid Dynamic Templates](https://mc.sendgrid.com/dynamic-templates)
2. Clique sur **Create a Dynamic Template**
3. Nom : `Reset Métabolique - Credentials (Transactionnel)`
4. Clique sur **Create**

### Design du template

1. Clique sur **Add Version**
2. Choisis **Code Editor** (pour plus de contrôle)
3. Copie-colle ce code HTML :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vos identifiants</title>
</head>
<body style="margin: 0; padding: 0; background-color: #FFF9F4; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 40px auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 24px rgba(212, 145, 125, 0.12);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #D4917D 0%, #C97D68 100%); padding: 40px 32px; text-align: center;">
      <h1 style="margin: 0; color: white; font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 300; letter-spacing: 0.5px;">
        Bienvenue {{name}} ✦
      </h1>
      <p style="margin: 12px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">
        Votre paiement a été confirmé avec succès !
      </p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 32px;">
      
      <p style="margin: 0 0 24px; color: #2C2420; font-size: 15px; line-height: 1.6;">
        Bonjour <strong>{{name}}</strong>,
      </p>
      
      <p style="margin: 0 0 32px; color: #2C2420; font-size: 15px; line-height: 1.6;">
        Votre accès au programme <strong>Reset Métabolique</strong> est maintenant activé ! 🎉
      </p>

      <!-- Credentials Box -->
      <div style="background: linear-gradient(135deg, #FFF9F4 0%, #F0E8DF 100%); border-radius: 16px; padding: 28px; margin-bottom: 32px; border-left: 4px solid #D4917D;">
        <h2 style="margin: 0 0 20px; color: #2C2420; font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 500;">
          Vos identifiants de connexion
        </h2>
        
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; color: #8B7E77; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
            Email
          </div>
          <div style="background: white; padding: 12px 16px; border-radius: 8px; font-family: 'Monaco', 'Courier New', monospace; font-size: 14px; color: #2C2420;">
            {{email}}
          </div>
        </div>

        <div>
          <div style="font-size: 12px; color: #8B7E77; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px;">
            Mot de passe
          </div>
          <div style="background: white; padding: 12px 16px; border-radius: 8px; font-family: 'Monaco', 'Courier New', monospace; font-size: 14px; color: #D4917D; font-weight: 600;">
            {{password}}
          </div>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin-bottom: 32px;">
        <a href="{{loginUrl}}" style="display: inline-block; background: linear-gradient(135deg, #D4917D 0%, #C97D68 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 16px rgba(212, 145, 125, 0.3); transition: transform 0.2s;">
          Se connecter maintenant →
        </a>
      </div>

      <!-- Tips -->
      <div style="background: #E8F5E8; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; color: #4A6741; font-size: 13px; line-height: 1.6;">
          💡 <strong>Astuce :</strong> Conservez ces identifiants dans un gestionnaire de mots de passe sécurisé (1Password, Bitwarden, etc.)
        </p>
      </div>

      <!-- What's next -->
      <div style="border-top: 1px solid #F0E8DF; padding-top: 24px;">
        <h3 style="margin: 0 0 16px; color: #2C2420; font-size: 18px; font-family: 'Cormorant Garamond', serif;">
          Prochaines étapes
        </h3>
        <ul style="margin: 0; padding-left: 20px; color: #2C2420; font-size: 14px; line-height: 2;">
          <li>Connectez-vous avec vos identifiants</li>
          <li>Découvrez votre programme personnalisé</li>
          <li>Téléchargez votre liste de courses</li>
          <li>Commencez la semaine 1 dès aujourd'hui !</li>
        </ul>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #FFF9F4; padding: 24px 32px; text-align: center; border-top: 1px solid #F0E8DF;">
      <p style="margin: 0 0 8px; color: #8B7E77; font-size: 12px;">
        Des questions ? Répondez simplement à cet email.
      </p>
      <p style="margin: 0; color: #D4917D; font-size: 12px; font-weight: 600;">
        Reset Métabolique ✦
      </p>
    </div>

  </div>
</body>
</html>
```

4. Clique sur **Settings** (en haut)
5. **Subject** : `🎉 Votre accès au Reset Métabolique est activé !`
6. **Preheader** (optionnel) : `Vos identifiants sont à l'intérieur`
7. **Important** : Coche **"Transactional"** si l'option existe
8. Clique sur **Save Template**

### Copier l'ID et configurer

1. Retourne sur la liste des templates
2. Copie l'ID du template (commence par `d-`)
3. Ajoute-le dans Netlify env vars :

```env
SENDGRID_TEMPLATE_CREDENTIALS=d-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Note** : Cette variable est **REQUISE**. Sans elle, l'email ne partira pas.

---

## 📋 Étape 2 : Créer la liste Marketing

### Pourquoi une liste dédiée ?

La liste "Clients Reset Métabolique" permet de :
- ✅ Segmenter les clients payants des leads gratuits
- ✅ Déclencher automatiquement l'automation nurturing
- ✅ Avoir des stats propres par produit

### Création de la liste

1. Va sur [SendGrid Contacts](https://mc.sendgrid.com/contacts)
2. Clique sur **Create a List**
3. Nom : `Clients Reset Métabolique`
4. Description : `Clients ayant acheté le programme Reset Métabolique`
5. Sauvegarde

### Copier l'ID de la liste

1. Clique sur la liste que tu viens de créer
2. L'URL contient l'ID : `...contacts/lists/abc123...`
3. Copie cet ID et ajoute-le dans Netlify env vars :

```env
SENDGRID_MARKETING_LIST_ID=abc123...
```

---

## 🤖 Étape 3 : Créer l'automation nurturing

### Vue d'ensemble de l'automation

```
Trigger : Contact ajouté à "Clients Reset Métabolique"
    ↓
    Skip Email Credentials (déjà envoyé en transactionnel)
    ↓
Attendre 1 jour → Email J+1 "Bienvenue"
    ↓
Attendre 2 jours → Email J+3 "Tracker"
    ↓
Attendre 4 jours → Email J+7 "Check-in S1"
    ↓
Attendre 7 jours → Email J+14 "Mi-parcours"
```

### Créer les templates de la séquence

Avant de créer l'automation, crée 4 templates marketing (pas transactionnels cette fois) :

### Créer l'automation

1. Va sur [SendGrid Automations](https://mc.sendgrid.com/automations)
2. Clique sur **Create an Automation**
3. Choisis **Custom Automation**
4. Nom : `Reset Métabolique - Onboarding & Nurturing`

### Configurer le trigger

1. **Entry Trigger** : Contact added to list
2. Choisis la liste `Clients Reset Métabolique`
3. Sauvegarde

**Important** : Dès qu'un contact est ajouté à cette liste (ce que fait ton code), l'automation démarre automatiquement.

### Ajouter les emails nurturing

**Email 1 - Bienvenue (J+1)** :
- Délai : **1 jour** après l'entrée
- Template : "Bienvenue & premiers pas"
- Envoyer à : **9h du matin** (heure locale)
- Contenu : Présentation des 5 modules, comment naviguer

**Email 2 - Tracker (J+3)** :
- Délai : **2 jours** après email précédent
- Template : "Comment utiliser le tracker ?"
- Envoyer à : **10h du matin**
- Contenu : Guide tracker, importance du suivi

**Email 3 - Check-in S1 (J+7)** :
- Délai : **4 jours** après email précédent
- Template : "Check-in Semaine 1"
- Envoyer à : **9h du matin**
- Contenu : Questions fréquentes, encouragements

**Email 4 - Mi-parcours (J+14)** :
- Délai : **7 jours** après email précédent
- Template : "Mi-programme"
- Envoyer à : **10h du matin**
- Contenu : Bilan, ajustements, motivation

### Activer l'automation

1. Vérifie que tous les emails sont configurés
2. Clique sur **Activate**
3. ✅ L'automation est active !

---

## ✅ Étape 4 : Tester le workflow complet

### Test end-to-end

1. **Fais un achat test avec Stripe**
   - Utilise la carte : `4242 4242 4242 4242`
   
2. **Vérifie l'email transactionnel** (immédiat)
   - Tu dois recevoir l'email avec credentials en < 5 secondes
   - Vérifie que les variables sont bien remplies

3. **Vérifie dans SendGrid Contacts**
   - Va sur Marketing → Contacts → All Contacts
   - Ton email devrait apparaître
   - Il devrait être dans la liste "Clients Reset Métabolique"
   - Vérifie les custom fields : `credentials_sent: true`, `date_achat`, etc.

4. **Vérifie l'automation**
   - Va sur Automations → Ton automation
   - Onglet **Stats**
   - Tu devrais voir **1 entrée** dans le funnel

5. **Attends 24h**
   - Le lendemain à 9h, tu devrais recevoir l'email "Bienvenue"

---

## 🎯 Résultat final : Ce qui se passe automatiquement

```
Client paie sur Stripe
    ↓
Webhook send_credentials.js s'exécute
    ↓
1. ✅ Crée utilisateur Auth0
    ↓
2. ✅ Envoie email TRANSACTIONNEL immédiat
   → Client reçoit credentials en 5 secondes
    ↓
3. ✅ Ajoute contact dans liste "Clients Reset Métabolique"
   → Custom fields : credentials_sent=true, date_achat, produit
    ↓
4. ✅ Notifie admin maud@gmail.com
   → Statut de toutes les étapes
    ↓
Automation SendGrid SE DÉCLENCHE automatiquement
    ↓
J+1  (9h)  : ✉️ Email "Bienvenue"
J+3  (10h) : ✉️ Email "Tracker"
J+7  (9h)  : ✉️ Email "Check-in S1"
J+14 (10h) : ✉️ Email "Mi-parcours"
```

**Le client n'a rien à faire. Tout est automatique.** 🎉

---

## 🔧 Personnalisation avancée

### Ajouter des Custom Fields

Tu peux enrichir tes contacts avec des données personnalisées :

1. Va sur **Marketing** → **Custom Fields**
2. Crée des champs personnalisés :
   - `date_inscription` (Date)
   - `phase_cycle` (Text)
   - `semaine_actuelle` (Number)
   - `objectif_poids` (Number)

3. Modifie `send_credentials.js` pour ajouter ces champs :

```javascript
async function addSendGridContact(email, name) {
  const response = await axios.put(
    'https://api.sendgrid.com/v3/marketing/contacts',
    {
      contacts: [
        {
          email: email,
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || '',
          custom_fields: {
            e1_T: new Date().toISOString(), // date_inscription
            e2_T: 'menstruelle',             // phase_cycle
            e3_N: 1                          // semaine_actuelle
          }
        }
      ]
    },
    // ...
  );
}
```

4. Utilise ces champs dans tes templates :
```html
<p>Vous êtes actuellement en semaine {{custom_field.semaine_actuelle}} du programme.</p>
```

### Ajouter des conditions dans l'automation

Tu peux créer des branches conditionnelles :

1. Dans l'automation, clique sur **+** entre deux emails
2. Choisis **Condition**
3. Exemple : "Si custom_field.phase_cycle = menstruelle" → envoie email spécifique

---

## 📊 Suivi et analytics

### Voir les stats

1. **Email Activity** : Marketing → Activity
   - Voir tous les emails envoyés
   - Taux d'ouverture, clics, bounces

2. **Automation Stats** : Automations → Ton automation → Stats
   - Nombre d'entrées
   - Taux de complétion
   - Performance de chaque email

### Améliorer les performances

**Si taux d'ouverture faible (<20%)** :
- Change le sujet (plus accrocheur)
- Change l'heure d'envoi
- Vérifie que l'expéditeur est reconnaissable

**Si taux de clic faible (<2%)** :
- Simplifie le CTA
- Rends le lien plus visible
- Ajoute plus de valeur dans le contenu

---

## 🆘 Problèmes fréquents

### Les contacts ne sont pas ajoutés

**Vérifie** :
- Que `SENDGRID_API_KEY` a les permissions `Marketing`
- Les logs Netlify Functions pour voir les erreurs
- SendGrid Activity pour voir si la requête est passée

### L'automation ne se déclenche pas

**Vérifie** :
- Que le contact est bien dans la bonne liste
- Que l'automation est bien **activée** (status = Active)
- Que le trigger est bien "Contact added to list"

### Les emails partent en spam

**Solutions** :
- Configure SPF/DKIM dans SendGrid (Sender Authentication)
- Utilise un domaine personnalisé (pas @gmail.com)
- Demande à tes clients d'ajouter ton email en contact

---

**Félicitations !** 🎉  
Ton système d'emailing automatisé est maintenant opérationnel !
