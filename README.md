# Evaluación P1 · API de reservas de canchas

**Desarrollo Web Avanzado · ESPE · Unidad 1: Persistencia de datos y ORM**

| Dato | Valor |
|---|---|
| Estudiante | Julio Esteban Sánchez Verduga |
| ID ESPE | L00448110 |
| Correo | jesanchez35@espe.edu.ec |
| NRC | 36878 |
| Variante | **0** · Fútbol 1 · Vóley 1 · 2026-11-10 |
| Puerto | `PORT=3010` |

API REST en capas (**ruta → controlador → servicio → Prisma**) con Express 5, Prisma 7 (adaptador `PrismaPg`), PostgreSQL 17 y JWT. Modelo: `User` 1:N `Booking` N:1 `Schedule`. Proyecto en CommonJS (`require` / `module.exports`).

## Cómo levantar el proyecto

```bash
cp .env-example .env
npm install
docker compose up -d
npx prisma migrate dev
npx prisma generate
npx prisma db seed
npm run dev
```

Postman: importa `postman/EVAL_P1_Sanchez.postman_collection.json` y el entorno `postman/EVAL_P1_local.postman_environment.json` (o `EVAL_P1_render` para la URL de Render) y ejecuta **Run collection** (40 peticiones, 48 pruebas). La colección se puede ejecutar varias veces: registra un usuario nuevo en cada corrida.

## Datos del seed

| Usuario | Correo | Contraseña | Rol |
|---|---|---|---|
| Paulo Galarza | paulo.galarza@example.com | admin123 | ADMIN |
| Julio Esteban Sánchez Verduga | jesanchez35@espe.edu.ec | user123 | USER |

| Horario | Cancha | Inicio (UTC) | Fin (UTC) | Reserva |
|---|---|---|---|---|
| 1 | Fútbol 1 | 2026-11-10 08:00 | 2026-11-10 10:00 | Julio |
| 2 | Vóley 1 | 2026-11-10 10:00 | 2026-11-10 12:00 | Paulo |

## Endpoints

| Verbo | Ruta | Rol | Body | Respuestas |
|---|---|---|---|---|
| GET | `/` | — | — | 200 `Hello World` |
| POST | `/api/auth/register` | — | `{ name, email, password }` | 201 · 400 faltan campos, email inválido o ya registrado |
| POST | `/api/auth/login` | — | `{ email, password }` | 200 `{ token }` · 400 `Invalid email or password` |
| GET | `/api/auth/protected-route` | token | — | 200 · 401 sin token · 403 token inválido |
| POST | `/api/admin/schedules` | ADMIN | `{ court, startTime, endTime }` | 201 · 400 · 401 · 403 |
| GET | `/api/admin/bookings` | ADMIN | — | 200 (con `user` y `schedule`) · 401 · 403 |
| POST | `/api/bookings` | token | `{ date, scheduleId }` | 201 · 400 `El horario ya está ocupado` · 401 |
| GET | `/api/bookings/:id` | dueño o ADMIN | — | 200 · 403 · 404 |
| PUT | `/api/bookings/:id` | dueño o ADMIN | `{ date, scheduleId }` | 200 · 400 ocupado por otra reserva · 403 · 404 |
| DELETE | `/api/bookings/:id` | dueño o ADMIN | — | 204 · 403 · 404 |
| GET | `/api/users/:id/bookings` | dueño o ADMIN | — | 200 (con `schedule`) · 403 si `:id` no es tu id |

## Estructura

```
src/
├─ server.js                 ← carga dotenv y escucha en PORT
├─ app.js                    ← express.json, logger, /api, GET / y errorHandler
├─ routes/                   ← index.js monta /auth, /admin, /bookings, /users
├─ controllers/              ← auth, admin, booking, user
├─ services/                 ← lógica + PrismaClient con PrismaPg
├─ middlewares/              ← logger, errorHandler, auth (authenticateToken),
│                              isAdmin, authorizeBooking, authorizeUser
└─ utils/validation.js       ← isValidEmail
prisma/
├─ schema.prisma             ← User, Role, Schedule, Booking
├─ migrations/               ← init
└─ seed.js
```

## Despliegue en Render

1. **New → Postgres** (Free). Copiar la *External Database URL* y agregar `?sslmode=require`.
2. Desde el PC, con esa URL en `DATABASE_URL`: `npx prisma migrate deploy` y `npx prisma db seed`. Luego volver a la URL local en `.env`.
3. **New → Web Service** desde este repositorio · Runtime: Node · Build: `npm install --include=dev && npx prisma generate` · Start: `npm start` · Instance: Free.
4. Environment: `DATABASE_URL` = *Internal Database URL*, `JWT_SECRET` (distinto al local) y `NODE_ENV=production`.
5. Probar con el entorno `EVAL_P1_render` cambiando `baseUrl` por `https://<tu-servicio>.onrender.com`.
