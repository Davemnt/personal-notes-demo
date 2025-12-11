# Temas del Evangelio - Versión Local (Sin Firebase)

Esta es una versión completamente local del proyecto "Temas del Evangelio" que funciona sin necesidad de Firebase ni conexión a internet.

## 🎯 Características

### ✅ Lo que INCLUYE esta versión:
- ✨ Interfaz completa y funcional
- 📱 Diseño responsivo (móvil y desktop)  
- 📝 Sistema completo de gestión de notas
- 📂 Categorización de notas con iconos
- 🔍 Búsqueda por título, contenido y etiquetas
- ⭐ Sistema de notas favoritas
- 🌙 Tema claro/oscuro
- 🔐 Sistema de PIN local para protección
- 💾 Almacenamiento local (localStorage del navegador)
- 📖 Vista previa en Markdown
- 🎨 Interfaz moderna y atractiva
- 🍔 Menú hamburguesa para móviles

### ❌ Lo que NO incluye (vs. versión Firebase):
- 🚫 Sincronización en la nube
- 🚫 Backup automático
- 🚫 Acceso desde múltiples dispositivos
- 🚫 Autenticación de Firebase
- 🚫 Funciones de compartir/colaboración
- 🚫 Adjuntos de archivos (PDFs, imágenes)
- 🚫 Anotaciones históricas avanzadas

## 🚀 Cómo usar

### Instalación:
1. Descarga todos los archivos de esta carpeta
2. Abre `index.html` en tu navegador
3. ¡Listo! No necesitas servidor ni configuración adicional

### Primer uso:
1. **PIN por defecto**: `1234`
2. Cambia el PIN desde "Ajustes PIN" después del primer login
3. Comienza a crear tus notas

## 📁 Archivos incluidos

```
Blog2-SinFirebase/
├── index.html              # Archivo principal de la aplicación
├── app-local.js            # Lógica JavaScript (sin Firebase)
├── simple-protection.js    # Sistema de protección básico
├── config-security.js      # Configuración de seguridad
├── README.md              # Este archivo
├── demo.html              # Página de demostración
├── test.html              # Página de pruebas
├── check-pin.html         # Verificador de PIN standalone
├── verify-pin.html        # Verificador alternativo
└── [archivos .md]         # Documentación adicional
```

## 🔧 Configuración

### Cambiar PIN por defecto:
El PIN por defecto es `1234`. Para cambiarlo:
1. Inicia la app con el PIN por defecto
2. Ve a "Ajustes PIN" 
3. Cambia al PIN que prefieras (4-6 dígitos)

### Personalizar categorías:
- Categorías por defecto: General, Escrituras, Testimonio, Oraciones
- Puedes agregar, editar y eliminar categorías desde el menú lateral
- Cada categoría puede tener un emoji personalizado

## 💾 Almacenamiento de datos

### Dónde se guardan los datos:
- **Navegador**: localStorage del navegador web
- **Ubicación**: Específica para cada navegador y dominio
- **Persistencia**: Los datos persisten hasta que limpies el cache del navegador

### ⚠️ Importante sobre los datos:
- **Backup manual**: Exporta/importa tus notas periódicamente
- **Navegador específico**: Los datos no se sincronizan entre navegadores
- **Limpieza de cache**: Si limpias el cache, perderás las notas
- **Computadora específica**: Los datos no se transfieren automáticamente

### Hacer backup manualmente:
```javascript
// En la consola del navegador (F12):
// Exportar datos
console.log(JSON.stringify({
  notes: JSON.parse(localStorage.getItem('temasEvangelio_notes') || '[]'),
  categories: JSON.parse(localStorage.getItem('temasEvangelio_categories') || '[]')
}));

// Importar datos (reemplaza DATA con tu backup):
localStorage.setItem('temasEvangelio_notes', JSON.stringify(DATA.notes));
localStorage.setItem('temasEvangelio_categories', JSON.stringify(DATA.categories));
```

## 🎨 Personalización

### Cambiar colores:
Edita las variables CSS en `index.html`:
```css
:root {
  --accent-color: #ed8936;  /* Color principal */
  --bg-primary: #f5f7fa;    /* Fondo principal */
  /* ... más variables */
}
```

### Agregar funciones:
- Edita `app-local.js` para agregar nuevas características
- Todas las funciones usan localStorage para persistencia

## 🛠️ Solución de problemas

### La app no carga:
1. Verifica que todos los archivos estén en la misma carpeta
2. Abre la consola del navegador (F12) para ver errores
3. Prueba en modo incógnito

### PIN olvidado:
```javascript
// En la consola del navegador (F12):
localStorage.removeItem('temasEvangelio_pin');
// Recarga la página, el PIN volverá a ser 1234
```

### Datos perdidos:
- Los datos se guardan automáticamente
- Si se pierden, es porque se limpió el localStorage
- Restaura desde tu backup manual

### Problemas de rendimiento:
- La app puede volverse lenta con muchas notas (>1000)
- Considera hacer limpieza periódica de notas antiguas

## 🔒 Seguridad

### Nivel de seguridad:
- **Básico**: PIN simple para acceso
- **Local**: Datos solo en tu dispositivo
- **Sin encriptación**: Los datos se guardan en texto plano en localStorage

### Recomendaciones:
1. Cambia el PIN por defecto inmediatamente
2. No uses en computadoras públicas
3. Haz backups regulares
4. No guardes información extremadamente sensible

## 📞 Soporte

Esta versión local es autónoma y no incluye soporte técnico directo. Para problemas:

1. **Revisa la documentación** incluida
2. **Consulta la consola del navegador** para errores
3. **Haz pruebas** en modo incógnito
4. **Restaura desde backup** si hay problemas de datos

## 📈 Futuras mejoras posibles

Si quieres mejorar esta versión, considera:
- [ ] Sistema de backup/restore automático
- [ ] Exportación a PDF/Word
- [ ] Temas adicionales
- [ ] Plantillas de notas
- [ ] Sistema de etiquetas avanzado
- [ ] Búsqueda más potente con filtros
- [ ] Estadísticas de uso
- [ ] Modo sin conexión mejorado

## 🆚 Comparación con versión Firebase

| Característica | Local | Firebase |
|---|---|---|
| Instalación | ✅ Simple | ❌ Compleja |
| Acceso offline | ✅ Siempre | ⚠️ Limitado |
| Sincronización | ❌ No | ✅ Sí |
| Costo | ✅ Gratis | ⚠️ Potencial costo |
| Backup automático | ❌ No | ✅ Sí |
| Multi-dispositivo | ❌ No | ✅ Sí |
| Configuración | ✅ Ninguna | ❌ API keys, etc. |
| Seguridad | ⚠️ Básica | ✅ Avanzada |

---

**¡Disfruta tomando notas espirituales!** 🙏✨

*"La palabra de Cristo habite en abundancia en vosotros"* - Colosenses 3:16