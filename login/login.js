// login.js - Gestion de la connexion avec Auth0

// Authentifier avec Auth0 via Resource Owner Password Grant
async function authenticateWithPassword(email, password) {
  const response = await fetch(`https://${window.AUTH0_CONFIG.domain}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'password',
      username: email,
      password: password,
      client_id: window.AUTH0_CONFIG.clientId,
      audience: `https://${window.AUTH0_CONFIG.domain}/api/v2/`,
      scope: 'openid profile email'
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
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
      
      if (error.error === 'invalid_grant') {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.error === 'access_denied') {
        errorMessage = 'Accès refusé. Contactez le support.';
      } else if (error.error === 'unauthorized') {
        errorMessage = 'Configuration incorrecte. Contactez le support.';
      }
      
      alert(errorMessage);
      
      loginButton.textContent = 'Se connecter';
      loginButton.disabled = false;
    }
  });
});
