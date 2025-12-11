# 📚 DOCUMENTACIÓN - TEMAS DEL EVANGELIO

## ¿QUÉ ES ESTA APLICACIÓN?

**Temas del Evangelio** es una aplicación web privada para crear, editar y gestionar notas espirituales sobre temas bíblicos.

- 📝 Crear y editar notas
- 📂 Organizar en categorías
- 🔍 Buscar notas
- ⭐ Marcar favoritas
- 🌙 Modo oscuro
- 🔒 Protegida con PIN
- ☁️ Datos sincronizados en la nube (Firebase)

---

## ARQUITECTURA GENERAL

```
┌─────────────────────────────────────────┐
│        NAVEGADOR DEL USUARIO             │
│  (index.html + CSS + JavaScript)         │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼────┐          ┌────▼────┐
    │ Firebase  │         │ Local Storage │
    │  Firestore│        │ (PIN, Tema)  │
    │ (Notas)   │        └──────────────┘
    └──────────┘
```

### CAPAS:

1. **Frontend (Navegador)** - Lo que ves
   - `index.html` - Estructura HTML
   - `style` en el HTML - Estilos CSS
   - `app-complete.js` - Lógica principal
   - `view-note.html` - Página de lectura

2. **Backend (Firebase)** - Donde se guardan los datos
   - Firestore Database - Base de datos
   - Authentication - Seguridad

3. **Almacenamiento Local** - En el navegador
   - `localStorage` - Tema guardado
   - Variables de sesión

---

## ARCHIVOS PRINCIPALES Y SU FUNCIÓN

### 📄 `index.html`
- **¿QUÉ HACE?**: Estructura principal de la app
- **CONTIENE**: 
  - Header con logo y botones
  - Menú lateral con categorías
  - Grid de notas
  - Modales para editar notas y categorías
  - Todo el CSS
- **¿CUÁNDO SE CARGA?**: Una sola vez, al abrir la app

### 🔧 `firebase.js`
- **¿QUÉ HACE?**: Conexión a Firebase
- **PROPÓSITO**: Centralizar la configuración de Firebase
- **EXPORTA**: 
  - `db` - Referencia a la base de datos
  - Funciones de Firestore (`doc`, `getDoc`, etc.)
- **VENTAJA**: Si necesitas cambiar config de Firebase, solo editas aquí

### 🔐 `firebase-auth.js`
- **¿QUÉ HACE?**: Gestión del PIN de acceso
- **FUNCIONES**: 
  - `validatePin()` - Verifica si el PIN es correcto
  - `changePin()` - Cambia el PIN a uno nuevo
- **SEGURIDAD**: El PIN se guarda en Firestore, encriptado

### 🎮 `auth-handler.js`
- **¿QUÉ HACE?**: Lógica de autenticación en la interfaz
- **TAREAS**:
  - Pedir PIN al abrir la app
  - Validar si el usuario está autenticado
  - Mostrar/ocultar elementos según autenticación

### 📋 `app-complete.js`
- **¿QUÉ HACE?**: LÓGICA PRINCIPAL de la aplicación
- **FUNCIONES CLAVE**:
  - `loadCategories()` - Cargar categorías desde Firebase
  - `renderNotesGrid()` - Mostrar notas en pantalla
  - `openNote()` - Abrir formulario para editar/crear
  - `saveNote()` - Guardar nota en Firebase
  - `filterByCategory()` - Filtrar por categoría
  - `updateCategoryCounts()` - Actualizar números de categorías

### 👁️ `view-note.html`
- **¿QUÉ HACE?**: Mostrar una nota en una nueva pestaña (solo lectura)
- **VENTAJA**: 
  - No ocupa espacio en la pantalla principal
  - Se puede leer sin editar
  - Se puede copiar/imprimir fácilmente

---

## FLUJO DE LA APLICACIÓN

### 1️⃣ USUARIO ABRE LA APP

```
Usuario abre navegador
         ↓
Carga index.html
         ↓
Se ejecuta app-complete.js
         ↓
auth-handler.js pide PIN
         ↓
Si PIN correcto → Se cargan categorías y notas
Si PIN incorrecto → Muestra mensaje de error
```

### 2️⃣ USUARIO VE LAS NOTAS

```
loadCategories()
     ↓
Obtiene categorías de Firestore
     ↓
renderNotesGrid()
     ↓
Obtiene notas filtradas
     ↓
Dibuja cada nota como "card" (tarjeta)
```

### 3️⃣ USUARIO SELECCIONA CATEGORÍA

```
Usuario hace clic en "Teología"
         ↓
filterByCategory("Teología")
         ↓
Actualiza variable global 'filter'
         ↓
Marca "Teología" como activa visualmente
         ↓
renderNotesGrid()
         ↓
Muestra SOLO notas de Teología
```

### 4️⃣ USUARIO CREA NUEVA NOTA

```
Usuario hace clic "+ Crear"
         ↓
openNote(null)  // null = nueva
         ↓
Limpia formulario
         ↓
Muestra modal
         ↓
Usuario escribe contenido
         ↓
Usuario hace clic "Guardar"
         ↓
saveNote()
         ↓
addDoc() - Crea documento nuevo en Firestore
         ↓
Cierra modal
         ↓
updateCategoryCounts() - Actualiza números
         ↓
renderNotesGrid() - Redibuja lista con nota nueva
```

### 5️⃣ USUARIO VE NOTA EN NUEVA PESTAÑA

```
Usuario hace clic "Ver"
         ↓
openReadNote(id)
         ↓
window.open("view-note.html?id=...")
         ↓
Se abre nueva pestaña
         ↓
view-note.html obtiene ID de URL
         ↓
loadNote() carga nota de Firestore
         ↓
Muestra nota en formato lectura
```

---

## CONCEPTOS IMPORTANTES

### 🌐 FIREBASE

Firebase es una plataforma que nos permite:
- Guardar datos en la nube (Firestore)
- Autenticar usuarios
- Sin necesidad de crear nuestro propio servidor

**VENTAJAS**:
- Datos sincronizados en tiempo real
- Accesible desde cualquier dispositivo
- Escalable (crece automáticamente)

**DESVENTAJAS**:
- Requiere conexión a internet
- Costo si se usa mucho

### 💾 FIRESTORE

Es la base de datos de Firebase.

**ESTRUCTURA**:
```
Firestore
├── Colección: "notes"
│   ├── Documento: abc123
│   │   ├── title: "Mi nota"
│   │   ├── content: "Contenido..."
│   │   ├── category: "Teología"
│   │   └── createdAt: "2025-01-15..."
│   ├── Documento: def456
│   └── ...
│
├── Colección: "categories"
│   ├── Documento: cat001
│   │   ├── name: "Teología"
│   │   └── icon: "📖"
│   └── ...
│
└── Colección: "users"
    └── Documento: mainUser
        └── pin: "1234"
```

**OPERACIONES PRINCIPALES**:
- `getDocs()` - Obtener MUCHOS documentos
- `getDoc()` - Obtener UN documento
- `addDoc()` - Crear nuevo documento
- `updateDoc()` - Actualizar existente
- `deleteDoc()` - Eliminar documento

**REGLAS DE SEGURIDAD** (firestore-secure.rules):
```javascript
// Notas - ACCESO COMPLETO (sin validaciones restrictivas)
match /notes/{noteId} {
  allow read, write: if true;
}

// Categorías - ACCESO COMPLETO
match /categories/{categoryId} {
  allow read, write: if true;
}
```

**NOTA**: Las reglas fueron simplificadas (v2.1.0) para eliminar errores de permisos.
Anteriormente había validaciones de tamaño y estructura que causaban problemas
con notas grandes (21,000+ palabras). Ahora permite guardar cualquier tamaño
respetando solo el límite de 1MB de Firebase.

### 🔄 ASYNC/AWAIT

En JavaScript, algunas operaciones toman tiempo (como obtener datos de Firebase).

```javascript
// ❌ MAL - Intenta usar datos antes de tenerlos
const data = getDoc(...);  
console.log(data);  // undefined!

// ✅ BIEN - Espera a que termine
async function cargar() {
  const data = await getDoc(...);  // Espera
  console.log(data);  // Ahora tiene valor
}
```

### 🎨 TEMAS CLARO/OSCURO

Los colores se definen con **CSS variables**:

```css
:root {
  --bg-primary: #ffffff;  /* Fondo principal (claro) */
  --text-primary: #000000;  /* Texto principal (oscuro) */
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;  /* Fondo principal (oscuro) */
  --text-primary: #ffffff;  /* Texto principal (claro) */
}
```

Cambiar tema es tan simple como:
```javascript
document.documentElement.setAttribute('data-theme', 'dark');
```

---

## CÓMO AGREGAR UNA NUEVA FUNCIÓN

### Ejemplo: Agregar función para duplicar notas

**PASO 1: Crear función en `app-complete.js`**
```javascript
async function duplicateNote(noteId) {
  try {
    // Obtener nota original
    const noteDoc = await getDoc(doc(db, "notes", noteId));
    if (!noteDoc.exists()) return;
    
    const original = noteDoc.data();
    
    // Crear copia
    await addDoc(collection(db, "notes"), {
      ...original,
      title: original.title + " (copia)",
      createdAt: new Date().toISOString()
    });
    
    showToast('✅ Nota duplicada', 2000);
    await updateCategoryCounts();
    renderNotesGrid();
  } catch (error) {
    console.error('Error duplicando:', error);
  }
}
```

**PASO 2: Agregar botón en HTML**
```html
<button class="ghost" data-id="..." data-action="duplicate">📋 Duplicar</button>
```

**PASO 3: Agregar en event listener**
```javascript
if (act === 'duplicate') duplicateNote(id);
```

---

## DEBUGGING (ENCONTRAR ERRORES)

### Abrir consola del navegador:
- **Presiona**: F12 o Ctrl+Shift+I (o Cmd+Option+I en Mac)
- **Ve a**: Pestaña "Console"

### Tipos de errores:

```javascript
// ❌ Error de sintaxis - navegador muestra línea roja
const x = { y: 1 // Falta }

// ❌ Error de tipo - intentas usar mal un tipo
const num = "123";
num.map();  // map() es para arrays, no strings

// ❌ Error de referencia - variable no existe
console.log(variableQueNoExiste);  // Undefined

// ✅ Bien - usar console.log() para depurar
console.log('Datos:', datos);
console.error('Error:', error);
console.table(array);  // Muestra array en tabla
```

---

## DESPLEGAR A PRODUCCIÓN

1. **Verificar que funciona en localhost**
   ```bash
   # Desde carpeta del proyecto
   Live Server (extensión de VS Code)
   ```

2. **Subir a Firebase Hosting**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase deploy
   ```

3. **Resultado**: App disponible en `https://temasdelevangelio-3cfa4.web.app`

---

## MEJORAS FUTURAS

### Corto plazo:
- ✅ Lectura en nueva pestaña
- ⏳ Exportar notas a PDF
- ⏳ Compartir notas con otros

### Largo plazo:
- ⏳ App móvil (React Native)
- ⏳ Sincronización offline
- ⏳ Colaboración en tiempo real

---

## CONTACTO Y PREGUNTAS

Si no entiendes algo:
1. Lee los comentarios en el código
2. Busca en Google
3. Consulta documentación oficial:
   - [Firebase Docs](https://firebase.google.com/docs)
   - [MDN Web Docs](https://developer.mozilla.org)
   - [JavaScript.info](https://javascript.info)

---

**Última actualización**: Enero 2025  
**Versión**: 2.0 (Con lectura en nueva pestaña)
