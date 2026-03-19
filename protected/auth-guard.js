/**
 * Protection de la page : vérification du token, redirection si non authentifié.
 */
(async function protectPage() {
  const AUTH_DOMAIN = 'dev-ui7y38rv7dxqr48x.eu.auth0.com';
  
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    console.log('❌ Pas de token - redirection login');
    window.location.href = '/login/';
    return;
  }

  try {
    const response = await fetch(`https://${AUTH_DOMAIN}/userinfo`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Token invalide ou expiré');
    }

    const user = await response.json();
    console.log('✅ Utilisateur connecté:', user.email);
    
    localStorage.setItem('user', JSON.stringify(user));

  } catch (error) {
    console.error('❌ Token invalide:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('user');
    window.location.href = '/login/';
  }
})();
