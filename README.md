# VUE_E-commerce_application
This repository contains the backend/mock API for a simple **E-Commerce application** built for learning purposes.

The application provides APIs for managing products, users, orders, and basic administrative operations. The backend uses a local `db.json` file as a temporary database and runs locally during development.

## 🚀 Project Overview

The E-Commerce application supports basic shopping and administration functionality, including:

- User registration
- User login/authentication flow
- Product listing
- Product management
- Product details
- Order placement
- Order management
- Admin-related operations
- Basic data persistence using a local JSON database

The frontend of the application is developed using **Vue.js**, while this repository provides the local backend API.

## 🛠️ Technologies Used

- **Node.js**
- **JSON Server**
- **JavaScript**
- **REST APIs**
- **JSON**
- **db.json** – Temporary local database

## 📂 Project Structure

```text
backend/
│
├── db.json          # Local JSON database
├── package.json     # Project dependencies and scripts
├── package-lock.json
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DhanushbenB/VUE_E-commerce_application
```

### 2. Navigate to the Backend

```bash
cd Backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Backend

Run the JSON server using the configured npm script:

```bash
npx json-server --watch db.json
```

The API will be available locally, for example:

```text
http://localhost:3000
```

## 🗄️ Database

For this project, a local `db.json` file is used as a temporary database.

Example:

```json
{
  "users": [],
  "products": [],
  "orders": []
}
```

The JSON Server exposes these collections through REST APIs.

For example:

```text
GET    /products
GET    /products/:id

GET    /users
POST   /users

GET    /orders
POST   /orders
PATCH  /orders/:id
DELETE /orders/:id
```

The data is stored locally in `db.json` and is intended for development/demo purposes rather than production use.

## 🔗 Frontend

The frontend application is built using **Vue.js** and consumes the APIs provided by this backend.

Typical application flow:

```text
Vue.js Frontend
       │
       │ HTTP Requests
       ▼
JSON Server API
       │
       ▼
    db.json
```

## 👤 Application Features

### Customer

- Register an account
- Login
- Browse products
- View product details
- Add products to cart
- Place orders
- View order information

### Admin

- Admin login
- View products
- Add products
- Update products
- Delete products
- View customer/order information
- Manage orders

## ⚠️ Development Note

This project uses **JSON Server with a local `db.json` file** as a temporary backend.

It is intended for:

- Portfolio demonstration
- Frontend/backend integration practice
- REST API learning
- Local development

It is **not intended to be used as a production backend**.
- API validation and error handling

## 📄 License

This project is created for portfolio and educational purposes.
