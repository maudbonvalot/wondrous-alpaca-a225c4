/**
 * Protection de la page : vérification des tokens, redirection si non authentifié.
 */
(async function protectPage() {
  // Configuration Auth0 (domaine public)
  const AUTH0_DOMAIN = 'dev-ui7y38rv7dxqr48x.eu.auth0.com';
  
  // Récupérer les tokens depuis sessionStorage
  const accessToken = sessionStorage.getItem('access_token');
  const idToken = sessionStorage.getItem('id_token');

  // Si pas de tokens, rediriger vers login
  if (!accessToken || !idToken) {
    window.location.href = '/login/';
    return;
  }

  try {
    // Vérifier la validité du token en récupérant les infos utilisateur
    const response = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Token invalide ou expiré');
    }

    const user = await response.json();
    console.log('Utilisateur connecté:', user);
    
    // Optionnel : stocker les infos utilisateur pour les utiliser dans l'app
    sessionStorage.setItem('user', JSON.stringify(user));

  } catch (error) {
    console.error('Erreur de vérification:', error);
    // Token invalide ou expiré, nettoyer et rediriger
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('id_token');
    sessionStorage.removeItem('user');
    window.location.href = '/login/';
  }
})();
