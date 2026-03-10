const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

exports.handler = async (event) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Netlify normalise les headers en minuscules
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.error('❌ Aucune signature Stripe trouvée dans les headers');
    return { statusCode: 400, body: 'No Stripe signature found' };
  }

  if (!webhookSecret) {
    console.error('❌ STRIPE_WEBHOOK_SECRET non configuré');
    return { statusCode: 500, body: 'Webhook secret not configured' };
  }

  let stripeEvent;

  try {
    // Vérifier la signature du webhook
    // event.body est déjà une string brute dans Netlify Functions
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    console.error('   Headers reçus:', JSON.stringify(event.headers));
    console.error('   Body length:', event.body?.length);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 10 });
    
    const targetProductId = process.env.STRIPE_PRODUCT_ID;
    
    const hasTargetProduct = lineItems.data.some(item => {
      const priceId = item.price?.id;
      return item.price?.product === targetProductId;
    });
    
    if (!hasTargetProduct) {
      console.log('ℹ️  Paiement ignoré - produit différent de "Reset Métabolique"');
      console.log('   Produit(s) acheté(s):', lineItems.data.map(i => i.description).join(', '));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Payment ignored - different product' })
      };
    }
    
    console.log('✅ Produit "Reset Métabolique" détecté - traitement en cours');
    
    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name || customerEmail.split('@')[0];

    console.log('🎉 Paiement réussi pour:', customerEmail);

    const results = {
      payment: true,
      auth0: false,
      email: false,
      password: null,
      errors: []
    };

    try {
      // 1. Générer un mot de passe aléatoire
      const password = generatePassword();
      results.password = password;

      // 2. Créer l'utilisateur dans Auth0
      try {
        const userId = await createAuth0User(customerEmail, password, customerName);
        results.auth0 = true;
        console.log('✅ Utilisateur créé dans Auth0:', userId);
      } catch (error) {
        results.errors.push({ step: 'auth0', error: error.message });
        console.error('❌ Erreur Auth0:', error.message);
        
        // Si l'utilisateur existe déjà, ce n'est pas grave
        if (error.message.includes('already exists') || error.response?.data?.message?.includes('already exists')) {
          console.log('ℹ️  Utilisateur existe déjà dans Auth0');
          results.auth0 = true; // Considérer comme un succès
        }
      }

      // 3. Envoyer l'email avec SendGrid
      try {
        await sendCredentialsEmail(customerEmail, customerName, customerEmail, password);
        results.email = true;
        console.log('✅ Email envoyé à:', customerEmail);
      } catch (error) {
        results.errors.push({ step: 'sendgrid', error: error.message });
        console.error('❌ Erreur SendGrid:', error.message);
        console.error('⚠️  ACTION REQUISE : Envoi manuel requis pour', customerEmail);
        console.error('   Email:', customerEmail, '| Mot de passe:', password);
      }

      // Log du résumé
      console.log('📊 Résumé:', {
        email: customerEmail,
        auth0: results.auth0 ? '✅' : '❌',
        emailSent: results.email ? '✅' : '❌'
      });

      // Retourner 200 si au moins Auth0 a fonctionné
      // Stripe ne réessaiera pas le webhook
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
        // Stripe réessaiera le webhook
        return {
          statusCode: 500,
          body: JSON.stringify({ 
            error: 'Auth0 creation failed',
            details: results.errors
          })
        };
      }
      
    } catch (error) {
      console.error('❌ Erreur critique:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      };
    }
  }

  return { statusCode: 200, body: 'Event received' };
};

// Générer un mot de passe aléatoire sécurisé
function generatePassword() {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

// Obtenir un token Management API Auth0
async function getAuth0ManagementToken() {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_M2M_CLIENT_ID;
  const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

  const response = await axios.post(
    `https://${auth0Domain}/oauth/token`,
    {
      client_id: clientId,
      client_secret: clientSecret,
      audience: `https://${auth0Domain}/api/v2/`,
      grant_type: 'client_credentials'
    },
    {
      headers: { 'Content-Type': 'application/json' }
    }
  );

  return response.data.access_token;
}

// Créer un utilisateur dans Auth0
async function createAuth0User(email, password, name) {
  const auth0Domain = process.env.AUTH0_DOMAIN;
  
  // Obtenir un nouveau token à chaque appel
  const managementToken = await getAuth0ManagementToken();

  const response = await axios.post(
    `https://${auth0Domain}/api/v2/users`,
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

// Envoyer l'email avec SendGrid
async function sendCredentialsEmail(toEmail, toName, login, password) {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: toEmail,
    from: process.env.EMAIL_FROM,
    subject: 'Vos identifiants d\'accès - Paiement confirmé',
    text: `Bonjour ${toName},\n\nVotre paiement a été confirmé avec succès !\n\nVoici vos identifiants de connexion :\n\nEmail : ${login}\nMot de passe : ${password}\n\nConnectez-vous sur : ${process.env.ROOT_URL}/login/\n\nCordialement,\nL'équipe`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #D4917D;">Bienvenue !</h2>
        <p>Bonjour <strong>${toName}</strong>,</p>
        <p>Votre paiement a été confirmé avec succès ! 🎉</p>
        
        <div style="background: #FFF9F4; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Vos identifiants de connexion :</h3>
          <p><strong>Email :</strong> ${login}</p>
          <p><strong>Mot de passe :</strong> <code style="background: white; padding: 4px 8px; border-radius: 4px;">${password}</code></p>
        </div>
        
        <a href="${process.env.ROOT_URL}/login/" 
           style="display: inline-block; background: linear-gradient(135deg, #D4917D 0%, #C97D68 100%); 
                  color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; 
                  font-weight: 600; margin: 20px 0;">
          Se connecter maintenant
        </a>
        
        <p style="color: #666; font-size: 14px; margin-top: 30px;">
          Conservez ces identifiants en lieu sûr.
        </p>
      </div>
    `
  };

  await sgMail.send(msg);
}
