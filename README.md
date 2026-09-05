# DAYFLOW — Human Resource Management System (HRMS)

> *"Every workday, perfectly aligned."*

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/sabeeshvar/ODOO-DAYFLOW)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🌟 Executive Overview & Problem Statement

Modern growing enterprises struggle with fragmented HR operations: fragmented spreadsheets, disconnected time-tracking apps, clunky payroll ledgers, and slow manual leave email chains.

**DAYFLOW** is a unified, production-grade Human Resource Management System engineered to align every facet of the modern workday. It delivers an enterprise-grade SaaS experience combining:

- **Unified Identity & RBAC**: Real-time role-based access control separating Employee self-service from HR Officer administrative controls.
- **Precision Attendance Engine**: Instant check-in/check-out with automatic hours computation, daily/weekly status breakdown (Present, Absent, Leave, Half-day), and admin override capabilities.
- **Workflow-Driven Leave Governance**: Multi-tier leave quotas (Paid, Sick, Unpaid) with auto-calculated duration, conflict prevention, and mandatory admin rejection rationale.
- **Interactive Compensation & Payroll Ledger**: Transparent earnings and deductions breakdown (Basic, HRA, Transport, Special, Tax, PF, Insurance), dynamic take-home recalculation, and printable audit-ready payslips.
- **Workforce Analytics & Reporting**: Real-time SLA tracking, headcount distribution across departments, leave ratios, and one-click CSV/print exports.
- **Self-Contained & Firebase-Ready**: Operates seamlessly out-of-the-box with reactive local persistence and pre-seeded enterprise demo data, with zero-friction configuration for Firebase Auth, Firestore, and Storage.

---

## 👥 Role-Based Access Architecture

DAYFLOW strictly enforces Role-Based Access Control (RBAC) at both the UI and router levels:

| Capability | Standard Employee | Admin / HR Officer |
| :--- | :---: | :---: |
| **Workstation Dashboard** | Personal KPIs & Quick Attendance | Enterprise Executive KPI Dashboard |
| **Attendance Logging** | Self Check-In / Check-Out | Monitor All Shifts & Admin Overrides |
| **Leave Management** | Apply & Track Personal Leaves | Review, Authorize, or Decline (with notes) |
| **Compensation & Payroll** | Read-Only Summary & Payslip Download | Manage Salary Packages & Edit Allowances |
| **Workforce Directory** | Profile Dossier View | Add, Edit, Activate/Deactivate Personnel |
| **Document Vault** | Upload & Download Credentials | Review & Audit All Personnel Files |
| **Analytics & Reports** | Personal Attendance & Leave Graphs | Company SLA, Headcount & Cost Analytics |
| **System Settings** | Contact & Password Management | Full Security, Notification & Organization Settings |
| **Route Protection** | Blocked from `/admin/*` (403 Access Denied) | Access to Executive & Employee Tools |

---

## 🛠️ Technology Stack

- **Frontend Core**: React 19, TypeScript (Strict Mode, verbatim module syntax)
- **Tooling & Bundler**: Vite 8, Rolldown engine
- **Styling**: Tailwind CSS v4, PostCSS, Custom Design System Tokens, Full Dark/Light/System Mode
- **Icons & Visuals**: Lucide React
- **Data Visualization**: Recharts (Responsive bar charts, area trends, pie charts)
- **State Management & Reactivity**: Custom Reactive Event Subscription Layer (`dataService`) with `localStorage` persistence
- **Backend Ready**: Firebase Authentication, Cloud Firestore, Firebase Cloud Storage fallback architecture

---

## 📂 Project Architecture

```
c:/Projects/ODOO-DAYFLOW/
├── public/                 # Static assets, brand icons
├── src/
│   ├── assets/             # Vector icons and graphics
│   ├── components/
│   │   ├── common/         # Atomic UI design system (Button, Card, Badge, Modal, Input, etc.)
│   │   └── layout/         # AppShell, responsive Sidebar, sticky Navbar with notifications
│   ├── context/            # AuthContext, NotificationContext, ThemeContext
│   ├── data/               # Seed data for 10+ realistic enterprise employees & transactions
│   ├── firebase/           # Firebase SDK setup and graceful fallback detection
│   ├── pages/
│   │   ├── admin/          # Admin Dashboard, Employees, Attendance, Leaves, Payroll, Reports
│   │   ├── auth/           # Login, Register, Forgot Password, Reset Password, Verification
│   │   ├── common/         # Notification Center, Settings
│   │   ├── employee/       # Employee Dashboard, Profile, Attendance, Leave, Payroll, Documents
│   │   ├── legal/          # Privacy Policy, Terms of Service, Security Architecture
│   │   ├── public/         # SaaS Landing Page with Feature showcase & FAQs
│   │   └── system/         # 403 Access Denied, 404 Not Found
│   ├── routes/             # ProtectedRoute with strict role validation
│   ├── services/           # dataService (Reactive event bus, CRUD, calculations)
│   ├── types/              # Comprehensive TypeScript interfaces & domain models
│   ├── App.tsx             # Master application router
│   ├── index.css           # Design tokens, custom scrollbars, print styles
│   └── main.tsx            # Application entry point
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone & Install
```bash
git clone https://github.com/sabeeshvar/ODOO-DAYFLOW.git
cd ODOO-DAYFLOW
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build & Validation
```bash
npm run build
npm run preview
```

---

## 🔑 Pre-Configured Demo Credentials

For hackathons, evaluators, and product demonstrations, DAYFLOW provides instant 1-click accounts:

| Role | Email | Password | Personnel Name | Designation |
| :--- | :--- | :--- | :--- | :--- |
| **HR Admin** | `admin@dayflow.demo` | *(Any password)* | Alex Rivera | Head of People & Culture |
| **Employee** | `employee@dayflow.demo` | *(Any password)* | Sarah Jenkins | Lead Product Designer |

> **Tip**: You can switch roles instantly at any time using the **"Switch Role"** button located at the bottom of the left sidebar!

---

## 🔒 Security, Compliance & Policies

- **Role-Based Guards**: Direct URL navigation to `/admin/*` while authenticated as an Employee immediately redirects to `/access-denied`.
- **Statutory Compliant Payslips**: Automated breakdown for HRA, Transport, Special allowances, and statutory Provident Fund / TDS tax deductions.
- **Privacy Assurance**: Complete Enterprise Privacy Policy, Terms of Service, and Security Architecture statement built right into the application.

---

## 📜 License
MIT License © 2026 DAYFLOW Technologies. All rights reserved.
