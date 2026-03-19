const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
  auth0: {
    domain: 'dev-ui7y38rv7dxqr48x.eu.auth0.com',
    clientId: process.env.AUTH0_M2M_CLIENT_ID,
    clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET
  },
  stripe: {
    targetProductId: process.env.STRIPE_PRODUCT_ID
  },
  sendgrid: {
    from: process.env.EMAIL_FROM,
    adminEmail: 'tristanmonteiro97@gmail.com',
    credentialsTemplateId: process.env.SENDGRID_TEMPLATE_CREDENTIALS,
    marketingListId: process.env.SENDGRID_MARKETING_LIST_ID
  },
  app: {
    rootUrl: process.env.ROOT_URL
  }
};

// ========================================
// UTILITIES
// ========================================

/**
 * Génère un mot de passe aléatoire sécurisé
 */
function generatePassword() {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Log structuré avec timestamp
 */
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  console.log(JSON.stringify({
    timestamp,
    level,
    message,
    ...data
  }));
}

// ========================================
// AUTH0 MANAGEMENT
// ========================================

/**
 * Obtient un token Management API Auth0
 */
async function getAuth0ManagementToken() {
  const response = await axios.post(
    `https://${CONFIG.auth0.domain}/oauth/token`,
    {
      client_id: CONFIG.auth0.clientId,
      client_secret: CONFIG.auth0.clientSecret,
      audience: `https://${CONFIG.auth0.domain}/api/v2/`,
      grant_type: 'client_credentials'
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  return response.data.access_token;
}

/**
 * Crée un utilisateur dans Auth0
 */
async function createAuth0User(email, password, name) {
  const managementToken = await getAuth0ManagementToken();

  const response = await axios.post(
    `https://${CONFIG.auth0.domain}/api/v2/users`,
    {
      email: email,
      password: password,
      connection: 'Username-Password-Authentication',
      email_verified: true,
      name: name
    },
    {
      headers: {
        'Authorization': `Bearer ${managementToken}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.user_id;
}

// ========================================
// SENDGRID MANAGEMENT
// ========================================

/**
 * Ajoute un contact dans SendGrid Marketing List spécifique
 * Déclenche automatiquement l'automation associée à la liste
 */
async function addToMarketingList(email, name, customData = {}) {
  try {
    const firstName = name.split(' ')[0] || name;
    const lastName = name.split(' ').slice(1).join(' ') || '';
    
    const payload = {
      contacts: [
        {
          email: email,
          first_name: firstName,
          last_name: lastName,
          custom_fields: {
            // Custom fields pour segmentation et automation
            ...customData
          }
        }
      ]
    };

    // Ajouter à la liste spécifique si configurée
    if (CONFIG.sendgrid.marketingListId) {
      payload.list_ids = [CONFIG.sendgrid.marketingListId];
    }

    const response = await axios.put(
      'https://api.sendgrid.com/v3/marketing/contacts',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    log('info', 'Contact ajouté à la liste marketing', { 
      email,
      listId: CONFIG.sendgrid.marketingListId 
    });
    return true;
  } catch (error) {
    log('error', 'Erreur ajout contact marketing', { 
      email, 
      error: error.response?.data || error.message 
    });
    return false;
  }
}

/**
 * Envoie l'email transactionnel avec les credentials
 * Utilise le Dynamic Template SendGrid configuré
 */
async function sendTransactionalEmail(toEmail, toName, login, password) {
  if (!CONFIG.sendgrid.credentialsTemplateId) {
    throw new Error('SENDGRID_TEMPLATE_CREDENTIALS non configuré. Créez un template dans SendGrid.');
  }

  const msg = {
    to: toEmail,
    from: CONFIG.sendgrid.from,
    templateId: CONFIG.sendgrid.credentialsTemplateId,
    dynamicTemplateData: {
      name: toName,
      email: login,
      password: password,
      loginUrl: `${CONFIG.app.rootUrl}/login/`
    }
  };

  await sgMail.send(msg);
  log('info', 'Email transactionnel credentials envoyé', { email: toEmail });
}

/**
 * Envoie une notification admin avec le statut de chaque étape
 */
async function sendAdminNotification(customerEmail, customerName, results) {
  const statusEmoji = (success) => success ? '✅' : '❌';
  
  const msg = {
    to: CONFIG.sendgrid.adminEmail,
    from: CONFIG.sendgrid.from,
    subject: `Nouveau paiement - ${customerName}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #D4917D;">Nouveau paiement validé</h2>
        
        <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Client :</strong> ${customerName}</p>
          <p><strong>Email :</strong> ${customerEmail}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
        </div>
        
        <h3>État des opérations :</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 8px 0;">${statusEmoji(results.payment)} Paiement Stripe</li>
          <li style="margin: 8px 0;">${statusEmoji(results.auth0)} Création compte Auth0</li>
          <li style="margin: 8px 0;">${statusEmoji(results.sendgridContact)} Ajout contact SendGrid</li>
          <li style="margin: 8px 0;">${statusEmoji(results.email)} Envoi email credentials</li>
        </ul>
        
        ${results.errors.length > 0 ? `
          <div style="background: #fff3cd; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #ffc107;">
            <h4 style="margin-top: 0; color: #856404;">⚠️ Erreurs rencontrées :</h4>
            <ul>
              ${results.errors.map(e => `<li><strong>${e.step}:</strong> ${e.error}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${results.password ? `
          <div style="background: #e3f2fd; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p><strong>🔑 Mot de passe généré :</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px;">${results.password}</code></p>
          </div>
        ` : ''}
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    log('info', 'Notification admin envoyée', { email: CONFIG.sendgrid.adminEmail });
  } catch (error) {
    log('error', 'Erreur notification admin', { error: error.message });
  }
}

// ========================================
// WEBHOOK HANDLER
// ========================================

exports.handler = async (event) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Vérifier la signature Stripe
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    log('error', 'Aucune signature Stripe trouvée');
    return { statusCode: 400, body: 'No Stripe signature found' };
  }

  if (!webhookSecret) {
    log('error', 'STRIPE_WEBHOOK_SECRET non configuré');
    return { statusCode: 500, body: 'Webhook secret not configured' };
  }

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    log('error', 'Webhook signature verification failed', { error: err.message });
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Traiter uniquement les paiements réussis
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    log('info', 'Checkout session completed', { 
      sessionId: session.id,
      email: session.customer_details.email 
    });
    
    // Vérifier que c'est bien le produit "Reset Métabolique"
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
    
    const hasTargetProduct = lineItems.data.some(item => 
      item.price?.product === CONFIG.stripe.targetProductId
    );
    
    if (!hasTargetProduct) {
      log('info', 'Paiement ignoré - produit différent', {
        products: lineItems.data.map(i => i.description).join(', ')
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Payment ignored - different product' })
      };
    }
    
    log('info', 'Produit "Reset Métabolique" détecté - traitement');
    
    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name || customerEmail.split('@')[0];

    const results = {
      payment: true,
      auth0: false,
      transactionalEmail: false,
      marketingContact: false,
      password: null,
      errors: []
    };

    try {
      // 1. Générer un mot de passe aléatoire
      const password = generatePassword();
      results.password = password;
      log('info', 'Mot de passe généré', { email: customerEmail });

      // 2. Créer l'utilisateur dans Auth0
      try {
        const userId = await createAuth0User(customerEmail, password, customerName);
        results.auth0 = true;
        log('info', 'Utilisateur créé dans Auth0', { userId, email: customerEmail });
      } catch (error) {
        results.errors.push({ step: 'auth0', error: error.message });
        log('error', 'Erreur Auth0', { error: error.message, email: customerEmail });
        
        // Si l'utilisateur existe déjà, ce n'est pas grave
        if (error.message.includes('already exists') || error.response?.data?.message?.includes('already exists')) {
          log('info', 'Utilisateur existe déjà dans Auth0', { email: customerEmail });
          results.auth0 = true;
        }
      }

      // 3. Envoyer l'email TRANSACTIONNEL immédiat avec credentials
      try {
        await sendTransactionalEmail(customerEmail, customerName, customerEmail, password);
        results.transactionalEmail = true;
      } catch (error) {
        results.errors.push({ step: 'transactional_email', error: error.message });
        log('error', 'Erreur envoi email transactionnel', { error: error.message, email: customerEmail });
      }

      // 4. Ajouter le contact dans la LISTE MARKETING (déclenche l'automation)
      try {
        const contactAdded = await addToMarketingList(customerEmail, customerName, {
          credentials_sent: true,
          date_achat: new Date().toISOString(),
          produit: 'Reset Métabolique'
        });
        results.marketingContact = contactAdded;
      } catch (error) {
        results.errors.push({ step: 'marketing_contact', error: error.message });
        log('error', 'Erreur ajout contact marketing', { error: error.message, email: customerEmail });
      }

      // 5. Envoyer la notification admin
      await sendAdminNotification(customerEmail, customerName, results);

      // Log du résumé
      log('info', 'Résumé traitement', {
        email: customerEmail,
        auth0: results.auth0,
        transactionalEmail: results.transactionalEmail,
        marketingContact: results.marketingContact,
        errorsCount: results.errors.length
      });

      // Retourner 200 si au moins Auth0 a fonctionné
      if (results.auth0) {
        return {
          statusCode: 200,
          body: JSON.stringify({ 
            message: 'Payment processed',
            results: results
          })
        };
      } else {
        // Seulement retourner 500 si Auth0 a échoué
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Auth0 creation failed',
            details: results.errors
          })
        };
      }
      
    } catch (error) {
      log('error', 'Erreur critique', { error: error.message, email: customerEmail });
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  return { statusCode: 200, body: 'Event received' };
};

