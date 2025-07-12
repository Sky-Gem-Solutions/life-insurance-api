# 🛡️ Insurance Recommendation API

A secure and scalable RESTful API built with **Node.js**, **Express**, and **Supabase**, designed to generate **life insurance plan recommendations** based on user-provided information like age, income, dependents, and risk tolerance. It includes API key authentication, rate limiting, logging of user inputs, and a modular, production-ready structure.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Error Handling](#error-handling)
- [License](#license)

---

## ✅ Features

- 🔐 **API Key Authentication** via request headers
- 🚦 **Rate Limiting** using `express-rate-limit`
- 📊 **Personalized Insurance Plan Recommendations**
- 🧾 **Logs User Inputs + IP** in Supabase
- 📁 **Modular Codebase** for routes, middleware, and utilities
- 🌐 **CORS Configuration** via environment variable
- 🧪 **TypeScript** support for type safety

---

## 🧰 Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: Supabase (PostgreSQL + RPC + REST)
- **Security**: API Key Authentication
- **Utilities**: dotenv, express-rate-limit, CORS

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A [Supabase](https://supabase.com/) project with the following:
  - A `user_inputs` table
  - Two RPC functions:
    - `get_life_insurance_recommendation`
    - `get_all_user_requests`

### Installation

```bash
git clone https://github.com/your-username/insurance-recommendation-api.git
cd insurance-recommendation-api
npm install
