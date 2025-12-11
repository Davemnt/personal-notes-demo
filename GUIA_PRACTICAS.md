# 🎯 GUÍA DE MEJORES PRÁCTICAS - JAVASCRIPT/FIREBASE

## Escribir Código Limpio y Profesional

---

## 1️⃣ NOMBRES SIGNIFICATIVOS

### ❌ MAL
```javascript
const x = getDocs(collection(db, "notes"));
const c = x.filter(n => n.data().t === "t1");
function p() { ... }
```

### ✅ BIEN
```javascript
const allNotes = getDocs(collection(db, "notes"));
const theologyNotes = allNotes.filter(note => note.category === "Theology");
async function loadCategoriesFromFirebase() { ... }
```

**REGLAS**:
- Nombres descriptivos (qué hace, qué almacena)
- Verbos para funciones: `load`, `render`, `fetch`, `save`, `update`, `delete`
- Variables en minúsculas con camelCase: `myVariable`
- Constantes en MAYÚSCULAS: `MAX_NOTES = 100`

---

## 2️⃣ FUNCIONES PEQUEÑAS Y ENFOCADAS

### ❌ MAL - Una función que hace demasiado
```javascript
async function doEverything() {
  const notes = await getDocs(collection(db, "notes"));
  const filtered = notes.filter(...);
  filtered.forEach(note => {
    const el = document.createElement('div');
    el.innerHTML = `<h3>${note.title}</h3>...`;
    document.getElementById('grid').appendChild(el);
  });
  // ... más código ...
}
```

### ✅ BIEN - Dividir en funciones pequeñas
```javascript
async function fetchNotes() {
  return await getDocs(collection(db, "notes"));
}

function filterNotes(notes, category) {
  return notes.filter(n => n.category === category);
}

function createNoteElement(note) {
  const el = document.createElement('article');
  el.className = 'card';
  el.innerHTML = `<h3>${escapeHtml(note.title)}</h3>`;
  return el;
}

async function renderNotesGrid() {
  const allNotes = await fetchNotes();
  const filtered = filterNotes(allNotes, filter.category);
  notesGrid.innerHTML = '';
  filtered.forEach(note => {
    notesGrid.appendChild(createNoteElement(note));
  });
}
```

**VENTAJAS**:
- Fácil de entender (cada función hace una cosa)
- Fácil de testear (probar cada parte)
- Reutilizable (usar función en otros lugares)

---

## 3️⃣ MANEJO DE ERRORES

### ❌ MAL - Ignorar errores
```javascript
const data = await getDoc(doc(db, "notes", id));
console.log(data.title);  // ¿Y si data no existe?
```

### ✅ BIEN - Verificar y manejar errores
```javascript
async function getNoteOrNull(id) {
  try {
    const noteDoc = await getDoc(doc(db, "notes", id));
    if (!noteDoc.exists()) {
      console.warn('Nota no encontrada:', id);
      return null;
    }
    return noteDoc.data();
  } catch (error) {
    console.error('Error obteniendo nota:', error);
    showToast('❌ Error cargando nota', 2000);
    return null;
  }
}
```

**ESTRUCTURA TRY/CATCH**:
```javascript
try {
  // Código que PODRÍA fallar
  const data = await operacionQuePuedeFallar();
} catch (error) {
  // Si falla, ejecutar aquí
  console.error('Error:', error.message);
  showToast('❌ Error occurred', 2000);
} finally {
  // OPCIONAL: Ejecutar siempre (cierre de recursos)
  closeModal();
}
```

---

## 4️⃣ EVITAR EFECTOS SECUNDARIOS

### ❌ MAL - Función cambia estado global
```javascript
let globalCounter = 0;

function incrementAndRender() {
  globalCounter++;  // Modifica variable global
  renderUI();       // Modifica DOM
  updateServer();   // Modifica servidor
}
```

### ✅ BIEN - Función pura (entrada clara, salida clara)
```javascript
function increment(counter) {
  return counter + 1;  // SOLO calcula, no modifica nada
}

async function handleIncrementClick() {
  counter = increment(counter);  // Actualizar variable local
  await updateCounterInFirebase(counter);
  renderUI();
}
```

**BENEFICIOS**:
- Predecible (no hay sorpresas)
- Testeable (probar sin efectos secundarios)
- Debuggeable (no hay efectos ocultos)

---

## 5️⃣ COMENTARIOS ÚTILES

### ❌ MAL - Comentarios obvios
```javascript
// Incrementar x
x++;

// Loop por cada nota
notes.forEach(note => {
  // Mostrar nota
  console.log(note);
});
```

### ✅ BIEN - Comentarios que explican POR QUÉ
```javascript
// Increment immediately so UI updates synchronously
x++;

// Loop por nota y renderizar para evitar N+1 queries
// (Si usáramos .find() adentro, sería más lento)
notes.forEach(note => {
  renderNoteCard(note);
});
```

**CUÁNDO COMENTAR**:
- Lógica compleja o no obvia
- Decisiones de diseño importantes
- Advertencias sobre rendimiento
- Workarounds para bugs de navegadores

---

## 6️⃣ ASYNC/AWAIT vs PROMISES

### ❌ Promesas (más viejo, confuso)
```javascript
function loadNotes() {
  return getDocs(collection(db, "notes"))
    .then(snap => {
      return snap.docs.map(d => d.data());
    })
    .then(data => {
      renderNotesGrid(data);
    })
    .catch(error => {
      console.error(error);
    });
}
```

### ✅ Async/Await (más nuevo, claro)
```javascript
async function loadNotes() {
  try {
    const snap = await getDocs(collection(db, "notes"));
    const data = snap.docs.map(d => d.data());
    renderNotesGrid(data);
  } catch (error) {
    console.error(error);
  }
}
```

**VENTAJAS ASYNC/AWAIT**:
- Más fácil de leer (parece código síncrono)
- Mejor manejo de errores
- Más moderna (estándar ES2017)

---

## 7️⃣ ARREGLOS - MÉTODOS ÚTILES

### Buscar elemento
```javascript
const notes = [{id: 1, title: 'A'}, {id: 2, title: 'B'}];

// ❌ MAL
for (let i = 0; i < notes.length; i++) {
  if (notes[i].id === 2) return notes[i];
}

// ✅ BIEN
const note = notes.find(n => n.id === 2);
```

### Transformar arreglo
```javascript
const notes = [{title: 'A'}, {title: 'B'}];

// ❌ MAL
const titles = [];
for (let note of notes) {
  titles.push(note.title);
}

// ✅ BIEN
const titles = notes.map(n => n.title);
```

### Filtrar elementos
```javascript
const notes = [{fav: true}, {fav: false}];

// ❌ MAL
const favorites = [];
for (let note of notes) {
  if (note.fav) favorites.push(note);
}

// ✅ BIEN
const favorites = notes.filter(n => n.fav);
```

### Verificar condición
```javascript
const users = [{admin: true}, {admin: false}];

// ❌ MAL
let isAdmin = false;
for (let user of users) {
  if (user.admin) isAdmin = true;
}

// ✅ BIEN
const isAdmin = users.some(u => u.admin);
```

---

## 8️⃣ OBJETOS - SPREAD OPERATOR

### ❌ MAL - Copiar propiedades una por una
```javascript
const user = {name: 'Juan', age: 30};
const updated = {
  name: user.name,
  age: user.age,
  role: 'admin'
};
```

### ✅ BIEN - Usar spread operator (...)
```javascript
const user = {name: 'Juan', age: 30};
const updated = {...user, role: 'admin'};
// Resultado: {name: 'Juan', age: 30, role: 'admin'}
```

---

## 9️⃣ VALIDACIÓN DE ENTRADA

### ❌ MAL - Confiar en que datos son correctos
```javascript
function saveUserData(userData) {
  updateDoc(doc(db, "users", userData.id), userData);
}

saveUserData({});  // ¿Tiene .id? ¿Qué pasa si falla?
```

### ✅ BIEN - Validar antes de usar
```javascript
function saveUserData(userData) {
  // Validar que existen los campos necesarios
  if (!userData?.id) {
    throw new Error('userData.id is required');
  }
  if (!userData.name?.trim()) {
    throw new Error('userData.name cannot be empty');
  }
  
  updateDoc(doc(db, "users", userData.id), userData);
}

try {
  saveUserData({id: 'user123', name: 'Juan'});
} catch (error) {
  console.error('Invalid data:', error.message);
}
```

---

## 🔟 PERFORMANCE - EVITAR LOOPS INNECESARIOS

### ❌ MAL - Dos loops (N²)
```javascript
const notes = [nota1, nota2, ...];
const categories = [cat1, cat2, ...];

// Para cada nota, buscar su categoría
notes.forEach(note => {
  const category = categories.find(c => c.id === note.categoryId);
  // INEFICIENTE: O(N²)
});
```

### ✅ BIEN - Crear mapa (N)
```javascript
// Crear mapa para búsqueda rápida
const categoryMap = {};
categories.forEach(cat => {
  categoryMap[cat.id] = cat;
});

// Usar mapa (más rápido)
notes.forEach(note => {
  const category = categoryMap[note.categoryId];
  // EFICIENTE: O(N)
});
```

---

## 1️⃣1️⃣ DEBUGGING - HERRAMIENTAS ÚTILES

```javascript
// 1. console.log() - Básico
console.log('Nota:', note);

// 2. console.error() - Errores
console.error('Error cargando:', error);

// 3. console.table() - Ver array como tabla
console.table(notes);

// 4. console.time() - Medir tiempo
console.time('loadNotes');
const notes = await getDocs(...);
console.timeEnd('loadNotes');

// 5. Debugger - Parar ejecución
debugger;  // Presionar F12, luego ejecutar código línea por línea

// 6. Network tab - Ver requests a Firebase
// F12 → Network → ver todas las requests
```

---

## 1️⃣2️⃣ TESTING - VERIFICAR QUE FUNCIONA

```javascript
// Función a testear
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// Test 1: Casos normales
console.assert(calculateTotal([{price: 10}, {price: 20}]) === 30, 'Failed: normal case');

// Test 2: Casos especiales
console.assert(calculateTotal([]) === 0, 'Failed: empty array');
console.assert(calculateTotal([{price: 0}]) === 0, 'Failed: zero price');

// Si todo pasa → sin mensajes
// Si falla → "Assertion failed"
```

---

## 1️⃣3️⃣ SEGURIDAD - ESCAPAR HTML

### ❌ MAL - HTML Injection vulnerability
```javascript
const comment = "<script>alert('Hacked!')</script>";
el.innerHTML = `<div>${comment}</div>`;  // ¡Ejecuta el script!
```

### ✅ BIEN - Usar función de escape
```javascript
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

const comment = "<script>alert('Hacked!')</script>";
el.innerHTML = `<div>${escapeHtml(comment)}</div>`;  // Muestra como texto
```

---

## 1️⃣4️⃣ CONVENCIONES EN NUESTRO PROYECTO

```javascript
// Nomenclatura
const noteId = '123';           // Camel case
const MAX_RETRIES = 3;          // Constantes MAYÚS
async function loadNotes() {}   // Verbos para funciones
class NoteManager {}            // Clases TitleCase

// Estructura de archivo
// 1. Imports
// 2. Constantes globales
// 3. Elementos del DOM
// 4. Variables de estado
// 5. Funciones auxiliares
// 6. Funciones principales
// 7. Event listeners

// Comentarios en español
// Documentación arriba de funciones complejas
// Console.error para errores reales
```

---

## CHECKLIST - ANTES DE HACER COMMIT

- ✅ Código funciona sin errores en consola
- ✅ Nombres de variables son claros
- ✅ Funciones tienen un propósito único
- ✅ Hay manejo de errores (try/catch)
- ✅ No hay código muerto (borrar `console.log` temporales)
- ✅ Comentarios útiles en lógica compleja
- ✅ Datos están escapados (sin inyecciones XSS)
- ✅ Tested manualmente en navegador

---

**Última actualización**: Enero 2025
