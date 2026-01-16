# SPORE FALL Dashboard

A modern, dark-themed administrative dashboard built with Next.js 16+, Tailwind CSS, and shadcn/ui components.

## Features

- 🎨 **Dark Theme UI** - Futuristic dark interface with neon accents
- 📊 **Interactive Charts** - Data visualization using Recharts
- 📱 **Fully Responsive** - Works seamlessly on desktop and mobile devices
- 🗂️ **Multiple Pages**:
  - Login page with authentication
  - Dashboard with KPIs and analytics
  - Poll Management
  - Create Poll
  - Episode Management
  - Create Episode (comprehensive episode editor)
  - Email List (Subscriber Matrix)
  - Content Manager
  - Product Store
- 🎯 **Static JSON Data** - All data is loaded from static JSON files

## Tech Stack

- **Framework**: Next.js 16+ (JavaScript)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:

```bash
cd admin-os-dashboard
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
admin-os-dashboard/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.js            # Login page (root route)
│   │   ├── dashboard/         # Dashboard page
│   │   ├── polls/             # Poll Management
│   │   ├── create-poll/       # Create Poll page
│   │   ├── episodes/          # Episode Management
│   │   ├── create-episode/    # Create Episode page
│   │   ├── emails/            # Email List page
│   │   ├── content/           # Content Manager page
│   │   ├── products/          # Product Store page
│   │   ├── layout.js          # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── layout/            # Layout components (Sidebar, Header)
│   │   └── ui/                # shadcn/ui components
│   ├── data/                  # Static JSON data files
│   └── lib/                   # Utility functions
├── public/                    # Static assets
├── package.json
├── tailwind.config.js
├── next.config.js
└── jsconfig.json
```

## Pages Overview

### Login (`/`)

- Default landing page and authentication
- Username/email and password fields
- Remember me checkbox
- Forgot password link
- Secure login form with loading states
- Standalone layout (no sidebar/header)
- Redirects to `/dashboard` after successful login

### Dashboard (`/dashboard`)

- Key Performance Indicators (KPIs)
- Social media metrics
- Daily signal traffic chart
- Demographics pie chart
- Session metrics
- Top referral nodes
- Accessible after login

### Poll Management (`/polls`)

- Active protocols table
- Poll status and votes
- Action buttons (view, edit, delete)
- Filter and search functionality

### Create Poll (`/create-poll`)

- Query text input
- Consensus paths (poll options)
- Premium pass restriction toggle
- Poll configuration form

### Episode Management (`/episodes`)

- Episode listing table
- Status badges (Available, Upcoming, Locked, Draft)
- View episode details dialog
- Edit episode functionality
- Delete episode with confirmation
- Filter by status and search

### Create Episode (`/create-episode`)

- Comprehensive episode editor with multiple sections:
  - Episode metadata (title, number, type, runtime)
  - Publishing & visibility settings
  - Narrative content (synopsis, full text, quotes)
  - Characters and locations management
  - Interactive choices & consequences
  - Unlock conditions & prerequisites
  - Media assets (thumbnails, banners, videos, audio)
  - Tags & categories
  - Additional metadata
- Dynamic form fields for arrays
- Save draft and deploy live actions

### Email List (`/emails`)

- Subscriber matrix
- Summary cards (total, active, unsubscribe rate)
- Subscriber table with status badges
- Email management interface

### Content Manager (`/content`)

- Page index sidebar
- Landing page editor
- Content form fields
- Page status management (Live, Draft)

### Product Store (`/products`)

- Artifact details form
- Blueprint upload
- Stock parameters
- Product management interface

## Customization

### Data

All data is stored in JSON files in the `src/data/` directory. You can modify these files to update the dashboard content.

### Styling

The project uses Tailwind CSS with custom dark theme colors. Modify `src/app/globals.css` and `tailwind.config.js` to customize the theme.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## License

MIT
