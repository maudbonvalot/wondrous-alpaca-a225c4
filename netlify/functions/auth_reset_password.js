const axios = require('axios');

/**
 * Fonction pour déclencher un email de réinitialisation de mot de passe Auth0
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { email } = JSON.parse(event.body);

    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'invalid_request',
          error_description: 'Email requis' 
        })
      };
    }

    const auth0Domain = 'dev-ui7y38rv7dxqr48x.eu.auth0.com';
    const clientId = process.env.AUTH0_M2M_CLIENT_ID;

    // Déclencher l'email de réinitialisation Auth0
    await axios.post(
      `https://${auth0Domain}/dbconnections/change_password`,
      {
        client_id: clientId,
        email: email,
        connection: 'Username-Password-Authentication'
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Email de réinitialisation envoyé à:', email);

    // Toujours retourner un succès pour des raisons de sécurité
    // (ne pas révéler si l'email existe ou non)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Si cet email existe dans notre base, vous recevrez un lien de réinitialisation.'
      })
    };

  } catch (error) {
    console.error('❌ Erreur réinitialisation:', error.response?.data || error.message);

    // Toujours retourner un succès côté client pour la sécurité
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Si cet email existe dans notre base, vous recevrez un lien de réinitialisation.'
      })
    };
  }
};
