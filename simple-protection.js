/**
 * SISTEMA DE PROTECCIÓN SIMPLIFICADO
 * ==================================
 * 
 * Se activa únicamente con Ctrl + Alt + Shift + D
 * Protege las herramientas de desarrollador de forma elegante
 */

(function() {
  'use strict';
  
  // Estado de la protección - ACTIVA POR DEFECTO
  let protectionActive = true;
  
  /**
   * SOLO desactiva la protección con Ctrl+Alt+Shift+D (para desarrollador)
   */
  function handleProtectionToggle(e) {
    // Detectar Ctrl + Alt + Shift + D para DESACTIVAR
    if (e.ctrlKey && e.altKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      e.stopPropagation();
      
      if (protectionActive) {
        deactivateProtection();
        protectionActive = false;
      } else {
        activateProtection();
        protectionActive = true;
      }
      
      return false;
    }
  }
  
  /**
   * Activa la protección
   */
  function activateProtection() {
    console.log('%c🛡️ PROTECCIÓN ACTIVADA', 'background: #f44336; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
    console.log('Herramientas de desarrollo bloqueadas.');
    
    // Agregar listeners para bloquear herramientas dev
    document.addEventListener('keydown', blockDevKeys, true);
    document.addEventListener('contextmenu', blockContextMenu, true);
    
    // NO mostrar indicador visual para no dar pistas
    // showProtectionIndicator(true);
  }
  
  /**
   * Desactiva la protección
   */
  function deactivateProtection() {
    // Remover listeners
    document.removeEventListener('keydown', blockDevKeys, true);
    document.removeEventListener('contextmenu', blockContextMenu, true);
    
    // Mostrar indicador SOLO cuando está desactivado (para que el desarrollador sepa)
    showProtectionIndicator(false);
  }
  
  /**
   * Bloquea teclas de herramientas de desarrollo
   */
  function blockDevKeys(e) {
    if (!protectionActive) return true;
    
    const blockedKeys = [
      { key: 'F12' }, // F12
      { key: 'I', ctrl: true, shift: true }, // Ctrl+Shift+I
      { key: 'J', ctrl: true, shift: true }, // Ctrl+Shift+J
      { key: 'C', ctrl: true, shift: true }, // Ctrl+Shift+C
      { key: 'U', ctrl: true } // Ctrl+U
    ];
    
    for (const blocked of blockedKeys) {
      const matchesKey = e.key === blocked.key;
      const matchesCtrl = !blocked.ctrl || e.ctrlKey;
      const matchesShift = !blocked.shift || e.shiftKey;
      
      if (matchesKey && matchesCtrl && matchesShift) {
        e.preventDefault();
        e.stopPropagation();
        
        showBlockedMessage();
        return false;
      }
    }
    
    return true;
  }
  
  /**
   * Bloquea menú contextual
   */
  function blockContextMenu(e) {
    if (!protectionActive) return true;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Mostrar menú contextual personalizado
    showCustomContextMenu(e.pageX, e.pageY);
    return false;
  }
  
  /**
   * Muestra mensaje cuando se bloquea una acción
   */
  function showBlockedMessage() {
    // Crear toast de notificación
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ff6b6b, #ee5a52);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      font-weight: 600;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999999;
      animation: slideIn 0.3s ease;
    `;
    
    toast.innerHTML = '🛡️ Funcionalidad bloqueada por seguridad';
    
    // Agregar estilos de animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(toast);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }
  
  /**
   * Solo muestra mensaje de bloqueo, NO da opciones para desbloquear
   */
  function showCustomContextMenu(x, y) {
    showBlockedMessage();
  }
  
  /**
   * Muestra/oculta indicador de protección
   */
  function showProtectionIndicator(protectionOn) {
    let indicator = document.querySelector('.protection-indicator');
    
    if (!protectionOn && !indicator) {
      // Mostrar indicador SOLO cuando está desactivado (para desarrollador)
      indicator = document.createElement('div');
      indicator.className = 'protection-indicator';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        color: white;
        padding: 6px 12px;
        border-radius: 20px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 11px;
        font-weight: 600;
        z-index: 999998;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        animation: pulse 2s infinite;
      `;
      indicator.innerHTML = '🔓 Modo desarrollador';
      
      // Agregar animación de pulso
      const style = document.createElement('style');
      style.textContent = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(indicator);
    } else if (protectionOn && indicator) {
      // Remover indicador cuando la protección está activa (modo normal)
      indicator.remove();
    }
  }
  
  // Configurar el listener principal para Ctrl+Alt+Shift+D
  document.addEventListener('keydown', handleProtectionToggle, true);
  
  // ACTIVAR PROTECCIÓN INMEDIATAMENTE AL CARGAR
  activateProtection();
  
  // Sistema inicializado
  console.log('🛡️ Sistema inicializado');
  
})();