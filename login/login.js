// login.js - Gestion de la connexion avec Auth0

let auth0Client = null;

// Initialiser Auth0
async function initAuth0() {
  auth0Client = await auth0.createAuth0Client({
    domain: window.AUTH0_CONFIG.domain,
    clientId: window.AUTH0_CONFIG.clientId,
    authorizationParams: {
      redirect_uri: window.location.origin + '/protected/'
    }
  });

  // Vérifier si l'utilisateur revient après une authentification
  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/protected/');
  }

  // Vérifier si déjà connecté
  const isAuthenticated = await auth0Client.isAuthenticated();
  if (isAuthenticated) {
    window.location.href = '/protected/';
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  await initAuth0();

  const loginForm = document.getElementById('loginForm');
  const loginButton = loginForm.querySelector('.login-button');
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    loginButton.textContent = 'Connexion...';
    loginButton.disabled = true;

    try {
      // Connexion avec email/password via Auth0
      await auth0Client.loginWithCredentials({
        username: email,
        password: password,
        realm: 'Username-Password-Authentication'
      });

      // Si succès, rediriger vers protected
      window.location.href = '/protected/';
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Afficher le message d'erreur
      let errorMessage = 'Erreur de connexion. Vérifiez vos identifiants.';
      
      if (error.error === 'invalid_grant') {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.error === 'access_denied') {
        errorMessage = 'Accès refusé. Contactez le support.';
      }
      
      alert(errorMessage);
      
      loginButton.textContent = 'Se connecter';
      loginButton.disabled = false;
    }
  });
});
