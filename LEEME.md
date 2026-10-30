# Evaluación P1 · API de reservas de canchas

Kit del examen de la Unidad 1: **2 horas en línea**, en la Lección «Evaluación P1» de Moodle. Allí están los requisitos de cada hito y sus preguntas, que respondes **después de cada avance**.

## Qué trae el kit (igual que el proyecto de clase)
| Archivo | Contenido |
|---|---|
| `src/server.js`, `src/app.js` | Servidor Express en capas: `express.json`, logger, rutas en `/api`, `GET /` y errorHandler |
| `src/middlewares/` | `logger.js`, `errorHandler.js` (stack solo en `development`) y `auth.js` (`authenticateToken`) |
| `src/routes/auth.js`, `controllers/authController.js`, `services/authService.js` | Registro (bcrypt) y login (JWT `{ id, role }`, 4 h) |
| `src/routes/index.js` | Monta `/auth`. Aquí montas tus routers |
| `src/utils/validation.js` | `isValidEmail` |
| `prisma/schema.prisma` | `User` y `enum Role`. Aquí agregas `Schedule` y `Booking` |
| `prisma.config.ts` | Prisma 7: esquema, migraciones, seed (`node prisma/seed.js`) y `DATABASE_URL` |
| `docker-compose.yml`, `.env-example`, `package.json` | PostgreSQL 17, variables y dependencias del curso |
| `postman/EVAL_P1_local.postman_environment.json` | Entorno con `baseUrl` y `token` |

## Al iniciar (5 min)
```bash
cp .env-example .env          # PORT=30XX con los dos últimos dígitos de tu ID ESPE
npm install
docker compose up -d
git init && git add . && git commit -m "inicio: kit"
git branch -M main && git remote add origin <tu repositorio privado> && git push -u origin main
```

## Hitos
| Hito | Qué haces | Etiqueta |
|---|---|---|
| 1 | `Schedule` y `Booking` (1:N), migración `init`, `npx prisma generate` y seed de tu variante | `hito-1` |
| 2 | `POST /api/admin/schedules` y `GET /api/admin/bookings` (rol ADMIN) | `hito-2` |
| 3 | CRUD de `/api/bookings` con horario ocupado → 400 y `authorizeBooking` | `hito-3` |
| 4 | `GET /api/users/:id/bookings` con `authorizeUser` y tu colección de Postman | `hito-4` |

Cada hito se cierra **antes** de responder sus preguntas en la Lección:
```bash
git add . && git commit -m "hito N: …" && git tag hito-N && git push && git push --tags
```

> Prisma 7: `npx prisma migrate dev` ya no genera el cliente ni ejecuta el seed. Después de migrar, ejecuta `npx prisma generate` y `npx prisma db seed`.

## Entrega
Lo que esté en tu repositorio al terminar las 2 horas es lo que se califica: código, etiquetas `hito-1` a `hito-4` y `postman/EVAL_P1_<Apellido>.postman_collection.json`. En la última pregunta de la Lección pegas el enlace del repositorio y el hash del último commit.
