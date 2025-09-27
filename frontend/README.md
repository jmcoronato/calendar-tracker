# Calendario de Objetivos — Frontend (React + TypeScript + Vite)

Aplicación SPA para gestionar actividades y marcarlas día a día en un calendario, con estadísticas y tema claro/oscuro. Este frontend consume la API del backend a través de un proxy de desarrollo configurado en Vite.

## Requisitos

- Node.js 18 o superior
- npm 8 o superior

## Inicio rápido

```bash
npm install
npm run dev
```

Por defecto Vite expone la app en `http://localhost:5173`. Las peticiones a `/api` se proxyean al backend en `http://localhost:3001`.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo de Vite (con HMR)
- `npm run build`: compila TypeScript y genera el build de producción
- `npm run preview`: sirve el build de producción localmente para probarlo
- `npm run lint`: ejecuta ESLint sobre el proyecto

## Estructura del proyecto

```
frontend/
├─ public/                # Recursos estáticos
├─ src/
│  ├─ components/
│  │  ├─ ActivityManager/      # Alta/edición/borrado de actividades
│  │  ├─ Calendar/             # Calendario mensual e interacción por día
│  │  ├─ DayModal/             # Modal para marcar actividades de un día
│  │  ├─ EditActivityModal/    # Renombrar actividades
│  │  ├─ DeleteConfirmModal/   # Confirmación de borrado
│  │  └─ Stats/                # Estadísticas por semana/mes
│  ├─ context/
│  │  └─ ThemeContext.tsx      # Tema claro/oscuro con persistencia
│  ├─ api.ts                   # Cliente HTTP hacia el backend
│  ├─ App.tsx                  # Composición principal de la UI
│  ├─ main.tsx                 # Bootstrap de React
│  └─ types.ts                 # Tipos compartidos del frontend
├─ index.html
├─ vite.config.ts              # Proxy /api → http://localhost:3001 en dev
└─ package.json
```

## Funcionalidades principales

- Gestión de actividades: crear, renombrar y eliminar.
- Calendario interactivo para marcar qué actividades se cumplieron en cada día.
- Estadísticas por periodo (semana/mes) de la actividad seleccionada.
- Modales de edición, confirmación de borrado y aviso cuando no hay actividades.
- Tema claro/oscuro con persistencia en `localStorage` y atributo `data-theme` en `<html>`.

## Configuración de API y proxy

- El cliente HTTP (`src/api.ts`) realiza peticiones relativas a `/api`.
- En desarrollo, Vite proxyea `/api` hacia `http://localhost:3001`:

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:3001', changeOrigin: true }
  }
}
```

- En producción, se recomienda servir el frontend y el backend bajo el mismo dominio y mantener la ruta `/api` apuntando al backend a nivel de servidor/reverse proxy. Si necesitas servir el backend en otro origen o ruta distinta, ajusta el `base` en `src/api.ts` o configura el reverse proxy correspondiente.

## Autenticación

- La aplicación utiliza OAuth con Google. El botón de inicio de sesión redirige a `/api/auth/google` (ver `components/LoginPage/LoginPage.tsx`).
- Tras autenticarse, el backend redirige al usuario a `FRONTEND_URL` (definido en el `.env` del backend).
- Las peticiones al backend se realizan con cookies de sesión (`credentials: "include"` en `src/api.ts`).
- En desarrollo, el proxy de Vite permite que las cookies funcionen en `localhost`. En producción, las cookies usan `SameSite=Lax` y `secure` cuando `NODE_ENV=production`, por lo que se recomienda servir frontend y backend bajo el mismo dominio y sobre HTTPS.
- Los endpoints protegidos (`/api/activities`, `/api/tracked`, `/api/state`) devuelven `401` si no hay sesión.

## Endpoints consumidos

El frontend utiliza los siguientes endpoints del backend:

- `GET /api/health` — healthcheck
- `GET /api/activities` — listar actividades
- `POST /api/activities` — crear actividad `{ name }`
- `PUT /api/activities/:id` — renombrar actividad `{ name }`
- `DELETE /api/activities/:id` — eliminar actividad
- `GET /api/tracked` — obtener mapa de actividades marcadas por fecha
- `PUT /api/tracked/:dateKey` — guardar mapa de un día `{ [activityIndex]: boolean }`
- `GET /api/state` — estado combinado `{ activities: string[], tracked: Record<string, Record<number, boolean>> }`

Revisa el README del backend para más detalles de la API y cómo levantarlo en `:3001`.

## Despliegue

1. Generar el build de producción:

```bash
npm run build
```

2. Servir el contenido del directorio `dist/` con tu servidor web preferido (Nginx, Apache, Vercel, Netlify, etc.). Asegúrate de enrutar `/api` hacia el backend.

## Solución de problemas

- Errores de red (CORS/404) en `/api`: verifica que el backend esté corriendo en `http://localhost:3001` o que el proxy/servidor esté correctamente configurado.
- Pantalla en blanco o errores de TypeScript: ejecuta `npm run lint` y revisa la consola del navegador.
- Cambios de tema no persisten: limpia `localStorage` y confirma que el atributo `data-theme` se aplica en `<html>`.

## Tecnologías utilizadas

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Build tool y servidor de desarrollo
- **CSS Modules** - Estilos con scope local
- **ESLint** - Linter para código JavaScript/TypeScript

## Licencia

Este proyecto forma parte de la aplicación CalendarTracker. La licencia se hereda del repositorio principal.
