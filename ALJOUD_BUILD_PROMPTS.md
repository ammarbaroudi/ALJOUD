# Aljoud Real Estate — Full Build Prompts

> Use these prompts **in order**. Each prompt builds on the previous one.
> Stack: **Vue 3 + Vite** (frontend) · **NestJS** (backend) · **PostgreSQL** (database) · **Cloudinary** (image storage)
> Colors from logo: Primary `#3D1C0E` (dark brown) · Background `#F5EDD8` (cream/beige) · Accent `#6B3A2A` (medium brown)

---

## PROMPT 1 — Project Scaffolding

```
Create a fullstack monorepo project called "aljoud-realestate" with this structure:

aljoud-realestate/
├── frontend/   (Vue 3 + Vite + TypeScript)
├── backend/    (NestJS + TypeScript)
└── README.md

Instructions:

1. Frontend — run: npm create vite@latest frontend -- --template vue-ts
   Then install inside /frontend:
   - @vueuse/motion (Framer Motion equivalent for Vue)
   - vue-router@4
   - pinia
   - axios
   - tailwindcss + @tailwindcss/vite
   - @iconify/vue

2. Backend — run: npx @nestjs/cli new backend
   Then install inside /backend:
   - @nestjs/config
   - @nestjs/typeorm
   - typeorm
   - pg (PostgreSQL driver)
   - @nestjs/jwt
   - @nestjs/passport
   - passport-jwt
   - bcrypt
   - cloudinary
   - multer + @nestjs/platform-express
   - class-validator + class-transformer

3. Configure Tailwind in frontend:
   - tailwind.config.ts with custom colors:
     primary: '#3D1C0E'
     secondary: '#6B3A2A'
     cream: '#F5EDD8'
     light: '#FAF6EE'
   - Add @import "tailwindcss" to src/style.css

4. Create root package.json with scripts:
   "dev:frontend": "cd frontend && npm run dev"
   "dev:backend": "cd backend && npm run start:dev"
   "dev": runs both concurrently

5. Create /backend/.env.example:
   DATABASE_URL=postgres://user:password@localhost:5432/aljoud_db
   JWT_SECRET=your_secret_here
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   PORT=3001

Do not add any pages or components yet. Just scaffold and configure.
```

---

## PROMPT 2 — Backend: Database & Entities

```
Inside the NestJS backend, create the database entities and module structure.

1. Create src/database/database.module.ts:
   TypeORM connection using env vars, synchronize: true for dev.

2. Create these entities:

   src/properties/property.entity.ts:
   - id: uuid (primary, generated)
   - title: string
   - description: text (nullable)
   - price: decimal (nullable)
   - location: string (default: 'الخالدية - حمص')
   - status: enum ['للبيع', 'للإيجار', 'مباع'] default 'للبيع'
   - isFeatured: boolean default false
   - images: relation OneToMany → PropertyImage
   - createdAt: timestamp auto
   - updatedAt: timestamp auto

   src/properties/property-image.entity.ts:
   - id: uuid
   - url: string (Cloudinary URL)
   - publicId: string (Cloudinary public_id for deletion)
   - property: ManyToOne → Property (onDelete CASCADE)

   src/auth/user.entity.ts:
   - id: uuid
   - email: string (unique)
   - password: string (hashed)
   - role: enum ['admin'] default 'admin'
   - createdAt: timestamp

3. Register all entities in DatabaseModule and import it in AppModule.

4. Create the modules (empty for now, just @Module structure):
   - PropertiesModule
   - AuthModule
   - UploadModule

Do not add controllers or services yet.
```

---

## PROMPT 3 — Backend: Auth Module

```
Build the complete authentication system in NestJS.

1. src/auth/auth.service.ts:
   - register(email, password): hash password with bcrypt (rounds: 12), save user, return user without password
   - login(email, password): find user, compare password, return JWT token
   - validateUser(payload): find user by id from JWT

2. src/auth/auth.controller.ts:
   POST /auth/login → { email, password } → returns { access_token, user: { id, email } }
   POST /auth/register → only callable once (check if any user exists, if yes throw ForbiddenException)

3. src/auth/jwt.strategy.ts:
   - Validates JWT from Authorization: Bearer header
   - Extracts user from payload

4. src/auth/guards/jwt-auth.guard.ts:
   - Standard NestJS JWT guard to protect routes

5. src/auth/dto/login.dto.ts:
   - email: IsEmail
   - password: IsString, MinLength(6)

6. Register JwtModule with secret from ConfigService, expiresIn: '7d'

7. Export JwtAuthGuard from AuthModule so other modules can use it.

The goal: only one admin user can exist. They log in and get a token to manage properties.
```

---

## PROMPT 4 — Backend: Properties & Upload Module

```
Build the properties CRUD and image upload system.

1. src/upload/upload.service.ts:
   - Configure Cloudinary with env vars
   - uploadImage(file: Express.Multer.File): uploads to Cloudinary folder 'aljoud-properties', returns { url, publicId }
   - deleteImage(publicId: string): deletes from Cloudinary

2. src/properties/properties.service.ts:
   - findAll(filters?: { status?, isFeatured? }): return all properties with their images, ordered by createdAt DESC
   - findOne(id): return property with images or throw NotFoundException
   - create(dto): create property record
   - update(id, dto): update property fields
   - delete(id): delete property (images cascade delete, also delete from Cloudinary)
   - addImages(propertyId, files[]): upload each file via UploadService, save PropertyImage records
   - deleteImage(imageId): find image, delete from Cloudinary, delete record

3. src/properties/properties.controller.ts:
   Public routes (no auth):
     GET  /properties          → findAll (optional query: status, featured)
     GET  /properties/:id      → findOne

   Protected routes (JWT required):
     POST   /properties                    → create property
     PATCH  /properties/:id               → update property
     DELETE /properties/:id               → delete property
     POST   /properties/:id/images        → upload images (multipart, field: 'images', max 10 files)
     DELETE /properties/images/:imageId   → delete single image

4. src/properties/dto/create-property.dto.ts:
   - title: IsString, IsNotEmpty
   - description: IsOptional, IsString
   - price: IsOptional, IsNumber
   - location: IsOptional, IsString
   - status: IsOptional, IsEnum(['للبيع', 'للإيجار', 'مباع'])
   - isFeatured: IsOptional, IsBoolean

5. Enable CORS in main.ts for http://localhost:5173
   Set global prefix: 'api'
   Enable ValidationPipe globally.
```

---

## PROMPT 5 — Frontend: Router, Pinia Store & API Layer

```
Set up the Vue 3 frontend routing, state management, and API communication.

1. src/router/index.ts — routes:
   /                    → HomeView (public)
   /properties          → PropertiesView (public)
   /properties/:id      → PropertyDetailView (public)
   /dashboard           → DashboardView (requires auth, redirect to /login if not)
   /dashboard/add       → AddPropertyView (requires auth)
   /dashboard/edit/:id  → EditPropertyView (requires auth)
   /login               → LoginView (public, redirect to /dashboard if already logged in)

2. src/stores/auth.store.ts (Pinia):
   State: token (persisted in localStorage), user
   Actions:
   - login(email, password): POST /api/auth/login, save token + user
   - logout(): clear token + user, redirect to /login
   - isLoggedIn: computed getter
   Hydrate token from localStorage on store init.

3. src/stores/properties.store.ts (Pinia):
   State: properties[], currentProperty, loading, error
   Actions:
   - fetchAll(filters?)
   - fetchOne(id)
   - create(data)
   - update(id, data)
   - remove(id)
   - addImages(id, formData)
   - removeImage(imageId)

4. src/api/axios.ts:
   - Base URL: import.meta.env.VITE_API_URL || 'http://localhost:3001'
   - Request interceptor: attach Authorization: Bearer {token} from auth store if exists
   - Response interceptor: if 401, call auth.logout()

5. src/api/properties.api.ts — typed API functions that call the backend endpoints.

6. Create src/env.d.ts with VITE_API_URL type declaration.
```

---

## PROMPT 6 — Frontend: Layout & Design System

```
Create the base layout and reusable components for Aljoud Real Estate website.

Design system:
- Font: import 'Cairo' from Google Fonts (Arabic-friendly)
- Direction: RTL (add dir="rtl" to <html> in index.html, and lang="ar")
- Colors: primary #3D1C0E, secondary #6B3A2A, cream #F5EDD8, light #FAF6EE
- Logo colors only — no other color palette

1. src/App.vue:
   - Import and apply @vueuse/motion globally
   - Render <RouterView> wrapped in a page transition (fade + slight translateY)

2. src/components/layout/TheNavbar.vue:
   - Fixed top, background cream #F5EDD8 with subtle border-bottom
   - Logo: text "ALJOUD" in primary color + "REAL ESTATE" smaller below (or use an <img> if logo file present)
   - Navigation links: الرئيسية · العقارات · من نحن · تواصل معنا
   - On mobile: hamburger menu with slide-down drawer using @vueuse/motion
   - Animate in with motion: opacity 0→1, y -20→0 on mount

3. src/components/layout/TheFooter.vue:
   - Background primary #3D1C0E, text cream #F5EDD8
   - Company name + tagline
   - Contact info: 0949039780 · 0981689250
   - Location: الخالدية - حمص - سوريا
   - Copyright line

4. src/components/ui/PropertyCard.vue:
   Props: property (Property type)
   - Cream background card with brown border
   - First image as cover (or placeholder if no images)
   - Title, status badge (للبيع/للإيجار), price if present, location
   - Hover: subtle lift animation with @vueuse/motion or CSS transform
   - Click → navigate to /properties/:id

5. src/components/ui/SectionTitle.vue:
   Props: title, subtitle?
   - Centered, primary color title with decorative underline (brown bar)
   - Animate in when enters viewport using useMotion + intersection observer

6. src/components/ui/ImageGallery.vue:
   Props: images[]
   - Grid of thumbnails, click to open fullscreen lightbox
   - Simple lightbox: fixed overlay, prev/next arrows

7. Types: src/types/property.ts — Property and PropertyImage interfaces matching backend entities.
```

---

## PROMPT 7 — Frontend: Home Page (Portfolio)

```
Build the HomeView with all sections and smooth scroll animations.

src/views/HomeView.vue — sections in order:

─── SECTION 1: Hero ───
- Full viewport height
- Background: cream #F5EDD8 with subtle texture (CSS pattern or soft noise)
- Large heading: "الجـود للعقارات" in primary color, bold
- Subheading: "نجد لك البيت الذي تحلم به في قلب حمص"
- Two CTA buttons: "تصفح العقارات" (→ /properties) + "تواصل معنا" (smooth scroll to contact)
- Animation on load using @vueuse/motion:
  - Heading: opacity 0→1, x -40→0, delay 0ms
  - Subheading: opacity 0→1, x -40→0, delay 200ms
  - Buttons: opacity 0→1, y 20→0, delay 400ms
- Subtle animated background element (floating brown circle or geometric shape, CSS keyframes)

─── SECTION 2: Featured Properties ───
- Title: "أبرز العقارات" (SectionTitle component)
- Fetch properties where isFeatured=true (max 3)
- Grid of PropertyCard components (3 cols desktop, 1 col mobile)
- Cards animate in staggered: each card opacity 0→1, y 30→0, stagger 150ms
- "عرض الكل" button → /properties

─── SECTION 3: About / من نحن ───
- Split layout: text left, decorative element right (or simple brown frame with logo)
- Heading: "من نحن"
- Text: "شركة الجود للعقارات — متخصصون في بيع وتأجير العقارات في حمص. نسعى لتقديم أفضل الخيارات لعملائنا بخبرة وأمانة."
- Stats row (animated count-up on scroll):
  - عقارات متاحة · سنوات خبرة · عملاء سعداء (leave numbers as placeholders: +50, +5, +100)
- Animate section in on scroll with useIntersectionObserver

─── SECTION 4: Contact / تواصل معنا ───
- id="contact" for smooth scroll targeting
- Background: primary #3D1C0E, text cream
- Two columns:
  Left: Contact info cards
    - Phone: 0949039780
    - Phone: 0981689250
    - Location: الخالدية - حمص - سوريا
    - Each card with icon (@iconify/vue), white card, brown text
  Right: Simple contact form (name, phone, message) — frontend only, no backend needed, just mailto or console.log for now
- Animate cards in from left, form from right on scroll

All section animations use @vueuse/motion's v-motion directive or useMotion composable.
Use <Suspense> and loading skeletons where async data is fetched.
```

---

## PROMPT 8 — Frontend: Properties Listing Page

```
Build the PropertiesView — a searchable, filterable grid of all properties.

src/views/PropertiesView.vue:

1. Header:
   - Page title: "جميع العقارات" animated in (opacity + y)
   - Subtitle: "اكتشف أفضل العقارات في حمص"

2. Filter bar (sticky below navbar):
   - Status filter: buttons "الكل" | "للبيع" | "للإيجار" | "مباع"
   - Active filter highlighted with primary color
   - Animated underline on active button

3. Properties grid:
   - 3 cols desktop, 2 cols tablet, 1 col mobile
   - Uses PropertyCard component
   - If no properties: empty state illustration (SVG house icon + text)
   - Loading state: skeleton cards (3 placeholder cards with pulse animation)

4. Animation:
   - On filter change: cards fade out then new cards fade in (use Vue <TransitionGroup> with name="card-list")
   - CSS for card-list transition: opacity + scale

5. Fetch from properties store with reactive filter.

6. On mobile: filter bar scrolls horizontally.
```

---

## PROMPT 9 — Frontend: Property Detail Page

```
Build the PropertyDetailView.

src/views/PropertyDetailView.vue:

Route param: id

1. Fetch property by id on mount. Show loading spinner while fetching.
   If 404: show "العقار غير موجود" with back button.

2. Layout:
   Top: ImageGallery component (full width, grid + lightbox)
   
   Below in two columns (desktop):
   Left (2/3): 
     - Title (large, primary color)
     - Status badge + price
     - Description text
     - Location with map pin icon
   Right (1/3):
     - Contact card (cream background, brown border):
       "للاستفسار عن هذا العقار"
       Phone buttons (tel: links): 0949039780 · 0981689250
       WhatsApp button (wa.me link with property title pre-filled)

3. Back button: "← العودة للعقارات"

4. Animation:
   - Images section: fade in from top
   - Details: slide in from right
   - Contact card: slide in from right with delay

5. Page title updates to property title (useHead or document.title).
```

---

## PROMPT 10 — Frontend: Dashboard

```
Build the admin dashboard for managing properties.

src/views/LoginView.vue:
- Centered card, cream background
- Logo at top
- Email + password fields
- Login button
- Error message if login fails
- On success: redirect to /dashboard

src/views/DashboardView.vue:
- Protected by auth guard (redirect to /login if no token)
- Layout: simple sidebar or top nav with:
  - "لوحة التحكم" title
  - "إضافة عقار" button
  - "تسجيل الخروج" button
- Main area: table/grid of all properties
  Columns: الصورة المصغرة · العنوان · الحالة · مميز؟ · الإجراءات (تعديل / حذف)
- Delete: confirmation dialog before deleting
- Toggle isFeatured with a switch directly in the table

src/views/AddPropertyView.vue + src/views/EditPropertyView.vue:
- Shared form component: src/components/dashboard/PropertyForm.vue
  Fields:
  - title (required)
  - description (textarea)
  - price (number, optional)
  - location (text, default 'الخالدية - حمص')
  - status (select: للبيع / للإيجار / مباع)
  - isFeatured (checkbox)
  - Image upload section:
    - Drag & drop zone OR click to select (multiple files)
    - Preview thumbnails before upload
    - After property is created/saved, upload images separately via POST /properties/:id/images
    - Show existing images (in edit mode) with individual delete buttons

- AddPropertyView: creates new property then uploads images
- EditPropertyView: loads existing property, allows field editing + image management

Dashboard uses no animations (keep it functional and fast).
All dashboard components use scoped CSS or Tailwind utility classes.
```

---

## PROMPT 11 — Polish, SEO & Production Config

```
Final polish pass on the Aljoud Real Estate project.

1. RTL & Arabic typography:
   - Ensure all text is RTL
   - Use font-family: 'Cairo', sans-serif everywhere
   - Check all flexbox/grid directions work correctly in RTL

2. Responsive check:
   - Navbar collapses to hamburger on mobile
   - All grids stack to 1 column on mobile
   - Contact cards stack vertically on mobile
   - Dashboard table scrolls horizontally on mobile

3. SEO basics in index.html:
   <title>الجود للعقارات — حمص</title>
   <meta name="description" content="شركة الجود للعقارات في حمص - الخالدية. أفضل العقارات للبيع والإيجار.">
   <meta property="og:title" content="الجود للعقارات">
   <meta property="og:description" content="عقارات للبيع والإيجار في حمص - الخالدية">
   <html lang="ar" dir="rtl">

4. Loading states:
   - All async data shows a spinner or skeleton
   - Spinner: simple SVG circle spinner in primary color

5. Error handling:
   - API errors show a toast notification (use a simple composable: useToast)
   - Toast slides in from top, auto-dismisses after 3s

6. Environment:
   - frontend/.env: VITE_API_URL=http://localhost:3001
   - frontend/.env.production: VITE_API_URL=https://your-api.railway.app
   - backend/.env: all vars from PROMPT 1

7. CORS in NestJS main.ts:
   app.enableCors({ origin: ['http://localhost:5173', 'https://your-frontend-domain.com'] })

8. Create a root README.md:
   - Project description
   - Setup instructions (npm install in both folders, set env vars, run dev scripts)
   - API endpoints list
   - Deployment notes (Render for backend, Netlify/Vercel for frontend)

9. Seed script (optional, backend):
   src/seed.ts — creates one default admin user (email: admin@aljoud.com, password: admin123)
   Run with: npx ts-node src/seed.ts
```

---

## Quick Reference

### Color Palette
| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#3D1C0E` | Headings, navbar, footer bg, buttons |
| Secondary | `#6B3A2A` | Hover states, accents, borders |
| Cream | `#F5EDD8` | Page background, cards |
| Light | `#FAF6EE` | Section alternates, inputs |
| White | `#FFFFFF` | Cards on dark bg |

### API Endpoints Summary
```
PUBLIC:
GET    /api/properties           → list all
GET    /api/properties/:id       → single property

AUTH:
POST   /api/auth/login           → get token
POST   /api/auth/register        → one-time setup

PROTECTED (Bearer token):
POST   /api/properties           → create
PATCH  /api/properties/:id       → update
DELETE /api/properties/:id       → delete
POST   /api/properties/:id/images     → upload images
DELETE /api/properties/images/:imageId → delete image
```

### Page Sections Order (Home)
1. Hero
2. Featured Properties
3. About (من نحن)
4. Contact (تواصل معنا)

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite + TypeScript |
| Animations | @vueuse/motion |
| Styling | Tailwind CSS |
| State | Pinia |
| HTTP | Axios |
| Backend | NestJS + TypeScript |
| Database | PostgreSQL + TypeORM |
| Auth | JWT + bcrypt |
| Images | Cloudinary |
| Deployment (free) | Render (backend) + Vercel (frontend) + Supabase (DB) |
