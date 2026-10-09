# 🌲 EcoTrack - Tree Plantation Tracker (MERN Stack)

A full-stack **MERN (MongoDB, Express.js, React, Node.js)** application designed to record, track, and monitor planted trees, geographical locations, planting dates, caretakers/planters, and health statuses.

---

## 📋 Problem Statement & Objectives

### 1. Problem Statement
Build a MERN-based tree plantation tracker that tracks planted trees across locations, species, planters, and biological growth milestones.

### 2. Objectives Accomplished
- **MERN Stack Architecture**: Complete end-to-end integration of React 18, Node.js, Express.js, and MongoDB / Mongoose.
- **CRUD Operations**: Full Create, Read, Update, and Delete operations for planted trees.
- **RESTful APIs**: Clean backend endpoints with error handling, validation, and JSON responses.
- **Role-Based Access Control (RBAC)**: JWT authentication distinguishing Admins, Planters, and Community Volunteers.
- **Interactive Visualizations & Telemetry**: Health status badges, interactive coordinate radar, metrics dashboard, filterable directory, and analytics reports.

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | React 18, Vite, Lucide Icons | Responsive UI, interactive maps, modals, filters, and cards |
| **Backend** | Node.js (v22), Express.js | REST APIs, route controllers, middleware, and JWT validation |
| **Database** | MongoDB / Mongoose | Relational schemas, indexing, auto-timestamps, persistent storage engine |
| **Authentication**| JWT (JSON Web Tokens) & BcryptJS | Secure password hashing, token bearer authorization, and role guards |

---

## 🗄️ Database Models & Schema

### `Tree` Model
- `treeSpecies` (String, Required) - Botanical / scientific classification (e.g., *Azadirachta indica*)
- `commonName` (String, Required) - Vernacular tree name (e.g., Neem Tree)
- `location`:
  - `name` (String, Required) - Site, park, or trail description
  - `city` (String, Required) - City name (e.g., Hyderabad, Bengaluru)
  - `state` (String) - State or province
  - `latitude` (Number) - GPS latitude coordinate
  - `longitude` (Number) - GPS longitude coordinate
- `plantedDate` (Date, Required) - Date of planting
- `person`:
  - `name` (String, Required) - Planter or caretaker name
  - `email` (String) - Planter contact email
  - `phone` (String) - Planter contact phone
  - `organization` (String) - Associated eco-group, NGO, or school
- `status` (Enum) - `['Planted', 'Healthy', 'Growing', 'Needs Attention', 'Deceased']`
- `heightCm` (Number) - Current tree height in centimeters
- `healthNotes` (String) - Inspection notes (e.g., bamboo protection, organic compost, watering frequency)
- `imageUrl` (String) - Photographic documentation link
- `tags` (Array of Strings) - Attributes (`#Medicinal`, `#Native`, `#AirPurifier`)

### `User` Model
- `name` (String)
- `email` (String, Unique)
- `password` (Hashed via bcrypt)
- `role` (Enum: `'admin'`, `'planter'`, `'volunteer'`, `'coordinator'`)
- `organization` (String)

---

## 🌐 REST API Endpoints

### Tree Management (`/api/trees`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/trees` | Retrieve trees with search, filter, and sort queries | Public |
| `GET` | `/api/trees/:id` | Fetch single tree details by ID | Public |
| `POST`| `/api/trees` | Plant a new tree | Planter / Admin |
| `PUT` | `/api/trees/:id` | Update tree status, height, or care notes | Planter / Admin |
| `DELETE`| `/api/trees/:id`| Remove a tree record | Admin / Planter |

### Analytics & System (`/api/stats` & `/api/health`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/stats` | Aggregated metrics, survival rates, top species & leaderboards | Public |
| `GET` | `/api/health` | Server and database engine connectivity status | Public |

### Authentication (`/api/auth`)
| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST`| `/api/auth/login` | Sign in with email & password | Public |
| `POST`| `/api/auth/register` | Register new user | Public |
| `GET` | `/api/auth/me` | Fetch active user profile from JWT | Authenticated |
| `GET` | `/api/auth/demo-users`| Fetch demo accounts for 1-click testing | Public |

---

## ⚡ Quick Demo Accounts (1-Click Login)

The app features built-in demo credentials on the Login page for immediate testing:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@treetracker.org` | `admin123` | Full access: Add, edit, delete, inspect, view analytics |
| **Planter** | `planter@treetracker.org` | `planter123` | Plant new trees, update growth and health notes |
| **Volunteer** | `aarav@treetracker.org` | `user123` | Browse tree directory, inspect coordinates, view metrics |

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+ or v22+)
- (Optional) MongoDB running locally or a MongoDB Atlas connection string. If MongoDB is not active, the system automatically uses the persistent local storage engine with sample data.

### Start Backend
```bash
cd backend
npm install
npm run dev
# Backend runs at http://localhost:5000
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend runs at http://localhost:5173
```

Open your browser to: **`http://localhost:5173`**
