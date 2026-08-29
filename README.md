# MIT-ADT Roommate Finder 🏠🎓

A production-grade student accommodation and flatmate discovery web application built specifically for students of **MIT-ADT University, Pune** (Loni Kalbhor campus).

> **"Find the right roommate, flatmate, room, or accommodation vacancy with fellow MIT-ADT students."**

---

## 🌟 Key Features

- **4 Accommodation Listing Types**:
  - `I NEED A ROOMMATE`
  - `I NEED ACCOMMODATION`
  - `I HAVE A VACANCY`
  - `I HAVE A ROOM/FLAT AVAILABLE`
- **Personal Gmail & Institutional Registration**: Students can register with any standard Gmail or personal email address without requiring institutional domain restrictions.
- **Strict Location & Contact Privacy**:
  - Exact house/flat numbers and private contact details (Phone, Gmail) are protected server-side.
  - Public listings display only broad campus corridors (*Near MIT-ADT, Loni Kalbhor, Wagholi, Kharadi, Manjari, Hadapsar*).
  - Phone and Gmail details are unlocked **only when a contact request is mutually accepted**.
- **Discover & Multi-Facet Filters (`/find`)**:
  - Search by keyword, student name, and flat amenities.
  - Filter by School/SOC, Department, Academic Year, Listing Type, Accommodation Type, Room Type, Budget, and Locality.
- **3-Tab Inbox (`/inbox`)**:
  - `RECEIVED`: Review incoming requests with academic background and message (`[ Accept ]` / `[ Decline ]`).
  - `SENT`: Track outgoing request states.
  - `CONNECTED`: Instant access to verified phone (`[ Call ]`) and email (`[ Email ]`) for approved connections.
- **Student Dashboard (`/dashboard`)**:
  - Listing lifecycle management: Create, Edit, Delete, Mark as Filled, and 30-day Listing Renewal.
- **Administrative Moderation Console (`/admin`)**:
  - Platform KPIs, listings moderation, safety reporting queue, and user account management.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions & API Routes)
- **Database & ORM**: [Prisma](https://www.prisma.io/) (SQLite local / PostgreSQL ready)
- **Authentication**: JWT Cookies (`jose`) with `bcryptjs` password hashing
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Language**: TypeScript 5

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/<your-username>/mit-adt-roommate-finder.git
cd mit-adt-roommate-finder
npm install
```

### 2. Database Setup & Seed
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Test Accounts

| Account | Email | Password | Role & Features |
| :--- | :--- | :--- | :--- |
| **Rahul Sharma** | `rahul.sharma@gmail.com` | `Password@123` | CSE 3rd Year • Has Active Vacancy Listing |
| **Ananya Patel** | `ananya.ux@gmail.com` | `Password@123` | UX Design 3rd Year • Has Roommate Request |
| **Rohan Deshmukh** | `rohan.engg@gmail.com` | `Password@123` | Mechanical 2nd Year • Connected with Rahul |
| **Housing Admin** | `admin@mitadt.ac.in` | `Admin@123` | University Moderator (`/admin` Portal) |

---

## 👨‍💻 Creator & Support

- **Built by:** Prathamesh Sakalkar
- **Official Support Email:** `workxash@gmail.com`
