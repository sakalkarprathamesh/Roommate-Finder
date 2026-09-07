# Roomie — MIT-ADT Roommate & Accommodation Finder 🏠🎓

[![Live Demo](https://img.shields.io/badge/Live_Demo-roommatefinder--pi.vercel.app-1A73E8?style=for-the-badge&logo=vercel&logoColor=white)](https://roommatefinder-pi.vercel.app)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

> **"Find your room. Find your people."**  
> A production-ready accommodation and roommate discovery platform built specifically for students and property owners of **MIT-ADT University, Pune** (Loni Kalbhor campus).

---

## 📖 Short Description (for GitHub Repo)

> **Roomie** is a modern student accommodation and flatmate matching platform for MIT-ADT University Pune. Built with Next.js 14 App Router, TypeScript, Prisma, and Tailwind CSS. Features protected contact sharing, multi-role onboarding (Seeker, PG Owner, Flat Owner), real-time private messaging, lifestyle compatibility filters, mutual occupancy confirmation, and an admin moderation console.

---

## ✨ Features & Capabilities

### 🎓 1. Student & Flatmate Discovery
- **Accommodation & Vacancy Search (`/find`)**:
  - Real-time faceted filtering by **Housing Type** (*Flat, PG, Room*), **Room Type** (*Single, Double, Triple*), **Location** (*Loni Kalbhor, Hadapsar, Kharadi, Wagholi, Manjari, Amanora*), and **Budget**.
  - Student compatibility filters: Filter by MIT-ADT School (*SOC, SOE, SOH, MITID, MANET, etc.*), Department, Academic Year, and gender preference.
- **Visual-Only Demo Showcase (`/demo`)**:
  - Dedicated example section containing sample listings across flats, PGs, and rooms.
  - 100% isolated from live student searches — example listings are strictly non-interactive to prevent test data pollution.
- **Bookmarks & Saved Listings (`/saved`)**:
  - Save and compare favorite accommodation listings with one click.

### 🛡️ 2. Protected Contact Sharing & Private Messaging (`/inbox`)
- **Zero Public Contact Disclosure**: Phone numbers, private email addresses, and exact flat numbers remain hidden until a contact request is mutually accepted.
- **3-Stage Request Lifecycle**:
  - `RECEIVED`: Review student profiles, academic background, and personal notes (`[ Accept ]` / `[ Decline ]`).
  - `SENT`: Track outgoing request states with real-time status badges.
  - `CONNECTED`: Unlocks verified contact information with direct **Call** and **Email** actions.
- **Built-in Private Chat**: Real-time messaging thread between approved student flatmates.

### 🤝 3. Mutual Occupancy Confirmation
- When roommates agree to take a space together, either user can trigger **Mutual Occupancy Confirmation**.
- Updates the platform's public **"Successfully Matched Students"** counter with 24-hour undo protection.

### 🏢 4. Dedicated Property Owner Portals
- **PG Owner Management (`/manage/pg` & `/pg/new`)**:
  - Manage single, double, and triple sharing pricing.
  - Specify meals/mess details (*Veg/Non-Veg, Breakfast, Dinner*), amenities (*Wi-Fi, Power Backup, Laundry, CCTV*), and notice periods.
- **Flat Owner Management (`/manage/flat` & `/flat/new`)**:
  - Specify deposit, maintenance charges, furnishing status (*Furnished, Semi-Furnished, Unfurnished*), and preferred tenant rules (*Bachelors, Girls only, Boys only*).

### 🔐 5. Multi-Step Onboarding & Security (`/register`)
- **Interactive Math CAPTCHA**: Blocks automated bot registrations.
- **Role Selection**: Flexible onboarding for Students/Seekers, PG Owners, and Flat Owners.
- **Personalized Avatar Picker**: Choose from illustrated avatars (filtered by Male, Female, or All) or upload a custom photo.
- **Flatmate Lifestyle Preferences**: Tags for early birds, night owls, non-smokers, studious, gym enthusiasts, vegetarians, and pet-friendliness.

### ⚖️ 6. University Admin Console (`/admin` & `/internal-review`)
- **Platform Analytics**: Total users, active listings, occupancy metrics, and request acceptance rates.
- **Moderation Workflow**: Review, approve, or reject submitted PG and flat listings before public display.
- **Safety & Reporting Queue**: Review user-submitted reports on fraudulent or spam listings with one-click suspension actions.

### 🎨 7. Modern Material Design System
- Clean, Google-inspired design with signature accent colors.
- Full **Dark Mode & Light Mode** support with instant toggle.
- **Mobile-First Responsive Layout**: Dedicated `MobileBottomNav` for smooth mobile browsing.
- **Founder Welcome Experience**: Responsive popup with session memory and 2-month auto-expiry.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 14.2](https://nextjs.org/) | App Router, Server & Client Components, Route Handlers |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org/) | Full type safety across API payloads and UI components |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first styling with custom Google-inspired theme tokens |
| **Database & ORM** | [Prisma 5.22](https://www.prisma.io/) + SQLite | Dynamic `/tmp` database sync for Vercel Serverless environment |
| **Authentication** | JWT (`jose`) + `bcryptjs` | HTTP-only cookie session management with password hashing |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **Deployment** | [Vercel](https://vercel.com/) | Edge network, automatic serverless deployments & analytics |

---

## 📂 Project Structure

```
mit-adt-roommate-finder/
├── prisma/
│   ├── schema.prisma          # Database schema (User, Profile, Listing, ContactRequest, Message, Report)
│   └── seed.ts                # Database seed script
├── public/                    # Static assets, avatars, and favicons
├── scripts/
│   └── build.js               # Prisma client generation & build synchronization
├── src/
│   ├── app/
│   │   ├── (admin)/           # Admin console & internal review portal
│   │   ├── (public)/          # Public routes: Homepage, /about, /demo, /login, /register
│   │   ├── (student)/         # Authenticated student routes: /find, /dashboard, /inbox, /saved, /settings
│   │   ├── api/               # Next.js API route handlers (auth, listings, contact-requests, admin, stats)
│   │   ├── globals.css        # Tailwind styles & theme variables
│   │   └── layout.tsx         # Root layout with theme provider & metadata
│   ├── components/
│   │   ├── auth/              # Registration wizard, login form, avatar picker, captcha
│   │   ├── layout/            # Navbar, Footer, MobileBottomNav
│   │   ├── listings/          # ListingCard, search filters, detail views
│   │   ├── modals/            # Welcome modal, report modal, confirm dialogs
│   │   └── theme/             # Theme provider & mode toggles
│   ├── hooks/                 # Custom React hooks (usePageMeta, useAuth)
│   └── lib/                   # Database client (db.ts), auth helpers, constants, and validation
└── tailwind.config.js         # Tailwind configuration & color definitions
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** or **yarn** / **pnpm**

### 1. Clone the Repository
```bash
git clone https://github.com/sakalkarprathamesh/Roommate-Finder.git
cd Roommate-Finder
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
```

### 4. Setup Database
```bash
# Push schema to SQLite database
npx prisma db push

# Generate Prisma Client
npm run prisma:generate
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production
```bash
npm run build
npm run start
```

---

## 🧪 Default Test Accounts

| Account | Email | Password | Role & Permissions |
| :--- | :--- | :--- | :--- |
| **Housing Admin** | `admin@mitadt.ac.in` | `Admin@123` | University Admin (`/admin` Portal, Listing Approval) |
| **Founder Account** | `sakalkarprathamesh77@gmail.com` | `Password@123` | Verified Student Seeker |

---

## 🔒 Security & Privacy Practices

- **Sanitized Profiles**: Private contact information (Phone, Email, Flat Number) is stripped server-side on public endpoints and only returned upon accepted connection requests.
- **JWT HTTP-Only Cookies**: Protected authentication tokens immune to client-side XSS access.
- **CAPTCHA Verification**: Prevents brute-force registrations and spam attacks.
- **Data Isolation**: Complete logical isolation between real user listings and sample demo listings.

---

## 👨‍💻 Creator & Maintainer

**Prathamesh Sakalkar**  
*2nd Year CSE Student, MIT-ADT University Pune*  
- **GitHub**: [@sakalkarprathamesh](https://github.com/sakalkarprathamesh)  
- **Support & Feedback Email**: `workxash@gmail.com`  

---

## 📄 License

This project is licensed under the **MIT License**. Feel free to use, modify, and distribute with attribution.
