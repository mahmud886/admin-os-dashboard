# SPORE FALL - Admin OS Dashboard

A modern, dark-themed administrative dashboard built with Next.js 16+, Supabase, Tailwind CSS, and shadcn/ui components. Full CRUD API for managing Episodes and Polls with real-time data updates.

## ✨ Features

- 🔐 **Supabase Authentication** - Secure login with single static user support
- 🎨 **Dark Theme UI** - Futuristic dark interface with teal neon accents
- 📊 **Real-time Dashboard** - Live statistics for Episodes and Polls with shimmer loaders
- 📱 **Fully Responsive** - Works seamlessly on desktop and mobile devices
- 🗂️ **Complete CRUD Operations**:
  - **Episodes**: Create, Read, Update, Delete with full metadata support
  - **Polls**: Create, Read, Update, Delete with dynamic options
- 🎯 **Interactive Polls** - Real-time voting with optimistic UI updates
- 📈 **Data Visualization** - Charts using Recharts
- 🔔 **Toast Notifications** - User feedback for all CRUD operations
- ⚡ **Shimmer Loaders** - Beautiful loading states throughout the app
- 🎬 **Episode Management** - Comprehensive episode editor with media assets
- 📝 **Poll Management** - Dynamic poll creation with customizable options

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1+ (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS 4.0
- **UI Components**: shadcn/ui (Radix UI)
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API
- **Form Handling**: React Hooks

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account and project

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd admin-os-dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key

# Authentication (Static User)
NEXT_PUBLIC_STATIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_STATIC_ADMIN_PASSWORD=your_secure_password

# Optional: For API routes and user creation scripts
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Getting Supabase Credentials:**

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project or create a new one
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (for scripts only)

### 4. Database Setup

Run the database migration in your Supabase Dashboard:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run the contents of `supabase/migrations/create_tables.sql`
3. Or use Supabase CLI:

```bash
supabase db execute --file supabase/migrations/create_tables.sql
```

This creates the following tables:

- `episodes` - Episode data with full metadata
- `polls` - Poll data linked to episodes
- `poll_options` - Dynamic poll options with vote counts

### 5. Create Admin User

Run the user creation script:

```bash
node scripts/create-user-simple.js
```

Or manually create a user in Supabase Dashboard → Authentication → Users

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser

### 7. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
admin-os-dashboard/
├── src/
│   ├── app/                          # Next.js App Router pages
│   │   ├── api/                     # API Routes
│   │   │   ├── episodes/           # Episodes API endpoints
│   │   │   │   ├── route.js       # GET, POST /api/episodes
│   │   │   │   └── [id]/          # GET, PUT, DELETE /api/episodes/:id
│   │   │   └── polls/              # Polls API endpoints
│   │   │       ├── route.js       # GET, POST /api/polls
│   │   │       └── [id]/          # GET, PUT, DELETE /api/polls/:id
│   │   ├── page.js                 # Login page (root route)
│   │   ├── dashboard/              # Dashboard with analytics
│   │   ├── episodes/               # Episode Management page
│   │   ├── create-episode/         # Create/Edit Episode page
│   │   ├── polls/                  # Poll Management page
│   │   │   └── [id]/              # Poll Details & Voting page
│   │   ├── create-poll/            # Create Poll page
│   │   ├── layout.js               # Root layout with providers
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── dashboard/              # Dashboard components
│   │   │   ├── episode-stats-card.jsx
│   │   │   ├── poll-stats-card.jsx
│   │   │   ├── dashboard-analytics.jsx
│   │   │   ├── google-analytics-kpi.jsx
│   │   │   ├── social-media-stats.jsx
│   │   │   ├── chart-row.jsx
│   │   │   └── metrics-referrals.jsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── header.jsx         # App header with user menu
│   │   │   ├── sidebar.jsx        # Navigation sidebar
│   │   │   └── main-layout.jsx    # Main layout wrapper
│   │   ├── shimmer/                # Loading shimmer components
│   │   │   ├── episode-stats-card-shimmer.jsx
│   │   │   ├── poll-stats-card-shimmer.jsx
│   │   │   ├── google-analytics-kpi-shimmer.jsx
│   │   │   ├── social-media-stats-shimmer.jsx
│   │   │   ├── chart-row-shimmer.jsx
│   │   │   ├── metrics-referrals-shimmer.jsx
│   │   │   ├── episodes-table-shimmer.jsx
│   │   │   ├── polls-table-shimmer.jsx
│   │   │   └── poll-details-shimmer.jsx
│   │   └── ui/                     # shadcn/ui components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── dialog.jsx
│   │       ├── input.jsx
│   │       ├── toast.jsx           # Toast notification system
│   │       └── ...
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── hooks/
│   │   └── useAuth.js              # Authentication hook
│   ├── lib/
│   │   ├── supabase-client.js      # Client-side Supabase client
│   │   ├── supabase-server.js      # Server-side Supabase client
│   │   ├── db-helpers.js           # Database helper functions
│   │   └── utils.js                # Utility functions
│   └── data/                       # Static JSON data (legacy)
│       ├── dashboard.json
│       ├── episodes.json
│       └── polls.json
├── supabase/
│   └── migrations/
│       └── create_tables.sql       # Database schema
├── scripts/                        # Utility scripts
│   ├── create-user.js             # User creation script
│   └── create-user-simple.js      # Simple user creation
├── middleware.ts                   # Route protection middleware
├── package.json
├── tailwind.config.js
├── next.config.js
└── jsconfig.json
```

## 📄 Pages Overview

### Authentication (`/`)

- Login page with Supabase authentication
- Static user validation before Supabase sign-in
- Session persistence across page refreshes
- Redirects to `/dashboard` after successful login
- Redirects authenticated users away from login page

### Dashboard (`/dashboard`)

- **Real-time Statistics**:
  - Total Episodes with breakdown (Available, Draft, Upcoming)
  - Available Episodes count
  - Total Polls with breakdown (Live, Draft, Ended)
  - Total Poll Votes across all polls
- **Analytics Components**:
  - Google Analytics KPIs
  - Social Media Statistics
  - Daily Signal Traffic Chart (Area Chart)
  - Demographics Pie Chart
  - Metrics and Top Referral Nodes
- Shimmer loaders during data fetching

### Episodes (`/episodes`)

- Dynamic episode listing from Supabase
- Table view with sorting and filtering
- Status badges (Available, Upcoming, Locked, Draft)
- View episode details in modal
- Edit episode functionality with form validation
- Delete episode with confirmation
- Shimmer loaders during loading

### Create Episode (`/create-episode`)

- Comprehensive episode editor:
  - **Basic Information**: Title, description, episode/season numbers
  - **Publishing & Visibility**: Visibility status, access level, release datetime
  - **Media Assets**: Thumbnail, banner, video, audio URLs
  - **Metadata**: Tags, genres, runtime, clearance level
  - **Settings**: Age restriction, notifications
- Save draft and deploy live actions
- Form validation with error messages
- Toast notifications for success/error

### Polls (`/polls`)

- Dynamic poll listing from Supabase
- Poll status and vote counts
- Filter by episode and status
- View, edit, and delete operations
- Shimmer loaders during loading
- Real-time updates after CRUD operations

### Poll Details (`/polls/[id]`)

- Individual poll view page
- Interactive voting interface
- Real-time vote updates with optimistic UI
- Progress bars showing vote percentages
- Poll information sidebar
- Shimmer loader during loading

### Create Poll (`/create-poll`)

- Dynamic poll creation form
- Episode selection (fetched from API)
- Poll title and description
- Dynamic poll options (add/remove)
- Duration configuration
- Save as draft or deploy live
- Form validation
- Toast notifications

## 🔌 API Endpoints

### Episodes API

- `GET /api/episodes` - Get all episodes (with filtering & pagination)
- `POST /api/episodes` - Create new episode (requires auth)
- `GET /api/episodes/[id]` - Get single episode
- `PUT /api/episodes/[id]` - Update episode (requires auth)
- `DELETE /api/episodes/[id]` - Delete episode (requires auth)

**Query Parameters:**

- `visibility` - Filter by visibility (AVAILABLE, UPCOMING, LOCKED, DRAFT, ARCHIVED)
- `access_level` - Filter by access level (free, premium, vip)
- `status` - Filter by status (DRAFT, PUBLISHED)
- `limit` - Results per page (default: 100)
- `offset` - Pagination offset (default: 0)

### Polls API

- `GET /api/polls` - Get all polls (with filtering & pagination)
- `POST /api/polls` - Create new poll with options (requires auth)
- `GET /api/polls/[id]` - Get single poll with options
- `PUT /api/polls/[id]` - Update poll (requires auth)
- `DELETE /api/polls/[id]` - Delete poll (requires auth)

**Query Parameters:**

- `episode_id` - Filter by episode UUID
- `status` - Filter by status (DRAFT, LIVE, ENDED, ARCHIVED)
- `limit` - Results per page (default: 100)
- `offset` - Pagination offset (default: 0)

**API Documentation:** See `doc/API_DOCUMENTATION.md` for detailed API documentation.

## 🔐 Authentication

The application uses Supabase Authentication with a static user validation approach:

1. **Static Validation**: Email and password are validated against environment variables before Supabase authentication
2. **Supabase Session**: Valid credentials create a Supabase session
3. **Context API**: Authentication state is managed globally via `AuthContext`
4. **Route Protection**: Middleware protects routes based on authentication status

**Protected Routes:**

- `/dashboard`
- `/admin`
- `/episodes`
- `/create-episode`
- `/polls`
- `/create-poll`

**Public Routes:**

- `/`
- `/about`
- `/login`

## 🎨 Component Architecture

### Dashboard Components

Modular dashboard components for better maintainability:

- **Statistics Cards**: `EpisodeStatsCard`, `PollStatsCard`
- **Analytics**: `GoogleAnalyticsKPI`, `SocialMediaStats`, `ChartRow`, `MetricsReferrals`

### Shimmer Loaders

Beautiful loading states for better UX:

- All dashboard components have corresponding shimmer loaders
- Table shimmer loaders for episodes and polls
- Poll details page shimmer

### Toast Notifications

Global toast notification system:

- Success, error, warning, and info variants
- Auto-dismiss with configurable duration
- Accessible via `useToast()` hook

## 🗄️ Database Schema

### Episodes Table

- `id` (UUID, Primary Key)
- `title` (TEXT, Required)
- `description` (TEXT)
- `episode_number` (INTEGER, Required)
- `season_number` (INTEGER, Required)
- `unique_episode_id` (TEXT, Unique, Required)
- `visibility` (AVAILABLE, UPCOMING, LOCKED, DRAFT, ARCHIVED)
- `access_level` (free, premium, vip)
- `status` (DRAFT, PUBLISHED)
- Media URLs, tags, genres, and more

### Polls Table

- `id` (UUID, Primary Key)
- `episode_id` (UUID, Foreign Key to episodes)
- `title` (TEXT, Required)
- `description` (TEXT)
- `status` (DRAFT, LIVE, ENDED, ARCHIVED)
- `duration_days` (INTEGER)
- `starts_at`, `ends_at` (TIMESTAMPTZ)

### Poll Options Table

- `id` (UUID, Primary Key)
- `poll_id` (UUID, Foreign Key to polls)
- `name` (TEXT, Required)
- `description` (TEXT)
- `vote_count` (INTEGER)
- `display_order` (INTEGER)

## 🛠️ Scripts

- `npm run dev` - Start development server with Prettier formatting
- `npm run build` - Build for production with Prettier formatting
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run check:deployment` - Check project readiness for Vercel deployment

## 🚦 Development Workflow

1. **Setup**: Configure environment variables and database
2. **Development**: Make changes with hot reload enabled
3. **Testing**: Test CRUD operations via UI or API
4. **Build**: Verify production build works correctly
5. **Deploy**: Deploy to your hosting platform

## 📝 Environment Variables Reference

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key

# Required for authentication
NEXT_PUBLIC_STATIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_STATIC_ADMIN_PASSWORD=secure_password

# Optional (for scripts)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔗 Links & Documentation

- **API Documentation**: See `doc/API_DOCUMENTATION.md`
- **Supabase Setup**: See `doc/SUPABASE_SETUP.md` (if available)
- **Database Schema**: See `supabase/migrations/create_tables.sql`
- **Vercel Deployment Guide**: See `doc/VERCEL_DEPLOYMENT_NOT_FOUND_GUIDE.md` (troubleshooting deployment errors)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
