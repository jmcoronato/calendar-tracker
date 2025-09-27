# Calendario de Objetivos — Backend (Node.js + Express + SQLite)

API REST desarrollada en Node.js con Express y SQLite para soportar la gestión de actividades y seguimiento diario en el calendario de objetivos. Proporciona endpoints para crear, editar y eliminar actividades, así como para marcar su cumplimiento día a día.

## Requisitos

- Node.js 18 o superior
- npm 8 o superior

## Inicio rápido

Antes de iniciar, crea un archivo `.env` como se indica más abajo en "Variables de entorno".

```bash
cd backend
npm install
npm run dev
```

El servidor se ejecuta por defecto en `http://localhost:3001`.

### Variables de entorno (OAuth Google)

Crea un archivo `.env` en `backend/` con:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback
SESSION_SECRET=change-me-in-prod
FRONTEND_URL=http://localhost:5173
PORT=3001
NODE_ENV=development
```

## Scripts disponibles

- `npm run dev`: inicia el servidor en modo desarrollo con recarga automática
- `npm run build`: compila TypeScript a JavaScript en el directorio `dist/`
- `npm start`: ejecuta el servidor compilado en modo producción

## Estructura del proyecto

```
backend/
├─ src/
│  ├─ db/
│  │  ├─ connection.ts          # Configuración de SQLite
│  │  └─ migrations.ts          # Migraciones de base de datos
│  ├─ middleware/
│  │  └─ errorHandler.ts        # Manejo centralizado de errores
│  ├─ routes/
│  │  ├─ activities.ts          # CRUD de actividades
│  │  ├─ state.ts               # Estado combinado
│  │  └─ tracked.ts             # Seguimiento diario
│  ├─ types/
│  │  └─ models.ts              # Tipos TypeScript
│  ├─ utils/
│  │  ├─ activityOrder.ts       # Ordenamiento de actividades
│  │  └─ mapper.ts              # Mapeo de datos
│  ├─ auth/
│  │  └─ passport.ts            # Estrategia Google OAuth y serialización
│  └─ index.ts                  # Punto de entrada principal
├─ dist/                        # Código compilado (generado)
├─ data.sqlite                  # Base de datos SQLite (generada automáticamente)
├─ package.json
└─ tsconfig.json
```

## API Endpoints

### Salud del servicio

- `GET /api/health` → `{ ok: true }`

Nota: las rutas de actividades, seguimiento y estado requieren sesión autenticada (cookie de sesión). Inicia sesión mediante OAuth Google.

### Gestión de actividades

- `GET /api/activities` → Lista de actividades `[{ id: number, name: string }]`
- `POST /api/activities` → Crear actividad
  - Body: `{ name: string }`
  - Response: `{ id: number, name: string }`
- `PUT /api/activities/:id` → Renombrar actividad
  - Body: `{ name: string }`
  - Response: `{ id: number, name: string }`
- `DELETE /api/activities/:id` → Eliminar actividad
  - Response: `{ success: true }`

### Seguimiento diario

- `GET /api/tracked` → Obtener todos los registros de seguimiento
  - Response: `{ [dateKey]: { [activityId]: boolean } }`
- `PUT /api/tracked/:dateKey` → Actualizar seguimiento de un día específico
  - Body: `{ [activityId]: boolean }`
  - Response: `{ [activityId]: boolean }`

### Estado combinado

### Autenticación (OAuth Google)

- `GET /api/auth/google` → redirige a Google
- `GET /api/auth/google/callback` → callback de Google
- `GET /api/auth/me` → devuelve el usuario autenticado o `null`
- `POST /api/auth/logout` → cierra la sesión

- `GET /api/state` → Obtener estado completo de la aplicación
  - Response: `{ activities: Activity[], tracked: Record<string, Record<number, boolean>> }`

## Base de datos

El backend utiliza SQLite con las siguientes tablas:

### `activities`

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `name` (TEXT NOT NULL UNIQUE)

### `day_activity`

- `date_key` (TEXT NOT NULL)
- `activity_id` (INTEGER NOT NULL)
- `completed` (INTEGER CHECK 0/1)
- `PRIMARY KEY(date_key, activity_id)`
- `FOREIGN KEY(activity_id) REFERENCES activities(id) ON DELETE CASCADE`

### `users`

- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `provider` (TEXT NOT NULL)
- `provider_id` (TEXT NOT NULL)
- `email` (TEXT)
- `name` (TEXT)
- `avatar_url` (TEXT)
- `created_at` (TEXT)
- `updated_at` (TEXT)
- `UNIQUE(provider, provider_id)`

## Características técnicas

- **CORS habilitado**: permite peticiones desde el `FRONTEND_URL`
- **Migraciones automáticas**: la base de datos se crea e inicializa automáticamente
- **Eliminación en cascada**: al eliminar una actividad se borran todos sus registros de seguimiento
- **Manejo de errores centralizado**: middleware personalizado para gestión de errores
- **Validación de datos**: validación básica en rutas y modelos
- **OAuth con Google**: sesión basada en cookies mediante `express-session`

## Tecnologías utilizadas

- **Node.js** - Entorno de ejecución de JavaScript
- **Express** - Framework web para Node.js
- **TypeScript** - Tipado estático para JavaScript
- **better-sqlite3** - Driver SQLite síncrono para Node.js
- **cors** - Middleware para habilitar CORS
- **ts-node-dev** - Desarrollo con recarga automática para TypeScript

## Configuración

### Variables de entorno

El backend funciona con configuración por defecto. Variables principales:

- `PORT`: Puerto del servidor (por defecto: 3001)

Nota: la base de datos SQLite se crea automáticamente en `./data.sqlite`; actualmente no es configurable vía variable de entorno.

### Formato de fechas

- Las fechas se manejan con el formato `${year}-${month}-${day}`
- El mes utiliza indexación 0-11 (compatible con JavaScript Date)
- Ejemplo: `2024-0-15` representa el 15 de enero de 2024

## Despliegue

1. Compilar el proyecto:

```bash
npm run build
```

2. Ejecutar en producción:

```bash
npm start
```

3. La base de datos SQLite se creará automáticamente en la primera ejecución.

## Solución de problemas

- **Error de conexión a la base de datos**: verifica que el directorio tenga permisos de escritura
- **Puerto en uso**: cambia el puerto con la variable de entorno `PORT`
- **Errores de CORS**: el CORS está habilitado por defecto, verifica la configuración del frontend
- **Migraciones fallidas**: elimina `data.sqlite` para recrear la base de datos
- **401 No autorizado**: inicia sesión con Google desde el frontend y verifica que `FRONTEND_URL` coincida con el origen del frontend.

## Licencia

Este proyecto forma parte de la aplicación CalendarTracker. La licencia se hereda del repositorio principal.
