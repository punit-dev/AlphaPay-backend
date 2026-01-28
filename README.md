# 💸 AlphaPay - Simplifying Digital Payment

_A secure and modern digital payment backend built with Node.js, Express, MongoDB, and JWT._<br><br>
AlphaPay is a full-featured backend system that simulates real-world digital payments (similar to UPI apps). It includes secure authentication, wallet management, transaction handling, bill payments, admin dashboard.

---

## 🚀 Features

### 🔐 User Features

- JWT-based authentication & role-based access
- Email OTP verification
- Secure encrypted data (UPI PIN, password, DOB, etc.)
- Wallet system with balance tracking
- Send/receive money via UPI ID and Phone number
- Bill payment support
- Add & manage debit/credit cards
- Transaction history
- Notification system

### 🛡️ Security Highlights

- Password & UPI PIN encryption using `bcrypt` / `mongoose-encryption`
- Request validation using custom middlewares
- Centralized error handling
- OTP expiration & one-time-use logic
- Rate-safety around transactions

---

## 🛠️ Tech Stack

| Layer     | Technology                                |
| --------- | ----------------------------------------- |
| Server    | Node.js, Express.js                       |
| Database  | MongoDB + Mongoose                        |
| Auth      | JWT                                       |
| Testing   | Jest, Supertest, MongoDB Memory Server    |
| Utilities | Cron Jobs, Email/OTP, Socket-based alerts |

---

📁 Project Structure

```bash
AlphaPay-backend/
│
├─ backend/
│   ├─ index.js
│   ├─ package.json
│   ├─ public
│   │   └─ avatar/
│   ├─ src
│   │   ├─ app.js
│   │   ├─ config/
│   │   ├─ controllers/
│   │   │   ├─ admin-controllers/
│   │   │   └─ user-controllers/
│   │   ├─ cron.js
│   │   ├─ middleware/
│   │   │   ├─ admin-middleware/
│   │   │   ├─ user-middleware/
│   │   │   └─ errorHandler.js
│   │   ├─ models/
│   │   │   ├─ admin-models/
│   │   │   └─ user-models/
│   │   ├─ routes/
│   │   │   ├─ admin-routes/
│   │   │   └─ user-routes/
│   │   └─ util/
│   └─ tests
│       ├─ admin-tests/
│       └─ user-tests/
├─ docs
│   └─ alphaPay.postman_collection.json
├─ .github/
├─ .gitignore
├─ LICENSE
└─ README.md

```

---

## ⚙️ Setup Instructions

1. Clone the project:

   ```bash
   git clone https://github.com/punit-dev/AlphaPay-backend.git
   cd AlphaPay-backend/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.

     ```ini
     PORT=5000
     MONGO_URI=your_mongodb_uri

     JWT_SECRET=your_jwt_secret

     MY_EMAIL=your_email_service
     MY_EMAIL_PASS=your_email_username

     ENCRYPTION_KEY=your_encryption_key
     SIG_KEY=your_signature_key

     NODE_ENV=development
     ```

4. Run development server:
   ```bash
   npm run start
   ```
5. Run tests:
   (Jest + Supertest + MongoDB Memory Server)
   ```bash
   npm run test
   ```

---

## 📬 API Documentation

All APIs (Users + Payments + Bills + Cards + Notifications + Admin + Stats) are documented clearly in Postman.

### 🔗 Postman Collection

```bash
/docs/AlphaPay.postman_collection.json
```

> _You can test all routes using the Postman collection provided in the repo._

---

## 📊 Admin Dashboard Features

- User management
- Block/unblock users
- Transaction monitoring
- Refund operations
- Deduct wallet balance
- Detailed analytics:
  - Total users
  - Active users
  - Total transactions
  - Failed/success/refund stats
  - Revenue & Avg transaction value
  - Top users

---

## 📄 License

[MIT License](LICENSE) © 2025 Punit Poddar

---

> ⚠️ This project is developed and maintained by **Punit Poddar**.
