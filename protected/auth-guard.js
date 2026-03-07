/**
 * Protection de la page : vérification Auth0, redirection si non authentifié.
 * Dépend de : auth0-spa-js, config.js (window.AUTH0_CONFIG)
 */
(async function protectPage() {
  const auth0Client = await auth0.createAuth0Client({
    domain: window.AUTH0_CONFIG.domain,
    clientId: window.AUTH0_CONFIG.clientId,
    authorizationParams: {
      redirect_uri: window.location.origin + '/protected/'
    }
  });

  // Gérer le retour de redirection Auth0
  const query = window.location.search;
  if (query.includes('code=') && query.includes('state=')) {
    await auth0Client.handleRedirectCallback();
    window.history.replaceState({}, document.title, '/protected/');
  }

  // Vérifier si l'utilisateur est authentifié
  const isAuthenticated = await auth0Client.isAuthenticated();

  if (!isAuthenticated) {
    window.location.href = '/login/';
  } else {
    const user = await auth0Client.getUser();
    console.log('Utilisateur connecté:', user);
  }
})();
