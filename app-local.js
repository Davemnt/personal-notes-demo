/**
 * ========================================
 * APP-LOCAL.JS - LÓGICA PRINCIPAL SIN FIREBASE
 * ========================================
 * 
 * ARCHIVO PRINCIPAL DE LA APLICACIÓN (VERSIÓN LOCAL)
 * 
 * ¿QUÉ HACE?
 * Este archivo contiene toda la lógica de la aplicación sin Firebase:
 * - Gestión de notas (crear, editar, eliminar, leer) usando localStorage
 * - Gestión de categorías locales
 * - Renderización del UI (interfaz de usuario)
 * - Filtrado y búsqueda
 * - Manejo de eventos del usuario
 * - Sistema PIN simplificado
 * 
 * DIFERENCIAS CON LA VERSIÓN FIREBASE:
 * - Usa localStorage en lugar de Firestore
 * - No requiere autenticación de Firebase
 * - Sistema de PIN local
 * - Funciona completamente offline
 * 
 * FLUJO GENERAL:
 * 1. Usuario abre app → se carga index.html
 * 2. index.html importa app-local.js
 * 3. Se verifica PIN local
 * 4. Se inicializa la interfaz (loadCategories, renderNotesGrid)
 * 5. Usuario interactúa (clics, escritura, etc.)
 * 6. Se ejecutan las funciones correspondientes
 * 7. Se actualiza la pantalla y localStorage
 */

// =========================
// CONFIGURACIÓN LOCAL
// =========================

const LOCAL_STORAGE_KEYS = {
  notes: 'knowledgeHub_notes',
  categories: 'knowledgeHub_categories', 
  pin: 'knowledgeHub_pin',
  theme: 'knowledgeHub_theme',
  settings: 'knowledgeHub_settings'
};

const DEFAULT_PIN = '1234'; // PIN por defecto
let isLoggedIn = false;
let currentEditingNoteId = null;
let allNotes = [];
let allCategories = [];
let filteredNotes = [];
let currentFilter = 'all';

// =========================
// ELEMENTOS DEL DOM
// =========================

const elements = {
  // PIN Screen
  pinScreen: document.getElementById('pinScreen'),
  pinInput: document.getElementById('pinInput'),
  pinBtn: document.getElementById('pinBtn'),
  pinMsg: document.getElementById('pinMsg'),
  pinToggle: document.getElementById('pinToggle'),
  
  // Main App
  search: document.getElementById('search'),
  searchMobile: document.getElementById('searchMobile'),
  themeBtn: document.getElementById('themeBtn'),
  themeBtnMobile: document.getElementById('themeBtnMobile'),
  
  // Categories
  categoryList: document.getElementById('categoryList'),
  addCategory: document.getElementById('addCategory'),
  
  // Notes Grid
  notesGrid: document.getElementById('notesGrid'),
  btnNewNote: document.getElementById('btnNewNote'),
  btnFavorites: document.getElementById('btnFavorites'),
  btnAll: document.getElementById('btnAll'),
  
  // Note Modal
  noteOverlay: document.getElementById('noteOverlay'),
  modalTitle: document.getElementById('modalTitle'),
  noteTitle: document.getElementById('noteTitle'),
  noteContent: document.getElementById('noteContent'),
  notePreview: document.getElementById('notePreview'),
  noteTags: document.getElementById('noteTags'),
  noteCategory: document.getElementById('noteCategory'),
  noteFav: document.getElementById('noteFav'),
  saveNoteBtn: document.getElementById('saveNoteBtn'),
  closeNoteBtn: document.getElementById('closeNoteBtn'),
  wordCount: document.getElementById('wordCount'),
  
  // PIN Settings
  pinOverlay: document.getElementById('pinOverlay'),
  openPinSettings: document.getElementById('openPinSettings'),
  openPinSettingsMobile: document.getElementById('openPinSettingsMobile'),
  closePinSettings: document.getElementById('closePinSettings'),
  curPin: document.getElementById('curPin'),
  newPin: document.getElementById('newPin'),
  changePinBtn: document.getElementById('changePinBtn'),
  pinChangeMsg: document.getElementById('pinChangeMsg'),
  
  // Category Modal
  categoryOverlay: document.getElementById('categoryOverlay'),
  categoryModalTitle: document.getElementById('categoryModalTitle'),
  categoryName: document.getElementById('categoryName'),
  categoryIcon: document.getElementById('categoryIcon'),
  saveCategoryBtn: document.getElementById('saveCategoryBtn'),
  closeCategoryModal: document.getElementById('closeCategoryModal'),
  deleteCategoryBtn: document.getElementById('deleteCategoryBtn'),
  categoryMsg: document.getElementById('categoryMsg'),
  
  // Status
  statusInfo: document.getElementById('statusInfo'),
  savedStatus: document.getElementById('savedStatus'),
  currentTitle: document.getElementById('currentTitle'),
  subInfo: document.getElementById('subInfo'),
  
  // Logout
  logoutBtn: document.getElementById('logoutBtn'),
  logoutBtnMobile: document.getElementById('logoutBtnMobile')
};

// =========================
// UTILIDADES
// =========================

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
  return new Date(date).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  if (type === 'success') {
    toast.style.background = 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)';
  } else if (type === 'error') {
    toast.style.background = 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)';
  }
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Simple Markdown renderer
function renderMarkdown(text) {
  if (!text) return '';
  
  let html = sanitizeHTML(text);
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  html = html.replace(/_(.*?)_/gim, '<em>$1</em>');
  
  // Line breaks
  html = html.replace(/\n/gim, '<br>');
  
  // Lists
  html = html.replace(/^\* (.+)/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');
  
  return html;
}

// =========================
// GESTIÓN DE DATOS LOCALES
// =========================

function saveToLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

function loadFromLocal(key, defaultValue = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
}

function initializeDefaultData() {
  // Inicializar PIN si no existe
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.pin)) {
    saveToLocal(LOCAL_STORAGE_KEYS.pin, DEFAULT_PIN);
  }
  
  // Inicializar categorías por defecto
  const categories = loadFromLocal(LOCAL_STORAGE_KEYS.categories, []);
  if (categories.length === 0) {
    const defaultCategories = [
      { id: 'general', name: 'General', icon: '📝', createdAt: Date.now() },
      { id: 'learning', name: 'Aprendizaje', icon: '📚', createdAt: Date.now() },
      { id: 'projects', name: 'Proyectos', icon: '🚀', createdAt: Date.now() },
      { id: 'ideas', name: 'Ideas', icon: '💡', createdAt: Date.now() },
      { id: 'resources', name: 'Recursos', icon: '🔗', createdAt: Date.now() }
    ];
    saveToLocal(LOCAL_STORAGE_KEYS.categories, defaultCategories);
  }
  
  // Cargar tema
  const theme = loadFromLocal(LOCAL_STORAGE_KEYS.theme, 'light');
  document.body.setAttribute('data-theme', theme);
}

// =========================
// SISTEMA PIN
// =========================

function initPinSystem() {
  // Pin toggle visibility
  elements.pinToggle?.addEventListener('click', () => {
    const input = elements.pinInput;
    if (input.type === 'password') {
      input.type = 'text';
      elements.pinToggle.textContent = '🙈';
    } else {
      input.type = 'password';
      elements.pinToggle.textContent = '👁️';
    }
  });
  
  // Pin login
  elements.pinBtn?.addEventListener('click', checkPin);
  elements.pinInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkPin();
    }
  });
  
  // PIN Settings
  elements.openPinSettings?.addEventListener('click', () => {
    elements.pinOverlay.classList.add('open');
  });
  
  elements.openPinSettingsMobile?.addEventListener('click', () => {
    elements.pinOverlay.classList.add('open');
  });
  
  elements.closePinSettings?.addEventListener('click', () => {
    elements.pinOverlay.classList.remove('open');
  });
  
  elements.changePinBtn?.addEventListener('click', changePin);
  
  // PIN toggles in settings
  const curPinToggle = document.getElementById('curPinToggle');
  const newPinToggle = document.getElementById('newPinToggle');
  
  curPinToggle?.addEventListener('click', () => {
    const input = elements.curPin;
    if (input.type === 'password') {
      input.type = 'text';
      curPinToggle.textContent = '🙈';
    } else {
      input.type = 'password';
      curPinToggle.textContent = '👁️';
    }
  });
  
  newPinToggle?.addEventListener('click', () => {
    const input = elements.newPin;
    if (input.type === 'password') {
      input.type = 'text';
      newPinToggle.textContent = '🙈';
    } else {
      input.type = 'password';
      newPinToggle.textContent = '👁️';
    }
  });
}

function checkPin() {
  const inputPin = elements.pinInput.value.trim();
  const storedPin = loadFromLocal(LOCAL_STORAGE_KEYS.pin, DEFAULT_PIN);
  
  if (inputPin === storedPin) {
    isLoggedIn = true;
    elements.pinScreen.style.display = 'none';
    showToast('¡Acceso concedido! Bienvenido/a', 'success');
    initApp();
  } else {
    elements.pinMsg.style.display = 'block';
    elements.pinMsg.textContent = 'PIN incorrecto. Inténtalo de nuevo.';
    elements.pinMsg.style.color = '#f56565';
    elements.pinInput.value = '';
    elements.pinInput.focus();
  }
}

function changePin() {
  const currentPin = elements.curPin.value.trim();
  const newPin = elements.newPin.value.trim();
  const storedPin = loadFromLocal(LOCAL_STORAGE_KEYS.pin, DEFAULT_PIN);
  
  if (currentPin !== storedPin) {
    elements.pinChangeMsg.textContent = 'PIN actual incorrecto';
    elements.pinChangeMsg.style.color = '#f56565';
    return;
  }
  
  if (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
    elements.pinChangeMsg.textContent = 'El nuevo PIN debe tener 4-6 números';
    elements.pinChangeMsg.style.color = '#f56565';
    return;
  }
  
  saveToLocal(LOCAL_STORAGE_KEYS.pin, newPin);
  elements.pinChangeMsg.textContent = 'PIN cambiado exitosamente';
  elements.pinChangeMsg.style.color = '#48bb78';
  elements.curPin.value = '';
  elements.newPin.value = '';
  
  showToast('PIN actualizado correctamente', 'success');
}

function logout() {
  isLoggedIn = false;
  elements.pinScreen.style.display = 'flex';
  elements.pinInput.value = '';
  elements.pinMsg.style.display = 'none';
  
  // Cerrar todos los modales
  elements.noteOverlay.classList.remove('open');
  elements.categoryOverlay.classList.remove('open');
  elements.pinOverlay.classList.remove('open');
  
  showToast('Sesión cerrada', 'info');
}

// =========================
// GESTIÓN DE CATEGORÍAS
// =========================

function loadCategories() {
  allCategories = loadFromLocal(LOCAL_STORAGE_KEYS.categories, []);
  renderCategoriesList();
  renderCategoriesDropdown();
}

function renderCategoriesList() {
  const categoryList = elements.categoryList;
  if (!categoryList) return;
  
  // Contar notas por categoría
  const noteCounts = {};
  allNotes.forEach(note => {
    const catId = note.categoryId || 'general';
    noteCounts[catId] = (noteCounts[catId] || 0) + 1;
  });
  
  // Todas las notas
  const allCount = allNotes.length;
  const favCount = allNotes.filter(note => note.favorite).length;
  
  categoryList.innerHTML = `
    <li class="cat-item ${currentFilter === 'all' ? 'active' : ''}" data-filter="all">
      <span>📋 Todas las notas</span>
      <span class="category-count">${allCount}</span>
    </li>
    <li class="cat-item ${currentFilter === 'favorites' ? 'active' : ''}" data-filter="favorites">
      <span>⭐ Favoritas</span>
      <span class="category-count">${favCount}</span>
    </li>
    <hr style="border:none;border-top:1px solid var(--border-light);margin:8px 0">
  `;
  
  // Agregar categorías personalizadas
  allCategories.forEach(category => {
    const count = noteCounts[category.id] || 0;
    const isActive = currentFilter === category.id;
    
    categoryList.innerHTML += `
      <li class="cat-item ${isActive ? 'active' : ''}" data-filter="${category.id}">
        <span>${category.icon} ${category.name}</span>
        <div style="display:flex;gap:4px;align-items:center">
          <span class="category-count">${count}</span>
          <button class="ghost" style="padding:2px 6px;font-size:12px" onclick="editCategory('${category.id}')">✏️</button>
        </div>
      </li>
    `;
  });
  
  // Event listeners para filtrado
  categoryList.addEventListener('click', (e) => {
    const catItem = e.target.closest('.cat-item');
    if (catItem && !e.target.closest('button')) {
      const filter = catItem.dataset.filter;
      setFilter(filter);
    }
  });
}

function renderCategoriesDropdown() {
  const dropdown = elements.noteCategory;
  if (!dropdown) return;
  
  dropdown.innerHTML = '<option value="">Sin categoría</option>';
  
  allCategories.forEach(category => {
    dropdown.innerHTML += `
      <option value="${category.id}">${category.icon} ${category.name}</option>
    `;
  });
}

function setFilter(filter) {
  currentFilter = filter;
  
  // Actualizar UI
  document.querySelectorAll('.cat-item').forEach(item => {
    item.classList.toggle('active', item.dataset.filter === filter);
  });
  
  // Filtrar notas
  if (filter === 'all') {
    filteredNotes = [...allNotes];
    elements.currentTitle.textContent = '📋 Todas las notas';
    elements.subInfo.textContent = `${allNotes.length} notas guardadas localmente`;
  } else if (filter === 'favorites') {
    filteredNotes = allNotes.filter(note => note.favorite);
    elements.currentTitle.textContent = '⭐ Notas favoritas';
    elements.subInfo.textContent = `${filteredNotes.length} notas favoritas`;
  } else {
    filteredNotes = allNotes.filter(note => note.categoryId === filter);
    const category = allCategories.find(cat => cat.id === filter);
    const catName = category ? `${category.icon} ${category.name}` : 'Categoría';
    elements.currentTitle.textContent = catName;
    elements.subInfo.textContent = `${filteredNotes.length} notas en esta categoría`;
  }
  
  renderNotesGrid();
}

// =========================
// GESTIÓN DE NOTAS
// =========================

function loadNotes() {
  allNotes = loadFromLocal(LOCAL_STORAGE_KEYS.notes, []);
  
  // Ordenar por fecha de actualización (más recientes primero)
  allNotes.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
  
  filteredNotes = [...allNotes];
  renderNotesGrid();
}

function saveNotes() {
  const success = saveToLocal(LOCAL_STORAGE_KEYS.notes, allNotes);
  if (success) {
    elements.savedStatus.textContent = '✓ Guardado';
    setTimeout(() => {
      elements.savedStatus.textContent = '—';
    }, 2000);
  } else {
    elements.savedStatus.textContent = '✗ Error';
  }
  return success;
}

function renderNotesGrid() {
  const grid = elements.notesGrid;
  if (!grid) return;
  
  if (filteredNotes.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
        <h3>No hay notas aquí</h3>
        <p>¿Por qué no crear la primera?</p>
        <button class="btn" onclick="openNoteModal()" style="margin-top: 16px;">+ Nueva Nota</button>
      </div>
    `;
    return;
  }
  
  grid.innerHTML = filteredNotes.map(note => {
    const category = allCategories.find(cat => cat.id === note.categoryId);
    const categoryName = category ? `${category.icon} ${category.name}` : '📝 Sin categoría';
    
    const tags = note.tags || [];
    const tagsHTML = tags.length > 0 ? 
      `<div class="tags">${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : '';
    
    const preview = note.content ? 
      note.content.substring(0, 150) + (note.content.length > 150 ? '...' : '') : 
      'Sin contenido';
    
    return `
      <div class="card" onclick="editNote('${note.id}')">
        <h4>${sanitizeHTML(note.title || 'Sin título')}</h4>
        <div style="color: var(--text-muted); font-size: 14px; line-height: 1.5;">
          ${sanitizeHTML(preview)}
        </div>
        ${tagsHTML}
        <div class="meta">
          <span>${categoryName}</span>
          <div style="display: flex; gap: 8px; align-items: center;">
            ${note.favorite ? '<span class="fav">⭐</span>' : ''}
            <span>${formatDate(note.updatedAt || note.createdAt)}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openNoteModal(noteId = null) {
  currentEditingNoteId = noteId;
  
  if (noteId) {
    // Editar nota existente
    const note = allNotes.find(n => n.id === noteId);
    if (!note) return;
    
    elements.modalTitle.textContent = 'Editar nota';
    elements.noteTitle.value = note.title || '';
    elements.noteContent.value = note.content || '';
    elements.noteTags.value = (note.tags || []).join(', ');
    elements.noteCategory.value = note.categoryId || '';
    elements.noteFav.checked = note.favorite || false;
  } else {
    // Nueva nota
    elements.modalTitle.textContent = 'Nueva nota';
    elements.noteTitle.value = '';
    elements.noteContent.value = '';
    elements.noteTags.value = '';
    elements.noteCategory.value = '';
    elements.noteFav.checked = false;
  }
  
  elements.noteOverlay.classList.add('open');
  elements.noteTitle.focus();
  updatePreview();
  updateWordCount();
}

function closeNoteModal() {
  elements.noteOverlay.classList.remove('open');
  currentEditingNoteId = null;
}

function saveNote() {
  const title = elements.noteTitle.value.trim();
  const content = elements.noteContent.value.trim();
  
  if (!title && !content) {
    showToast('Agrega al menos un título o contenido', 'error');
    return;
  }
  
  const tags = elements.noteTags.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);
  
  const noteData = {
    title: title || 'Sin título',
    content,
    tags,
    categoryId: elements.noteCategory.value || null,
    favorite: elements.noteFav.checked,
    updatedAt: Date.now()
  };
  
  if (currentEditingNoteId) {
    // Actualizar nota existente
    const noteIndex = allNotes.findIndex(n => n.id === currentEditingNoteId);
    if (noteIndex !== -1) {
      allNotes[noteIndex] = { ...allNotes[noteIndex], ...noteData };
      showToast('Nota actualizada', 'success');
    }
  } else {
    // Crear nueva nota
    const newNote = {
      id: generateId(),
      ...noteData,
      createdAt: Date.now()
    };
    allNotes.unshift(newNote); // Agregar al principio
    showToast('Nota creada', 'success');
  }
  
  saveNotes();
  loadCategories(); // Actualizar contadores
  setFilter(currentFilter); // Mantener filtro actual
  closeNoteModal();
}

function editNote(noteId) {
  openNoteModal(noteId);
}

function deleteNote(noteId) {
  if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
    return;
  }
  
  const noteIndex = allNotes.findIndex(n => n.id === noteId);
  if (noteIndex !== -1) {
    allNotes.splice(noteIndex, 1);
    saveNotes();
    loadCategories();
    setFilter(currentFilter);
    showToast('Nota eliminada', 'info');
  }
}

function updatePreview() {
  const content = elements.noteContent.value;
  const preview = elements.notePreview;
  
  if (content.trim()) {
    preview.innerHTML = renderMarkdown(content);
  } else {
    preview.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">Vista previa del contenido...</p>';
  }
}

function updateWordCount() {
  const content = elements.noteContent.value;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  elements.wordCount.textContent = `${wordCount} palabras`;
}

// =========================
// BÚSQUEDA
// =========================

function initSearch() {
  function performSearch() {
    const query = elements.search.value.toLowerCase().trim();
    
    // Sincronizar los dos campos de búsqueda
    if (elements.searchMobile) {
      elements.searchMobile.value = elements.search.value;
    }
    
    if (!query) {
      setFilter(currentFilter);
      return;
    }
    
    filteredNotes = allNotes.filter(note => {
      const titleMatch = (note.title || '').toLowerCase().includes(query);
      const contentMatch = (note.content || '').toLowerCase().includes(query);
      const tagsMatch = (note.tags || []).some(tag => tag.toLowerCase().includes(query));
      
      return titleMatch || contentMatch || tagsMatch;
    });
    
    elements.currentTitle.textContent = `🔍 Resultados para "${query}"`;
    elements.subInfo.textContent = `${filteredNotes.length} notas encontradas`;
    
    renderNotesGrid();
  }
  
  elements.search?.addEventListener('input', performSearch);
  elements.searchMobile?.addEventListener('input', performSearch);
}

// =========================
// TEMA
// =========================

function initTheme() {
  function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.setAttribute('data-theme', newTheme);
    saveToLocal(LOCAL_STORAGE_KEYS.theme, newTheme);
    
    // Actualizar iconos de tema
    const themeIcon = newTheme === 'dark' ? '☀️' : '🌙';
    elements.themeBtn.textContent = themeIcon;
    if (elements.themeBtnMobile) {
      elements.themeBtnMobile.innerHTML = `${themeIcon} Cambiar Tema`;
    }
  }
  
  elements.themeBtn?.addEventListener('click', toggleTheme);
  elements.themeBtnMobile?.addEventListener('click', toggleTheme);
  
  // Configurar icono inicial
  const currentTheme = document.body.getAttribute('data-theme');
  const themeIcon = currentTheme === 'dark' ? '☀️' : '🌙';
  elements.themeBtn.textContent = themeIcon;
  if (elements.themeBtnMobile) {
    elements.themeBtnMobile.innerHTML = `${themeIcon} Cambiar Tema`;
  }
}

// =========================
// GESTIÓN DE CATEGORÍAS (Modal)
// =========================

function initCategoryModal() {
  elements.addCategory?.addEventListener('click', () => {
    openCategoryModal();
  });
  
  elements.closeCategoryModal?.addEventListener('click', () => {
    closeCategoryModal();
  });
  
  elements.saveCategoryBtn?.addEventListener('click', () => {
    saveCategory();
  });
  
  elements.deleteCategoryBtn?.addEventListener('click', () => {
    deleteCategory();
  });
  
  // Emoji selection
  document.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove selection from others
      document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('selected'));
      
      // Select this one
      btn.classList.add('selected');
      elements.categoryIcon.value = btn.dataset.emoji;
    });
  });
}

let currentEditingCategoryId = null;

function openCategoryModal(categoryId = null) {
  currentEditingCategoryId = categoryId;
  
  if (categoryId) {
    const category = allCategories.find(c => c.id === categoryId);
    if (!category) return;
    
    elements.categoryModalTitle.textContent = 'Editar Categoría';
    elements.categoryName.value = category.name;
    elements.categoryIcon.value = category.icon;
    elements.deleteCategoryBtn.style.display = 'block';
    
    // Select emoji button
    document.querySelectorAll('.emoji-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.emoji === category.icon);
    });
  } else {
    elements.categoryModalTitle.textContent = 'Nueva Categoría';
    elements.categoryName.value = '';
    elements.categoryIcon.value = '📝';
    elements.deleteCategoryBtn.style.display = 'none';
    
    // Clear emoji selection
    document.querySelectorAll('.emoji-btn').forEach(btn => {
      btn.classList.remove('selected');
    });
  }
  
  elements.categoryOverlay.classList.add('open');
  elements.categoryName.focus();
}

function closeCategoryModal() {
  elements.categoryOverlay.classList.remove('open');
  currentEditingCategoryId = null;
  elements.categoryMsg.textContent = '';
}

function saveCategory() {
  const name = elements.categoryName.value.trim();
  const icon = elements.categoryIcon.value.trim();
  
  if (!name) {
    elements.categoryMsg.textContent = 'El nombre es requerido';
    elements.categoryMsg.style.color = '#f56565';
    return;
  }
  
  if (!icon) {
    elements.categoryMsg.textContent = 'Selecciona un icono';
    elements.categoryMsg.style.color = '#f56565';
    return;
  }
  
  const categoryData = {
    name,
    icon,
    updatedAt: Date.now()
  };
  
  if (currentEditingCategoryId) {
    // Actualizar categoría existente
    const categoryIndex = allCategories.findIndex(c => c.id === currentEditingCategoryId);
    if (categoryIndex !== -1) {
      allCategories[categoryIndex] = { ...allCategories[categoryIndex], ...categoryData };
      showToast('Categoría actualizada', 'success');
    }
  } else {
    // Crear nueva categoría
    const newCategory = {
      id: generateId(),
      ...categoryData,
      createdAt: Date.now()
    };
    allCategories.push(newCategory);
    showToast('Categoría creada', 'success');
  }
  
  saveToLocal(LOCAL_STORAGE_KEYS.categories, allCategories);
  loadCategories();
  closeCategoryModal();
}

function editCategory(categoryId) {
  openCategoryModal(categoryId);
}

function deleteCategory() {
  if (!currentEditingCategoryId) return;
  
  if (!confirm('¿Eliminar esta categoría? Las notas no se eliminarán.')) {
    return;
  }
  
  const categoryIndex = allCategories.findIndex(c => c.id === currentEditingCategoryId);
  if (categoryIndex !== -1) {
    allCategories.splice(categoryIndex, 1);
    saveToLocal(LOCAL_STORAGE_KEYS.categories, allCategories);
    loadCategories();
    showToast('Categoría eliminada', 'info');
  }
  
  closeCategoryModal();
}

// =========================
// EVENT LISTENERS GENERALES
// =========================

function initEventListeners() {
  // Note Modal
  elements.btnNewNote?.addEventListener('click', () => openNoteModal());
  elements.saveNoteBtn?.addEventListener('click', saveNote);
  elements.closeNoteBtn?.addEventListener('click', closeNoteModal);
  
  // Preview y word count
  elements.noteContent?.addEventListener('input', () => {
    updatePreview();
    updateWordCount();
  });
  
  // Filtros rápidos
  elements.btnAll?.addEventListener('click', () => setFilter('all'));
  elements.btnFavorites?.addEventListener('click', () => setFilter('favorites'));
  
  // Logout
  elements.logoutBtn?.addEventListener('click', logout);
  elements.logoutBtnMobile?.addEventListener('click', logout);
  
  // Cerrar modales con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (elements.noteOverlay.classList.contains('open')) {
        closeNoteModal();
      } else if (elements.categoryOverlay.classList.contains('open')) {
        closeCategoryModal();
      } else if (elements.pinOverlay.classList.contains('open')) {
        elements.pinOverlay.classList.remove('open');
      }
    }
  });
  
  // Cerrar modales haciendo clic afuera
  [elements.noteOverlay, elements.categoryOverlay, elements.pinOverlay].forEach(overlay => {
    overlay?.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  });
}

// =========================
// INICIALIZACIÓN
// =========================

function initApp() {
  console.log('🚀 Inicializando app local...');
  
  // Cargar datos
  loadCategories();
  loadNotes();
  
  // Inicializar componentes
  initSearch();
  initTheme();
  initCategoryModal();
  initEventListeners();
  
  // Configurar filtro inicial
  setFilter('all');
  
  // Actualizar status
  elements.statusInfo.textContent = 'Funcionando en modo local';
  
  console.log('✅ App inicializada correctamente');
  showToast('App cargada correctamente', 'success');
}

// =========================
// INICIO
// =========================

document.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM cargado');
  
  // Inicializar datos por defecto
  initializeDefaultData();
  
  // Saltar PIN y iniciar app directamente
  isLoggedIn = true;
  if (elements.pinScreen) {
    elements.pinScreen.style.display = 'none';
  }
  initApp();
  
  console.log('✅ Aplicación lista - Acceso directo');
});

// Funciones globales para el HTML
window.openNoteModal = openNoteModal;
window.editNote = editNote;
window.deleteNote = deleteNote;
window.editCategory = editCategory;