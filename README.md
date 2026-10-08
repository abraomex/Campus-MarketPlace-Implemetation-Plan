# 🎓 Campus Marketplace (CampusMarket)

A full-stack peer-to-peer marketplace built specifically for university students. Students can buy, sell, reserve campus items (textbooks, laptops, dorm furniture, campus event & show passes), chat directly in-app, negotiate meetups, and manage orders with real-time notifications.

---

## 🌟 Features Overview

- **🔐 Student Authentication & Profiles**
  - University email registration & login (`@university.edu` or custom email).
  - Secure password hashing with `bcryptjs` and token-based authentication via `JWT`.
  - Student profiles displaying active listings, bios, campus locations, and order history.

- **📦 Rich Listings & Discovery**
  - Create, view, edit, and delete marketplace listings.
  - Multi-image handling with primary thumbnail support.
  - Category filters: *Textbooks*, *Electronics*, *Shows & Events Tickets*, *Dorm Furniture*, *Campus Gear*, *Bikes*, etc.
  - Fast search with title/description keyword matching and price sorting.

- **💬 Real-Time In-App Messaging**
  - Direct 1-on-1 student conversations scoped to specific marketplace items.
  - Smart container-level scrolling that preserves scroll position when viewing history.
  - Silent background polling (every 5 seconds) without UI flicker.
  - Automatic unread tracking that marks messages as read when opening a thread.

- **🤝 Campus Meetup & Order Reservation System**
  - **"Buy & Reserve"** modal allowing buyers to select safe campus meetup points (e.g., Student Union, Main Library, Campus Center).
  - Payment options: **Cash on Campus Meetup**, **Venmo / Zelle**, or **Card / Campus Pay**.
  - Order status tracking: `PENDING` ➔ `CONFIRMED` ➔ `COMPLETED` / `CANCELLED`.
  - Sellers can review and confirm orders directly from their profile dashboard.

- **🔔 Live Notifications & Alerts**
  - Global `NotificationContext` polling unread messages and pending orders every 7 seconds.
  - Dynamic badge counters on Navbar **Messages** and **Profile** tabs.
  - Interactive popup toast alerts notifying users of incoming messages or order reservations.

---

## 🏗️ Tech Stack & Architecture

### **Frontend (Client)**
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with automatic Bearer token interceptors

### **Backend (Server)**
- **Runtime**: [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL 18](https://www.postgresql.org/)
- **ORM**: [Prisma ORM 6](https://www.prisma.io/)
- **File Handling**: [Multer](https://github.com/expressjs/multer)
- **Validation**: [Zod](https://zod.dev/)

```text
┌────────────────────────────────────────────────────────┐
│                   React 19 + Vite                      │
│   (Tailwind CSS, React Router v7, React Hook Form)     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / REST APIs
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Express 5 Backend                    │
│    Auth   │   Products   │   Messages   │    Orders    │
└───────────────────────────┬────────────────────────────┘
                            │ Prisma ORM
                            ▼
┌────────────────────────────────────────────────────────┐
│                  PostgreSQL Database                   │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```text
cm/
├── package.json              # Monorepo root scripts
├── .gitignore                # Git exclusions (node_modules, .env, dist)
├── client/                   # Frontend Vite application
│   ├── src/
│   │   ├── components/       # Navbar, Footer, NotificationToastContainer, etc.
│   │   ├── context/          # AuthContext, NotificationContext
│   │   ├── pages/            # Home, Products, ProductDetail, Messages, Profile, etc.
│   │   ├── services/         # Axios API instance
│   │   ├── types/            # TypeScript data contracts & interfaces
│   │   ├── App.tsx           # Route layout & provider wrappers
│   │   └── main.tsx          # Client entrypoint
│   └── package.json
└── server/                   # Backend Express application
    ├── prisma/
    │   ├── schema.prisma     # Prisma models & relations
    │   ├── seed.ts           # Demo data (categories, users, listings)
    │   └── migrations/       # SQL migration history
    ├── src/
    │   ├── config/           # Prisma client and environment settings
    │   ├── middleware/       # JWT auth, validation, upload, error handlers
    │   ├── modules/
    │   │   ├── auth/         # Register, Login, Me (/api/auth)
    │   │   ├── products/     # Product CRUD & search (/api/products)
    │   │   ├── messages/     # Conversations & messages (/api/messages)
    │   │   └── orders/       # Order reserve & fulfillment (/api/orders)
    │   └── server.ts         # Express entrypoint
    ├── .env.example          # Environment variables template
    └── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or newer recommended)
- **PostgreSQL** (v14+ or v18 installed and running locally)
- **npm** or **yarn**

---

### 2. Installation
Clone the repository and install dependencies in both the `server` and `client` directories:

```bash
# Clone the repository
git clone https://github.com/<your-username>/campus-marketplace.git
cd campus-marketplace

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Return to root
cd ..
```

---

### 3. Configure Environment Variables
Inside the `server/` directory, create a `.env` file based on `.env.example`:

```bash
cp server/.env.example server/.env
```

Update your `.env` configuration (adjust password and port if needed):

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@127.0.0.1:5432/campus_marketplace?schema=public"
JWT_SECRET="super-secret-jwt-key-for-campus-marketplace"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173"
```

---

### 4. Database Setup & Seeding
In the `server/` directory, run Prisma migrations and populate demo data:

```bash
cd server

# Apply database schema to PostgreSQL
npx prisma db push

# (Optional) Seed demo users, categories, and marketplace listings
npm run prisma:seed

cd ..
```

---

### 5. Running the Application

From the root directory, you can start both the backend and frontend in separate terminals:

**Terminal 1 (Backend Server):**
```bash
npm run dev:server
# Server will run on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm run dev:client
# Frontend will run on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

---

## 🔑 Demo Accounts

Use any of the seeded student accounts to test chat and order workflows across two different browser sessions or windows:

| Name | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Alex Rivera** | `alex@university.edu` | `password123` | Student Seller |
| **Sarah Chen** | `sarah@university.edu` | `password123` | Student Buyer |
| **Marcus Vance** | `marcus@university.edu` | `password123` | Student |
| **Campus Admin** | `admin@university.edu` | `password123` | Administrator |

---

## 📡 Core API Reference

### **Authentication (`/api/auth`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register a new student account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile | Yes |

### **Products (`/api/products`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/products` | Browse listings (filters: `category`, `search`, `minPrice`, `maxPrice`, `page`) | No |
| `GET` | `/api/products/:id` | Get single product with seller information | No |
| `POST` | `/api/products` | Create a new listing with image upload | Yes |
| `PUT` | `/api/products/:id` | Update an existing listing | Yes (Owner) |
| `DELETE` | `/api/products/:id` | Delete a listing | Yes (Owner/Admin) |

### **Messaging (`/api/messages`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/messages/conversations` | Get all conversations for current user | Yes |
| `POST` | `/api/messages/start` | Start or resume chat for a product | Yes |
| `GET` | `/api/messages/conversations/:id`| Get conversation messages & mark as read | Yes |
| `POST` | `/api/messages/conversations/:id`| Send a message in a conversation | Yes |
| `GET` | `/api/messages/unread-count` | Get total unread messages & pending orders count | Yes |

### **Orders & Reservations (`/api/orders`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/orders` | Reserve an item with meetup location & payment method | Yes |
| `GET` | `/api/orders/my-orders` | Get user's purchases and received orders | Yes |
| `PATCH`| `/api/orders/:id/status` | Update order status (`CONFIRMED`, `COMPLETED`, `CANCELLED`) | Yes (Seller/Buyer) |

---

## 🛠️ Verification & Build

To test production build compilation for both backend and frontend:

```bash
npm run build
```

- Server: TypeScript compilation with `tsc`
- Client: Type checking with `tsc -b` and bundling with `vite build`

---

## 📜 License
This project is open-source and created for educational purposes. Feel free to use and adapt it for your university or learning journey.

