const axios = require('axios');

exports.handler = async (event) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  // CORS headers pour les requêtes depuis le frontend
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Gérer les requêtes OPTIONS (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { email, password } = JSON.parse(event.body);

    if (!email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'invalid_request',
          error_description: 'Email et mot de passe requis' 
        })
      };
    }

    const auth0Domain = process.env.AUTH0_DOMAIN;
    const clientId = process.env.AUTH0_M2M_CLIENT_ID;
    const clientSecret = process.env.AUTH0_M2M_CLIENT_SECRET;

    // Authentifier avec Auth0 via Resource Owner Password Grant
    // Le client_secret est utilisé côté serveur (sécurisé)
    const response = await axios.post(
      `https://${auth0Domain}/oauth/token`,
      {
        grant_type: 'password',
        username: email,
        password: password,
        client_id: clientId,
        client_secret: clientSecret,
        audience: `https://${auth0Domain}/api/v2/`,
        scope: 'openid profile email'
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    console.log('✅ Authentification réussie pour:', email);

    // Retourner les tokens au frontend
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: response.data.access_token,
        id_token: response.data.id_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type
      })
    };

  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.response?.data || error.message);

    // Gérer les erreurs Auth0
    if (error.response?.data) {
      const auth0Error = error.response.data;
      
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: auth0Error.error || 'authentication_failed',
          error_description: auth0Error.error_description || 'Échec de l\'authentification'
        })
      };
    }

    // Erreur générique
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'server_error',
        error_description: 'Erreur serveur lors de l\'authentification'
      })
    };
  }
};
