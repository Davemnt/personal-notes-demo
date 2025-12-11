# 🔒 Sistema de Protección de Inspección

## 📋 Descripción

Este sistema protege la aplicación **Temas del Evangelio** contra el acceso no autorizado a las herramientas de desarrollador del navegador. Solo el desarrollador autorizado puede acceder a las herramientas de inspección.

## 🔑 Acceso de Desarrollador

### Clave de Acceso
**Clave:** `DevAccess2025!`

### Métodos para Obtener Acceso

1. **Función Global:**
   ```javascript
   window.devAccess()
   ```

2. **Cuando se Detecta Inspección:**
   - El sistema mostrará automáticamente un prompt solicitando la clave

3. **Desde el Menú Contextual:**
   - Clic derecho → "🔑 Acceso desarrollador"

## 🛡️ Funciones de Protección

### Detección de Herramientas de Desarrollo
- **Teclas Bloqueadas:**
  - `F12` - Herramientas de desarrollador
  - `Ctrl+Shift+I` - Inspeccionar elemento
  - `Ctrl+Shift+J` - Consola de JavaScript
  - `Ctrl+Shift+C` - Selector de elementos
  - `Ctrl+U` - Ver código fuente

- **Métodos de Detección:**
  - Análisis del tamaño de ventana
  - Detección por performance del debugger
  - Monitoreo de cambios en el DOM
  - Bloqueo de menú contextual

### Protecciones Adicionales
- Menú contextual personalizado
- Prevención de selección de texto (opcional)
- Limpieza automática de la consola
- Monitoreo continuo en segundo plano

## 🎯 Archivos Protegidos

### Archivos Principales
- ✅ `index.html` - Aplicación principal
- ✅ `verify-pin.html` - Verificación de PIN  
- ✅ `view-note.html` - Visualización de notas
- ✅ `nota-editar.html` - Editor de notas
- ✅ `nota-vista.html` - Vista de notas
- ✅ `diagnostic.html` - Herramienta de diagnóstico

### Archivo de Protección
- `security-protection.js` - Sistema de protección principal

## ⚙️ Configuración

### Variables de Configuración
```javascript
const CONFIG = {
  DEV_KEY_HASH: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',
  DETECTION_THRESHOLD: 160,
  PERFORMANCE_THRESHOLD: 100,
  CHECK_INTERVAL: 1000,
  PERFORMANCE_CHECK_INTERVAL: 5000
};
```

### Funciones de Control
```javascript
// Verificar información del sistema
window.protectionInfo()

// Desactivar protección (solo desarrollador)
window.disableProtection()

// Solicitar acceso de desarrollador
window.devAccess()
```

## 🚨 Respuesta a Intentos de Acceso

### Pantalla de Bloqueo
Cuando se detecta un intento no autorizado:
- Reemplaza completamente el contenido de la página
- Muestra mensaje de acceso restringido
- Ofrece opción de recarga automática
- Proporciona botón para solicitar acceso de desarrollador

### Características de Seguridad
- **Hash SHA-256** para la clave de desarrollador
- **Almacenamiento local** de credenciales por sesión
- **Múltiples métodos de detección** para mayor seguridad
- **Interfaz amigable** para usuarios legítimos

## 📊 Estadísticas de Protección

### Métodos de Detección Activos
1. **Keyboard shortcuts** - Bloquea teclas de acceso directo
2. **Window size analysis** - Detecta herramientas por tamaño de ventana
3. **Performance debugger detection** - Usa debugger para detectar herramientas
4. **Context menu blocking** - Reemplaza menú contextual
5. **DOM mutation monitoring** - Vigila cambios sospechosos

### Nivel de Protección
- **Alto** - Múltiples capas de seguridad
- **No Intrusivo** - Permite uso normal de la aplicación
- **Desarrollador-Friendly** - Fácil acceso para desarrollador autorizado

## 🔧 Mantenimiento

### Actualizar Clave de Desarrollador
1. Generar nuevo hash SHA-256 de la nueva clave
2. Actualizar `DEV_KEY_HASH` en `security-protection.js`
3. Redesplegar la aplicación

### Ajustar Sensibilidad de Detección
- Modificar `DETECTION_THRESHOLD` para ventanas
- Ajustar `PERFORMANCE_THRESHOLD` para debugger
- Cambiar intervalos de verificación según necesidad

## ⚠️ Notas Importantes

### Para el Desarrollador
- Guarda la clave de desarrollador en lugar seguro
- La protección se desactiva automáticamente con acceso válido
- Usa `localStorage` para persistir acceso durante la sesión

### Para los Usuarios
- La protección es transparente durante uso normal
- Solo se activa cuando se intentan abrir herramientas de desarrollo
- Proporciona opciones de navegación alternativas en menú contextual

### Compatibilidad
- **Navegadores Modernos:** Chrome, Firefox, Safari, Edge
- **Dispositivos:** Desktop, tablet y móvil
- **JavaScript:** ES6+ requerido

---

**Desarrollado por:** David Monte  
**Versión:** 1.0.0  
**Fecha:** Diciembre 2025