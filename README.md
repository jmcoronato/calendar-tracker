# CalendarTracker

**Aplicación fullstack para gestión y seguimiento de actividades diarias**

CalendarTracker es una aplicación web que te permite crear actividades personalizadas y marcar día a día en un calendario cuáles has completado. Incluye estadísticas detalladas por períodos y un sistema de tema claro/oscuro para una mejor experiencia de usuario.

![CalendarTracker Preview](https://via.placeholder.com/800x400/4f46e5/ffffff?text=CalendarTracker+Preview)

## 🚀 Características principales

- ✅ **Gestión de actividades**: Crea, edita y elimina actividades personalizadas
- 📅 **Calendario interactivo**: Marca qué actividades completaste cada día
- 📊 **Estadísticas detalladas**: Visualiza tu progreso por semana o mes
- 🌙 **Tema claro/oscuro**: Interfaz adaptable con persistencia de preferencias
- 📱 **Diseño responsivo**: Funciona perfectamente en desktop y móvil
- ⚡ **Tiempo real**: Interfaz reactiva con actualizaciones instantáneas

## 🛠️ Stack tecnológico

### Frontend

- **React 18** con **TypeScript**
- **Vite** para desarrollo y build
- **CSS Modules** para estilos con scope
- **ESLint** para calidad de código

### Backend

- **Node.js** con **Express**
- **TypeScript** para tipado estático
- **SQLite** con **better-sqlite3**
- **CORS** habilitado para desarrollo

## 📋 Requisitos previos

- **Node.js** 18 o superior
- **npm** 8 o superior

## 🚀 Inicio rápido

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/CalendarTracker.git
cd CalendarTracker
```

### 2. Configurar el backend

Antes de arrancar el servidor, crea un archivo `.env` en `backend/` con:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=change-me-in-prod
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

```bash
cd backend
npm install
npm run dev
```

El servidor backend se ejecutará en `http://localhost:3001`

### 3. Configurar el frontend (en otra terminal)

```bash
cd frontend
npm install
npm run dev
```

La aplicación frontend se ejecutará en `http://localhost:5173`

### 4. ¡Listo!

Abre tu navegador en `http://localhost:5173` y comienza a usar CalendarTracker.

## 📁 Estructura del proyecto

```
CalendarTracker/
├─ backend/                 # API REST en Node.js + Express + SQLite
│  ├─ src/
│  │  ├─ db/               # Configuración de base de datos
│  │  ├─ routes/           # Endpoints de la API
│  │  ├─ middleware/       # Middlewares personalizados
│  │  ├─ types/            # Tipos TypeScript
│  │  └─ utils/            # Utilidades
│  ├─ dist/                # Código compilado
│  └─ data.sqlite          # Base de datos SQLite
│
├─ frontend/               # SPA en React + TypeScript + Vite
│  ├─ src/
│  │  ├─ components/       # Componentes React
│  │  ├─ context/          # Context providers
│  │  ├─ api.ts            # Cliente HTTP
│  │  └─ types.ts          # Tipos compartidos
│  └─ dist/                # Build de producción
│
└─ README.md               # Este archivo
```

## 🔧 Scripts disponibles

### Backend

```bash
npm run dev     # Servidor de desarrollo con recarga automática
npm run build   # Compilar TypeScript
npm start       # Ejecutar en producción
```

### Frontend

```bash
npm run dev     # Servidor de desarrollo con HMR
npm run build   # Build de producción
npm run preview # Previsualizar build de producción
npm run lint    # Ejecutar ESLint
```

## 📡 API Endpoints

La API REST proporciona los siguientes endpoints:

Nota: excepto `GET /api/health`, los endpoints de actividades, seguimiento y estado requieren sesión autenticada (cookie de sesión). Inicia sesión con Google desde el frontend.

### Actividades

- `GET /api/activities` - Listar todas las actividades
- `POST /api/activities` - Crear nueva actividad
- `PUT /api/activities/:id` - Editar actividad
- `DELETE /api/activities/:id` - Eliminar actividad

### Seguimiento

- `GET /api/tracked` - Obtener registros de seguimiento
- `PUT /api/tracked/:dateKey` - Actualizar seguimiento de un día

### Estado

- `GET /api/state` - Obtener estado completo de la aplicación
- `GET /api/health` - Health check del servidor

Para más detalles sobre cada endpoint, consulta el [README del backend](./backend/README.md).

## 🏗️ Despliegue en producción

### Opción 1: Despliegue tradicional

1. **Backend**:

   ```bash
   cd backend
   npm install
   npm run build
   npm start
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run build
   # Servir el contenido de dist/ con tu servidor web
   ```

### Opción 2: Usando Docker (próximamente)

```bash
# Construir y ejecutar con docker-compose
docker-compose up --build
```

### Configuración de proxy en producción

En producción, configura tu servidor web (Nginx, Apache, etc.) para:

- Servir el frontend desde la ruta raíz (`/`)
- Proxy de `/api/*` hacia el backend
- Manejar el routing del SPA (fallback a `index.html`)

Ejemplo de configuración Nginx:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔍 Solución de problemas

### Errores comunes

**Backend no se conecta**

- Verifica que el puerto 3001 esté libre
- Comprueba los permisos de escritura para `data.sqlite`

**Frontend no carga**

- Asegúrate de que el backend esté ejecutándose en el puerto 3001
- Verifica la configuración del proxy en `vite.config.ts`

**Errores de CORS**

- El CORS está habilitado por defecto en el backend
- Verifica que las URLs coincidan entre frontend y backend

**Autenticación (401 No autorizado)**

- Inicia sesión desde el frontend (botón "Iniciar sesión con Google")
- Asegúrate de que `FRONTEND_URL` en el `.env` del backend coincide con el origen del frontend

### Logs y debugging

```bash
# Backend - logs en tiempo real
cd backend && npm run dev

# Frontend - logs en consola del navegador
# Abre DevTools (F12) y revisa la consola
```

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama para la feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de los cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de código

- **Frontend**: Seguir las reglas de ESLint configuradas
- **Backend**: Usar TypeScript strict mode
- **Commits**: Usar mensajes descriptivos en español
- **Documentación**: Actualizar README cuando sea necesario

## 📝 Roadmap

- [ ] 🐳 Containerización con Docker
- [ ] 🔐 Sistema de autenticación de usuarios
- [ ] 📊 Gráficos avanzados y métricas
- [ ] 📱 Aplicación móvil con React Native
- [ ] 🔄 Sincronización en la nube
- [ ] 🎯 Objetivos y metas personalizadas
- [ ] 📈 Exportación de datos (CSV, JSON)
- [ ] 🌐 Internacionalización (i18n)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Tu Nombre** - _Desarrollo inicial_ - [tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Gracias a la comunidad de React y Node.js por las increíbles herramientas
- Inspirado en metodologías de seguimiento de hábitos y productividad personal

---

**¿Te gusta el proyecto?** ⭐ ¡Dale una estrella en GitHub!

**¿Encontraste un bug?** 🐛 [Reporta un issue](https://github.com/tu-usuario/CalendarTracker/issues)

**¿Tienes una idea?** 💡 [Inicia una discusión](https://github.com/tu-usuario/CalendarTracker/discussions)
