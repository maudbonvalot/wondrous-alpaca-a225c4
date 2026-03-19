// Page loader - Charge les pages dynamiquement depuis /protected/pages/
const PageLoader = {
  // Cache pour éviter de recharger les pages
  loadedPages: new Set(),
  
  // Liste des pages disponibles
  pages: ['home', 'programme', 'recettes', 'cycle', 'tracker', 'courses'],
  
  /**
   * Charge une page depuis /protected/pages/{name}.html
   */
  async loadPage(pageName) {
    // Si déjà chargée, ne rien faire
    if (this.loadedPages.has(pageName)) {
      return true;
    }
    
    try {
      const response = await fetch(`/protected/pages/${pageName}.html`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      
      // Insérer le HTML dans le container
      const container = document.getElementById('pages-container');
      container.insertAdjacentHTML('beforeend', html);
      
      // Marquer comme chargée
      this.loadedPages.add(pageName);
      
      console.log(`✅ Page "${pageName}" chargée`);
      return true;
      
    } catch (error) {
      console.error(`❌ Erreur chargement page "${pageName}":`, error);
      return false;
    }
  },
  
  /**
   * Précharge toutes les pages en arrière-plan
   */
  async preloadAll() {
    console.log('🔄 Préchargement de toutes les pages...');
    
    for (const pageName of this.pages) {
      if (!this.loadedPages.has(pageName)) {
        await this.loadPage(pageName);
      }
    }
    
    console.log('✅ Toutes les pages sont chargées');
  },
  
  /**
   * Initialise le loader et charge la page home
   */
  async init() {
    // Charger la page d'accueil immédiatement
    await this.loadPage('home');
    
    // Précharger les autres pages en arrière-plan après 500ms
    setTimeout(() => this.preloadAll(), 500);
  }
};

// Initialiser au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PageLoader.init());
} else {
  PageLoader.init();
}

