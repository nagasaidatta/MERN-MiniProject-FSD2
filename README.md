# 🏛️ Government Scheme Beneficiary Portal (MERN Stack)

A production-quality digital public-service portal where citizens can discover eligible welfare schemes, apply online, and track their application statuses in real time. Administrators have complete capabilities to publish welfare programs, adjudicate citizen claims, manage beneficiary records, and view aggregated governance reports.

---

## 📌 1. Project Overview & Features

### Citizen Capabilities
- **Portal Discovery**: Search and filter schemes across key categories (Students, Farmers, Senior Citizens, Women, EWS).
- **Online Application**: Instant digital submission linked directly to verified citizen records.
- **Application Tracking**: Real-time status monitoring (`Pending` ⏳, `Approved` ✅, `Rejected` ❌).
- **Application Cancellation**: Revoke pending applications prior to officer review.
- **Profile Management**: Update name and password with immutable unique Citizen ID (`USR-xxxxxx`).

### Administrator Capabilities
- **Secure Access**: Role-based access control (RBAC) preventing unauthorized privilege escalation.
- **Scheme Lifecycle Management**: Add, update, view, and decommission government welfare schemes.
- **Application Adjudication Queue**: Real-time review table with one-click **Approve** or **Reject** confirmations.
- **Sanctioned Beneficiary Register**: Dedicated roll of all citizens granted welfare subsidies.
- **Visual Analytics & Governance Reports**: Real-time demographic breakdown and scheme uptake powered by MongoDB aggregation pipelines.

---

## 🛠️ 2. Technology Stack

Built strictly adhering to the specified MERN stack guidelines:

- **Frontend**: ReactJS (JSX, standard hooks `useState`, `useEffect`), React Router DOM (v6), custom CSS variables design system. *(Zero external CSS frameworks such as Tailwind, Bootstrap, or MUI).*
- **Backend**: Node.js & Express.js RESTful API, Express Router, JWT authentication, `bcryptjs` password hashing, CORS, and centralized error handling.
- **Database**: MongoDB Atlas using Mongoose ODM with custom schema indexes (`email`, `userId`, `schemeId`, `citizenId`, `applicationId`) and aggregation pipelines.
- **Testing**: Postman Collection v2.1.

---

## 📁 3. Project Structure

```
mernProjectFsd/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection handler
│   ├── controllers/
│   │   ├── authController.js        # Register, login, profile logic
│   │   ├── schemeController.js      # Scheme CRUD operations
│   │   ├── applicationController.js # Citizen apply, tracking, adjudication
│   │   └── reportController.js      # Aggregated metrics via MongoDB pipelines
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js                  # Users collection schema
│   │   ├── Scheme.js                # GovernmentSchemes collection schema
│   │   └── Application.js           # Applications collection schema
│   ├── routes/
│   │   ├── authRoutes.js            # /register, /login, /profile
│   │   ├── schemeRoutes.js          # /schemes, /schemes/:id
│   │   ├── applicationRoutes.js     # /applyScheme, /applications, /cancelApplication
│   │   └── reportRoutes.js          # /stats/public, /reports/summary
│   ├── seed/
│   │   └── seedData.js              # Database seed script for demo data
│   ├── .env.example                 # Backend environment variable template
│   ├── package.json
│   └── server.js                    # Express app entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardCard.jsx    # Metric indicator card
│   │   │   ├── Footer.jsx           # Government service footer
│   │   │   ├── LoadingSpinner.jsx   # Accessible CSS loader
│   │   │   ├── Modal.jsx            # Light-dismiss confirmation modal
│   │   │   ├── Navbar.jsx           # Responsive role-aware header
│   │   │   ├── NotificationBanner.jsx # Toast / alert banner
│   │   │   ├── ProtectedRoute.jsx   # Client-side auth/role guard
│   │   │   ├── SchemeCard.jsx       # Scheme showcase card
│   │   │   └── StatusBadge.jsx      # Color-coded badge (Pending/Approved/Rejected)
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global auth & session state
│   │   ├── pages/
│   │   │   ├── About.jsx            # Portal mission & security
│   │   │   ├── AdminApplications.jsx# Application queue adjudication
│   │   │   ├── AdminDashboard.jsx   # Administrative overview
│   │   │   ├── ApplyScheme.jsx      # Citizen application form
│   │   │   ├── Beneficiaries.jsx    # Sanctioned roll
│   │   │   ├── CitizenDashboard.jsx # Citizen overview & tracking
│   │   │   ├── Home.jsx             # Public landing page & live stats
│   │   │   ├── Login.jsx            # Portal login
│   │   │   ├── ManageSchemes.jsx    # Scheme CRUD interface
│   │   │   ├── MyApplications.jsx   # Citizen application tracker
│   │   │   ├── Profile.jsx          # Citizen profile management
│   │   │   ├── Register.jsx         # Citizen registration form
│   │   │   ├── Reports.jsx          # CSS-based analytics & graphs
│   │   │   ├── SchemeDetails.jsx    # Scheme guidelines & apply trigger
│   │   │   └── Schemes.jsx          # Searchable schemes catalog
│   │   ├── services/
│   │   │   ├── api.js               # Central fetch client with JWT injector
│   │   │   ├── authService.js
│   │   │   ├── schemeService.js
│   │   │   ├── applicationService.js
│   │   │   └── reportService.js
│   │   ├── styles/
│   │   │   ├── theme.css            # CSS variables color system
│   │   │   ├── index.css            # Base typography & UI components
│   │   │   ├── navbar.css           # Navigation styling
│   │   │   ├── footer.css           # Footer styling
│   │   │   ├── home.css             # Hero & landing sections
│   │   │   ├── schemes.css          # Scheme cards & details
│   │   │   ├── dashboard.css        # Dashboard & metric cards
│   │   │   └── reports.css          # Pure CSS bar charts & meters
│   │   ├── App.jsx                  # Main router definitions
│   │   └── main.jsx                 # React root mount
│   ├── .env.example                 # Frontend environment variable template
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── postman/
│   ├── Government_Scheme_Beneficiary_Portal.postman_collection.json
│   └── postman_environment.json
└── README.md
```

---

## 🗄️ 4. MongoDB Atlas Setup Guide

1. **Create an Account**: Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign up for a free M0 Shared Cluster.
2. **Create a Cluster**: Select your preferred cloud provider (AWS/GCP) and region closest to your users.
3. **Database User**:
   - Go to **Security > Database Access**.
   - Click **Add New Database User**.
   - Select **Password Authentication**.
   - Enter a username (e.g. `gov_admin`) and secure password.
   - Assign the **Read and write to any database** role.
4. **Network Access**:
   - Go to **Security > Network Access**.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) for cloud deployments and testing, or add your current IP.
5. **Obtain Connection String**:
   - Go to **Deployments > Database**.
   - Click **Connect > Drivers** (Node.js).
   - Copy the SRV URI:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gov_scheme_portal?retryWrites=true&w=majority
     ```
6. **Configure Backend**:
   - Create `backend/.env` (copy from `backend/.env.example`).
   - Paste your connection string into `MONGODB_URI` replacing `<username>` and `<password>`.

---

## 🚀 5. Local Development Setup

### Step 1: Clone or Navigate to Directory
```bash
cd /Users/sankardatta/mernProjectFsd
```

### Step 2: Backend Configuration & Startup
```bash
cd backend
cp .env.example .env
# Open .env and add your valid MONGODB_URI and JWT_SECRET

# Install dependencies (already executed)
npm install

# Seed the database with demo users, schemes, and applications
npm run seed

# Start development server
npm run dev
# or: npm start
```
The backend API server will run on `http://localhost:5001` (avoiding macOS port 5000 AirPlay conflict).

### Step 3: Frontend Setup & Startup
Open a new terminal window:
```bash
cd frontend
cp .env.example .env

# Install dependencies (already executed)
npm install

# Start Vite React development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔑 6. Demo User Credentials

The database seed script (`backend/seed/seedData.js`) creates verified demo accounts:

| Role | Name | Email | Password |
|---|---|---|---|
| **Administrator** | Official Administrator | `admin@govportal.in` | `Admin@12345` |
| **Citizen** | Priya Sharma | `priya.sharma@example.com` | `Citizen@12345` |
| **Citizen** | Rahul Verma | `rahul.verma@example.com` | `Citizen@12345` |
| **Citizen** | Anita Desai | `anita.desai@example.com` | `Citizen@12345` |

*(Note: The login page also includes one-click demo credentials autofill buttons for rapid grading and demonstration).*

---

## 🌐 7. REST API Endpoints

All endpoints required by the specification are implemented:

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| `POST` | `/register` | Public | Citizen account registration (default: `citizen`) |
| `POST` | `/login` | Public | Citizen or Admin login returning JWT token |
| `GET` | `/profile` | Private | Fetch authenticated user details |
| `PUT` | `/profile` | Private | Update citizen name or password |
| `GET` | `/schemes` | Public | Search & list schemes (`?category=...&status=...`) |
| `GET` | `/schemes/:id` | Public | View individual scheme guidelines |
| `POST` | `/schemes` | Admin | Create new government welfare scheme |
| `PUT` | `/schemes/:id` | Admin | Update scheme details & status |
| `DELETE` | `/schemes/:id` | Admin | Delete scheme from registry |
| `POST` | `/applyScheme` | Citizen | Apply for scheme (creates Pending claim) |
| `GET` | `/applications` | Auth | Get claims (Citizen sees own; Admin sees all) |
| `PUT` | `/applications/:id` | Admin | Adjudicate application (`Approved` / `Rejected`) |
| `DELETE` | `/cancelApplication/:id` | Citizen | Cancel own pending application |
| `GET` | `/beneficiaries` | Admin | Retrieve sanctioned beneficiary roll |
| `GET` | `/stats/public` | Public | Live landing page counters |
| `GET` | `/reports/summary` | Admin | MongoDB aggregation telemetry & analytics |

*(Note: Every endpoint is also aliased under `/api/...` for flexible integration).*

---

## 🧪 8. Postman API Testing

1. Open Postman.
2. Click **Import** and select:
   - `postman/Government_Scheme_Beneficiary_Portal.postman_collection.json`
   - `postman/postman_environment.json`
3. In the top-right environment dropdown, select **GovSchemePortal Local Environment**.
4. Run requests in sequence:
   - `POST /login (Citizen)` automatically populates `{{citizenToken}}`.
   - `POST /login (Admin)` automatically populates `{{adminToken}}`.
   - Run `POST /applyScheme`, `GET /applications`, and `PUT /applications/:id` to test application adjudication.

---

## ☁️ 9. Production Hosting & Deployment Guide

### A. Deploy Backend on Render.com
1. Push your repository to GitHub.
2. Log into [Render](https://render.com) and click **New + Web Service**.
3. Connect your GitHub repository and set:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables in Render:
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<Your Production JWT Secret>`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
5. Click **Create Web Service**. Copy the generated URL (e.g. `https://gov-portal-api.onrender.com`).

### B. Deploy Frontend on Vercel or Netlify
1. Log into [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your repository and set:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: `https://gov-portal-api.onrender.com` (Your Render backend URL)
4. Click **Deploy**. Your production portal will be live!

---

## 🛡️ 10. Security Highlights
- Passwords salted and hashed with `bcryptjs`.
- Strict JWT authentication on protected routes with automatic expiration handling.
- Role-based authorization: Citizens cannot access admin endpoints or administrative views.
- Anti-duplicate application guard prevents citizens from submitting multiple active claims for the same scheme.
- Zero client-side exposure of database credentials or secrets.
