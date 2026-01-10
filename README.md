# StockMaster 📦

**StockMaster** is a professional-grade Inventory Management System (IMS) built using the MERN stack (MongoDB, Express, React, Node.js). It features robust role-based access control, secure Google OAuth authentication, and a complete audit trail via a specialized Stock Ledger.

---

## 🚀 Key Features

- **🔐 Multi-Auth System**: Secure login via traditional Email/Password or modern Google OAuth 2.0.
- **🛡️ Role-Based Access Control (RBAC)**: Distinct permissions for **Admin**, **Manager**, and **Staff** roles.
- **📜 Stock Ledger**: Every inventory movement is recorded as a ledger entry (Receipts, Deliveries, Adjustments) for 100% auditability.
- **🏢 Multi-Warehouse Support**: Manage stock across different warehouses and physical locations.
- **📊 Real-time Dashboard**: Visual overview of inventory levels and system activity.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Lucide React (Icons), Axios, @react-oauth/google.
- **Backend**: Node.js, Express.js, Mongoose (MongoDB).
- **Authentication**: JWT (JSON Web Tokens) & Google Auth Library.
- **Security**: Bcrypt.js (Password Hashing), Helmet, Cors.

---

## 📂 Project Structure

```text
StockMaster/
├── backend/            # Express API
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Mongoose Schemas (User, Stock, Ledger, etc.)
│   │   ├── routes/      # API Endpoints
│   │   └── middleware/  # Auth & Role verification
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # Auth State Management
│   │   └── pages/       # Dashboard, Inventory, Auth views
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Cloud Console Project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/StockMaster.git
cd StockMaster
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
```
Start the backend:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Update the Google Client ID in `src/main.jsx`.
Start the frontend:
```bash
npm run dev
```

---

## 🛣️ Roadmap
- [ ] **PDF/Excel Reports**: Export stock-on-hand and movement history.
- [ ] **Low Stock Alerts**: Automated notifications for replenishment.
- [ ] **QR Code Scanning**: Mobile-friendly inventory entry.
- [ ] **Activity Charts**: Visual data representation using Recharts.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License.
