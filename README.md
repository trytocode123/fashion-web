# 👗 Fashion Hub - Modern E-Commerce Platform

**Fashion Hub** is a premium, full-stack e-commerce web application designed for the fashion industry. It features a robust Spring Boot backend and a highly responsive React frontend, providing a seamless shopping experience with integrated payment gateways and secure authentication.

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Multi-layered Auth**: JWT Stateless authentication combined with Spring Security 6.
- **Social Login**: Integrated Google OAuth2 for quick access.
- **Account Verification**: Secure email verification flow via Brevo API and Thymeleaf templates.
- **Role-based Access**: Specialized permissions for Administrators and Customers.

### 🛍️ Shopping Experience
- **Product Management**: Detailed product viewing with size and quantity selection.
- **Dynamic UI**: Optimized product detail pages with premium layouts and glassmorphism aesthetics.
- **Fast Loading**: Optimized async data fetching with centered skeleton/loading states.

### 💳 Payment Integration
- **Global Payments**: Integrated **PayPal** for international transactions.
- **Local Payments**: Integrated **VNPay** for domestic transactions in Vietnam.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 3
- **Security**: Spring Security 6 & JWT
- **Database**: MySQL with Spring Data JPA
- **Email Service**: Brevo (Sendinblue) API + Thymeleaf
- **Build Tool**: Gradle

### Frontend
- **Library**: React 18+
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS v4
- **Form Handling**: Formik & Yup
- **Icons**: React Icons (HeroIcons, IonIcons, FontAwesome)
- **Typography**: Google Fonts (Inter)

---

## 📂 Project Structure

```text
fashion_web/
├── backend/            # Spring Boot Application
│   ├── src/main/java/  # Java Source Code
│   └── src/resources/  # Configuration & Templates
├── frontend/           # React Application
│   ├── src/pages/      # Individual Page Components
│   ├── src/service/    # API Interaction Layer
│   └── src/redux/      # State Management Logic
└── README.md           # Project Documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- MySQL Server

### 1. Backend Setup
1. Open `backend` in your IDE.
2. Update `application.properties` with your MySQL credentials and API keys (Brevo, PayPal, VNPay).
3. Run `./gradlew bootRun`.

### 2. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your `VITE_API_BASE_URL`.
4. Run the development server:
   ```bash
   npm run dev
   ```

---

## 🎨 Design Philosophy
The project prioritizes a **Premium Visual Identity** through:
- **Typography**: Using the 'Inter' typeface for a modern look.
- **Micro-interactions**: Smooth hover effects and transitions.
- **UX Patterns**: Overlay navigation buttons and intuitive loading states.

---
*Developed with ❤️ as a high-quality portfolio project.*
