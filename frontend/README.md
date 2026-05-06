# 👗 Fashion E-commerce Platform

A modern fashion e-commerce web application that allows users to browse products, view detailed item information, and complete purchases through a smooth and secure checkout experience.

The project is built as a full-stack application with a clear separation between frontend and backend, focusing on real-world authentication, payment integration, and product management flows.

---

## ✨ Key Features

- Browse and explore fashion products with detailed information
- User authentication with Email/Password and Google Login
- Secure online payment integration via VNPay
- Product, inventory, size, and pricing management
- Order tracking and transaction status updates
- Responsive and modern user interface

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Redux Toolkit & Redux Persist
- React Router DOM
- Axios
- Tailwind CSS
- Formik & Yup
- Headless UI

### Backend
- Spring Boot 4
- Spring Security
- JWT (Stateless Authentication)
- Google OAuth2
- Spring Data JPA (Hibernate)
- MySQL
- VNPay (v2.1.0)
- Gradle

---

## 🔐 Authentication

- Traditional authentication using JWT (stateless)
- Social login with Google OAuth2
- Secure session persistence on the client side

---

## 💳 Payment Integration

- VNPay integration following version 2.1.0 specifications
- Secure HMAC-SHA512 hashing
- Proper handling of payment callbacks and transaction status

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18
- Java 17+
- MySQL

### Frontend Setup
```bash
npm install
npm run dev

