# 🛠 Fixit - Service Booking Platform

A full-stack web application for users where they can book verified technician providing experienced services (eg. plumbing, electrician, carpentry, repair, cleaning).

Built with **Next.js**, **Prisma**, and **PostgreSQL**.

---

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) + React + Tailwind CSS + Typescript
- **Backend**: Next.js API Routes + Typescript
- **Database ORM**: [Prisma](https://www.prisma.io/) + PostgreSQL
- **Auth**: [NextAuth.js](https://next-auth.js.org/)
- **Payment Integration**: Stripe
- **UI Library**: Aceternity UI
- **Testing**: Postman
- **Deployment**: Vercel

---

## 📌 Features

- **Role based Access**:  
  - `CUSTOMER` – Book services from verified technicians.  
  - `TECHNICIAN` – Provide services, manage bookings.  
  - `ADMIN` – Manage technicians, users, and bookings.

- **Core Modules**:
  - User authentication & role management
  - Technician verification system
  - Service management (Plumbing, Electrician, etc.)
  - Booking creation, status updates, and payments
  - Review & rating system
  - Admin dashboard with statistics:
    - Total users
    - Verified & pending technicians
    - Total, completed, and cancelled bookings
  - Payment Integration using Stripe

---

## 🗄 Database Schema (Prisma)

Key models:

- **User**
- **Technician**
- **Service**
- **Booking**
- **Review**

Located in [`prisma/schema.prisma`](./prisma/schema.prisma).

---

## 📂 Project Structure

.
├── prisma/
│ └── schema.prisma # Prisma schema & database models
├── src/
│ ├── app/
│ │ └── api/ # API routes
│ ├── components/ # Reusable UI components
│ ├── lib/
│  └── prisma.ts # Prisma client instance
├── package.json
└── README.md


---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/service-booking-platform.git
cd service-booking-platform
```

2️⃣ Install dependencies
```bash
npm install
```

3️⃣ Configure environment variables

Create a .env file in the root:
```bash
DATABASE_URL="postgresql://user:password@localhost:5432/service_db"
NEXTAUTH_SECRET="your_secret_key"
```

4️⃣ Run Prisma migrations
```bash
npx prisma migrate dev
```

(Optional) Generate Prisma Client:
```bash
npx prisma generate
```

5️⃣ Start the development server
```bash
npm run dev
```

## 🔗 Deployment 

Live demo: https://fix-it-phi.vercel.app/

Demo Credentials:
-Customer: 
email:pratik@gmail.com 
pass:pratik123
-Technician: 
email:technician@test.com 
pass:123456

## Feel free to give feedback and suggestion.Drop a mail choratswapnil15@gmail.com 📧