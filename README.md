# الجود للعقارات — Aljoud Real Estate

Fullstack monorepo for the Aljoud Real Estate platform — a property listing and management system for Homs, Syria.

```
aljoud-realestate/
├── frontend/   # Vue 3 + Vite + TypeScript
├── backend/    # NestJS + TypeScript + PostgreSQL
└── README.md
```

## Tech stack

**Frontend** — Vue 3, Vite, TypeScript, Tailwind CSS v4, Pinia, Vue Router 4, Axios, @vueuse/motion, @iconify/vue

**Backend** — NestJS, TypeORM + PostgreSQL, JWT + Passport, bcrypt, Cloudinary, Multer, class-validator/class-transformer

---

## Setup

### 1. Install dependencies

```bash
npm install              # root (installs concurrently)
cd frontend && npm install
cd backend  && npm install
```

### 2. Configure environment

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001
```

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgres://user:password@localhost:5432/aljoud_db
JWT_SECRET=change_this_to_a_long_random_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3001
```

### 3. Seed the admin user (first run only)

```bash
cd backend
npm run seed
# Creates: admin@aljoud.com / admin123
# Change the password after first login.
```

### 4. Run in development

From the repo root:

```bash
npm run dev            # frontend + backend concurrently
npm run dev:frontend   # Vite dev server only  → http://localhost:5173
npm run dev:backend    # NestJS watch mode only → http://localhost:3001
```

---

## API endpoints

All routes are prefixed with `/api`.

### Auth

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | — | Create admin (only once) |
| POST | `/api/auth/login` | — | Login → `{ access_token, user }` |

### Properties (public)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/properties` | List all (`?status=للبيع&featured=true`) |
| GET | `/api/properties/:id` | Get one with images |

### Properties (JWT required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/properties` | Create property |
| PATCH | `/api/properties/:id` | Update property fields |
| DELETE | `/api/properties/:id` | Delete property + Cloudinary images |
| POST | `/api/properties/:id/images` | Upload images (multipart `images[]`, max 10) |
| DELETE | `/api/properties/images/:imageId` | Delete single image |

---

## Deployment

### Backend → Render (or Railway)

1. Create a PostgreSQL database service.
2. Create a Web Service pointing to the `backend/` directory.
3. Build command: `npm install && npm run build`
4. Start command: `node dist/main`
5. Add all env vars from `backend/.env` in the dashboard.
6. Set `DATABASE_URL` to the managed DB connection string.

### Frontend → Netlify or Vercel

1. Set the root directory to `frontend/`.
2. Build command: `npm run build`
3. Publish/output directory: `dist`
4. Add env var: `VITE_API_URL=https://your-backend.onrender.com`

> **Note:** Vite bakes `VITE_API_URL` into the JS bundle at build time — rebuild the frontend when the backend URL changes.

### CORS

Update `backend/src/main.ts` to add your production frontend domain:

```typescript
app.enableCors({
  origin: ['http://localhost:5173', 'https://your-frontend.netlify.app'],
});
```

---

## Project structure

```
frontend/src/
├── api/            # axios instance + typed API functions
├── composables/    # useToast
├── components/
│   ├── dashboard/  # PropertyForm
│   ├── home/       # FeaturedProperties (async)
│   ├── layout/     # TheNavbar, TheFooter
│   └── ui/         # PropertyCard, SectionTitle, ImageGallery, ToastContainer
├── router/         # Vue Router with auth guards
├── stores/         # auth.store, properties.store (Pinia)
├── types/          # Property, PropertyImage interfaces
└── views/
    ├── HomeView, PropertiesView, PropertyDetailView, LoginView
    └── dashboard/  # DashboardView, AddPropertyView, EditPropertyView

backend/src/
├── auth/           # AuthModule, AuthService, AuthController, JwtStrategy, guards, DTOs
├── database/       # DatabaseModule (TypeORM async config)
├── properties/     # PropertiesModule, PropertiesService, PropertiesController, entities, DTOs
├── upload/         # UploadModule, UploadService (Cloudinary)
└── seed.ts         # One-time admin user seeder
```
