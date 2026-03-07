// login.js - Gestion de la connexion avec Auth0

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // TODO: Intégrer Auth0 ici
    // Pour l'instant, simulation de connexion
    console.log('Tentative de connexion:', email);
    
    // Placeholder - à remplacer par l'authentification Auth0
    alert('Fonctionnalité à implémenter avec Auth0');
  });
});
