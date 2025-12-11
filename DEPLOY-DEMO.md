# 🚀 Guía de Despliegue - Demo TaskFlow

## 📋 Pasos para Separar y Desplegar la Demo

### 1️⃣ Copiar la Carpeta Demo

```bash
# Copia la carpeta demo-app a otro lugar
# Opción A: En el Escritorio
xcopy "C:\Users\monte\OneDrive\Escritorio\Blog2\demo-app" "C:\Users\monte\Desktop\taskflow-demo" /E /I

# Opción B: En Documentos
xcopy "C:\Users\monte\OneDrive\Escritorio\Blog2\demo-app" "C:\Users\monte\Documents\taskflow-demo" /E /I
```

### 2️⃣ Opción A: Desplegar con Netlify (Recomendado - MÁS FÁCIL)

#### Sin GitHub (Drag & Drop)
1. Ve a [https://netlify.com](https://netlify.com)
2. Crea una cuenta gratuita (GitHub, GitLab o email)
3. En el dashboard, arrastra la carpeta `taskflow-demo` al área de "Drag and drop"
4. ¡Listo! Netlify te dará una URL tipo: `https://random-name-123.netlify.app`
5. Puedes cambiar el nombre a: `https://taskflow-yourname.netlify.app`

**Ventajas:**
- ✅ Súper rápido (1 minuto)
- ✅ Sin configuración
- ✅ SSL automático
- ✅ URL personalizable

### 3️⃣ Opción B: Desplegar con GitHub Pages

#### Crear Repositorio Nuevo
```bash
# 1. Ve a la carpeta copiada
cd C:\Users\monte\Desktop\taskflow-demo

# 2. Inicializar git
git init

# 3. Agregar archivos
git add .

# 4. Commit inicial
git commit -m "Initial commit - TaskFlow Demo"

# 5. Crear repo en GitHub (ir a github.com/new)
# Nombre sugerido: taskflow-demo

# 6. Conectar y subir
git remote add origin https://github.com/TU-USUARIO/taskflow-demo.git
git branch -M main
git push -u origin main
```

#### Activar GitHub Pages
1. Ve a Settings del repo
2. Pages → Source → Branch: `main` → Folder: `/root`
3. Save
4. URL: `https://TU-USUARIO.github.io/taskflow-demo`

### 4️⃣ Opción C: Desplegar con Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Ir a la carpeta
cd C:\Users\monte\Desktop\taskflow-demo

# 3. Desplegar
vercel

# Sigue las instrucciones en pantalla
# URL final: https://taskflow-demo.vercel.app
```

## 🎯 Para Tu Portfolio

### Enlace en Portfolio
```markdown
## 📋 TaskFlow - Sistema de Gestión de Proyectos

**🔗 [Ver Demo en Vivo](https://taskflow-demo.netlify.app)**

Sistema modular de gestión de tareas y proyectos con categorización avanzada.

### Características
- Filtros dinámicos por estado
- Categorización inteligente
- Interfaz responsive
- Tema claro/oscuro
- 100% JavaScript Vanilla

### Stack Técnico
- HTML5, CSS3, JavaScript ES6+
- Mobile-First Design
- No frameworks required

**Repo:** [github.com/tu-usuario/taskflow-demo](https://github.com/tu-usuario/taskflow-demo)
```

## 📸 Screenshots para Portfolio

Toma capturas de:
1. Vista principal con todas las tareas
2. Filtros activos (Pendientes, En Progreso, Completados)
3. Modo oscuro
4. Vista móvil responsive

## 🔗 URLs Sugeridas

- Netlify: `taskflow-yourname.netlify.app`
- Vercel: `taskflow-demo.vercel.app`
- GitHub: `yourname.github.io/taskflow-demo`

## 💡 Consejos

1. **Personaliza el dominio** en Netlify (gratis)
2. **Agrega Google Analytics** para trackear visitas
3. **Optimiza las imágenes** si agregas screenshots
4. **Actualiza el README** con tu información

## ⚠️ Importante

Esta demo es **totalmente independiente** de la app del cliente. Puedes:
- ✅ Modificarla libremente
- ✅ Agregar más features
- ✅ Cambiar el diseño
- ✅ Usarla en tu portfolio

**NO afecta** en nada la aplicación de producción del cliente.

---

**Tiempo estimado:** 5-10 minutos
**Dificultad:** Fácil
**Costo:** $0 (todo gratuito)
