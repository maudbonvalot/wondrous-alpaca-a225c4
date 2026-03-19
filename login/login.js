document.addEventListener('DOMContentLoaded', async function() {
  if (localStorage.getItem('access_token')) {
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
      const response = await fetch('/.netlify/functions/auth_login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const tokens = await response.json();
      
      localStorage.setItem('access_token', tokens.access_token);
      localStorage.setItem('id_token', tokens.id_token);
      
      console.log('✅ Authentification réussie');
      window.location.href = '/protected/';
      
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      let errorMessage = 'Erreur de connexion. Vérifiez vos identifiants.';
      
      if (error.error === 'invalid_grant' || error.error === 'invalid_user_password') {
        errorMessage = 'Email ou mot de passe incorrect.';
      } else if (error.error === 'access_denied') {
        errorMessage = 'Accès refusé.';
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }
      
      alert(errorMessage);
      
      loginButton.textContent = 'Se connecter';
      loginButton.disabled = false;
    }
  });

  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  forgotPasswordLink.addEventListener('click', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
      alert('Veuillez entrer votre email dans le champ ci-dessus.');
      document.getElementById('email').focus();
      return;
    }
    
    if (!confirm(`Un email de réinitialisation sera envoyé à ${email}. Continuer ?`)) {
      return;
    }
    
    try {
      await fetch('/.netlify/functions/auth_reset_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      alert('✅ Si cet email existe, vous recevrez un lien de réinitialisation. Vérifiez vos spams.');
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      alert('✅ Si cet email existe, vous recevrez un lien de réinitialisation.');
    }
  });
});
