// login.js - Gestion de la connexion avec Auth0

// Authentifier via la fonction backend Netlify (sécurisé)
async function authenticateWithPassword(email, password) {
  const response = await fetch('/.netlify/functions/auth_login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  const tokens = await response.json();
  console.log('✅ Tokens reçus:', tokens);
  return tokens;
}

document.addEventListener('DOMContentLoaded', async function() {
  // Vérifier si déjà connecté (tokens présents dans sessionStorage)
  const accessToken = sessionStorage.getItem('access_token');
  if (accessToken) {
    window.location.href = '/protected/';
    return;
  }

  const loginForm = document.getElementById('loginForm');
  const loginButton = loginForm.querySelector('.login-button');
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    loginButton.textContent = 'Connexion...';
    loginButton.disabled = true;

    try {
      // Authentifier avec Auth0
      const tokens = await authenticateWithPassword(email, password);
      
      // Stocker les tokens
      sessionStorage.setItem('access_token', tokens.access_token);
      sessionStorage.setItem('id_token', tokens.id_token);
      
      // Rediriger vers protected
      window.location.href = '/protected/';
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      let errorMessage = 'Erreur de connexion. Vérifiez vos identifiants.';
      
      if (error.error === 'invalid_grant' || error.error === 'invalid_user_password') {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.error === 'access_denied') {
        errorMessage = 'Accès refusé. Vérifiez que votre compte est bien activé.';
      } else if (error.error === 'unauthorized_client') {
        errorMessage = 'Configuration Auth0 incorrecte. Contactez le support.';
      } else if (error.error === 'server_error') {
        errorMessage = 'Erreur serveur. Réessayez dans quelques instants.';
      } else if (error.error_description) {
        errorMessage = `Erreur: ${error.error_description}`;
      }
      
      alert(errorMessage);
      
      loginButton.textContent = 'Se connecter';
      loginButton.disabled = false;
    }
  });
});
