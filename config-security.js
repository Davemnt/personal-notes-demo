// config-security.js - Configuración de seguridad adicional
// Este archivo contiene configuraciones para mantener el sitio privado

// 🔒 CONFIGURACIÓN DE SEGURIDAD PRIVADA
export const SecurityConfig = {
  // Prevenir indexación por buscadores
  preventIndexing: false, // Deshabilitado para desarrollo
  
  // Ocultar información del sitio
  hideInformation: false, // Deshabilitado para desarrollo
  
  // URL secreta (cambiar en producción)
  secretPath: null, // Se puede configurar una ruta secreta
  
  // Configuración de PIN
  pinConfig: {
    maxAttempts: 5,
    lockoutTime: 300000, // 5 minutos en ms
    pinLength: { min: 4, max: 8 }
  }
};

// 🛡️ Funciones de seguridad
export class PrivacySecurity {
  
  // Prevenir inspección de código (básico)
  static preventInspection() {
    // Deshabilitar click derecho
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Deshabilitar F12, Ctrl+Shift+I, Ctrl+U
    document.addEventListener('keydown', e => {
      if (
        e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    });
    
    // Ocultar en consola
    console.clear();
    console.log('%c🔒 Sitio Privado - Acceso Restringido', 'color: red; font-size: 20px; font-weight: bold;');
  }
  
  // Detectar herramientas de desarrollo
  static detectDevTools() {
    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        document.body.innerHTML = '<div style="text-align:center;padding:50px;font-family:Arial;"><h1>🔒 Acceso Denegado</h1><p>Este sitio es privado.</p></div>';
      }
    }, 1000);
  }
  
  // Prevenir copia de contenido
  static preventCopy() {
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    
    // CSS para prevenir selección
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Inicializar todas las protecciones
  static init() {
    if (SecurityConfig.hideInformation) {
      this.preventInspection();
      this.detectDevTools();
      this.preventCopy();
      
      // Meta tags para prevenir indexación
      if (SecurityConfig.preventIndexing) {
        const metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        metaRobots.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
        document.head.appendChild(metaRobots);
        
        const metaGooglebot = document.createElement('meta');
        metaGooglebot.name = 'googlebot';
        metaGooglebot.content = 'noindex, nofollow, noarchive, nosnippet, noimageindex';
        document.head.appendChild(metaGooglebot);
      }
    }
  }
}

// 🔐 Sistema de PIN mejorado con intentos limitados
export class SecurePinSystem {
  static attempts = 0;
  static locked = false;
  static lockTime = null;
  
  static isLocked() {
    if (this.locked && Date.now() - this.lockTime < SecurityConfig.pinConfig.lockoutTime) {
      return true;
    }
    if (this.locked && Date.now() - this.lockTime >= SecurityConfig.pinConfig.lockoutTime) {
      this.unlock();
    }
    return false;
  }
  
  static addAttempt() {
    this.attempts++;
    if (this.attempts >= SecurityConfig.pinConfig.maxAttempts) {
      this.lock();
    }
  }
  
  static lock() {
    this.locked = true;
    this.lockTime = Date.now();
  }
  
  static unlock() {
    this.locked = false;
    this.attempts = 0;
    this.lockTime = null;
  }
  
  static getRemainingTime() {
    if (!this.locked) return 0;
    const remaining = SecurityConfig.pinConfig.lockoutTime - (Date.now() - this.lockTime);
    return Math.max(0, Math.ceil(remaining / 1000));
  }
}