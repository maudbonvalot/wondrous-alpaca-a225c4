// Génère des confettis à l'arrivée sur la page
function launchConfetti() {
  const colors = ['#C47A5A','#C9A96E','#8A9E85','#E8C4B0','#9B4F3F','#4A6741'];
  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-20px';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.width = (6 + Math.random() * 10) + 'px';
      el.style.height = (6 + Math.random() * 10) + 'px';
      el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      el.style.animationDuration = (2 + Math.random() * 3) + 's';
      el.style.animationDelay = '0s';
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }, i * 60);
  }
}
window.addEventListener('load', launchConfetti);