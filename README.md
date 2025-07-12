# 🛡️ Insurance Recommendation API

A secure and scalable RESTful API built with **Node.js**, **Express**, and **Supabase**, designed to generate **life insurance plan recommendations** based on user-provided information like age, income, dependents, and risk tolerance. It includes API key authentication, rate limiting, logging of user inputs, and a modular, production-ready structure.

---

## 📌 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [PostgreSQL](#postgresql)
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
  git clone https://github.com/Sky-Gem-Solutions/life-insurance-api
  cd life-insurance-api
  npm install
  npm run dev
```

### PostgreSQL

create table public.life_insurance_recommendations (
  id uuid not null default gen_random_uuid (),
  age_min integer not null,
  age_max integer not null,
  risk_tolerance text null,
  dependents_min integer not null,
  dependents_max integer not null,
  income_min integer not null,
  income_max integer not null,
  plan text not null,
  coverage text not null,
  term_length text not null,
  explanation text null,
  created_at timestamp with time zone null default CURRENT_TIMESTAMP,
  constraint life_insurance_recommendations_pkey primary key (id),
  constraint life_insurance_recommendations_age_min_check check ((age_min >= 0)),
  constraint life_insurance_recommendations_dependents_max_check check ((dependents_max <= 100)),
  constraint life_insurance_recommendations_dependents_min_check check ((dependents_min >= 0)),
  constraint life_insurance_recommendations_income_max_check check ((income_max <= 10000000)),
  constraint life_insurance_recommendations_income_min_check check ((income_min >= 0)),
  constraint life_insurance_recommendations_age_max_check check ((age_max <= 120)),
  constraint life_insurance_recommendations_risk_tolerance_check check (
    (
      risk_tolerance = any (
        array[
          'low'::text,
          'medium'::text,
          'high'::text,
          'any'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create table public.user_inputs (
  id uuid not null default gen_random_uuid (),
  age integer not null,
  income integer not null,
  dependents integer not null,
  risk_tolerance text not null,
  ip_address text null,
  recommendations jsonb null,
  created_at timestamp with time zone null default now(),
  constraint user_inputs_pkey primary key (id)
) TABLESPACE pg_default;

create or replace function get_all_user_requests()
returns table (
  id uuid,
  age integer,
  income integer,
  dependents integer,
  risk_tolerance text,
  ip_address text,
  recommendations jsonb,
  created_at timestamp with time zone
)
as $$
begin
  return query
  select 
    user_inputs.id,
    user_inputs.age,
    user_inputs.income,
    user_inputs.dependents,
    user_inputs.risk_tolerance,
    user_inputs.ip_address,
    user_inputs.recommendations,
    user_inputs.created_at
  from user_inputs
  order by user_inputs.created_at desc;
end;
$$ language plpgsql;

create or replace function get_life_insurance_recommendation(
  input_age integer,
  input_income integer,
  input_dependents integer,
  input_risk_tolerance text
)
returns table (
  id uuid,
  age_min integer,
  age_max integer,
  risk_tolerance text,
  dependents_min integer,
  dependents_max integer,
  income_min integer,
  income_max integer,
  plan text,
  coverage text,
  term_length text,
  explanation text
)
as $$
begin
  return query
  select 
    r.id,
    r.age_min,
    r.age_max,
    r.risk_tolerance,
    r.dependents_min,
    r.dependents_max,
    r.income_min,
    r.income_max,
    r.plan,
    r.coverage,
    r.term_length,
    r.explanation
  from life_insurance_recommendations r
  where
    input_age between r.age_min and r.age_max and
    input_income between r.income_min and r.income_max and
    input_dependents between r.dependents_min and r.dependents_max and
    r.risk_tolerance = input_risk_tolerance;
end;
$$ language plpgsql;

INSERT INTO "public"."life_insurance_recommendations" 
("id", "age_min", "age_max", "risk_tolerance", "dependents_min", "dependents_max", "income_min", "income_max", "plan", "coverage", "term_length", "explanation", "created_at") 
VALUES 
('1c84af32-9e2c-470e-8611-63e22b321f55', '18', '30', 'low', '0', '1', '0', '50000', 'Term Life', '$250,000–$400,000', '20 years', 'You’re young with low risk; term insurance is affordable and offers good coverage.', '2025-07-12 18:10:01.818382+00'), 
('26d3846b-d1d9-44de-a726-9427f0599199', '0', '120', 'medium', '0', '100', '0', '10000000', 'Basic Term Life', '$250,000', '15 years', 'Based on the information provided, we suggest starting with a basic term life policy that provides essential coverage. You can always customize it later with the help of an advisor.', '2025-07-12 18:10:01.818382+00'), 
('3d426f43-f2d6-4c1e-81b6-1dc54e057357', '46', '55', 'low', '0', '1', '0', '75000', 'Term Life', '$250,000–$500,000', '15 years', 'As you approach retirement, a lower term helps cover remaining financial obligations.', '2025-07-12 18:10:01.818382+00'), 
('5c6f8c38-08b3-4866-812b-cb4e1d1dc593', '46', '55', 'high', '2', '10', '75001', '1000000', 'Term or Whole Life', '$500,000–$1,000,000', '20–30 years', 'Whole life can help with estate planning and permanent protection.', '2025-07-12 18:10:01.818382+00'), 
('5e8bfca1-2d2c-4640-b02c-46585af3199a', '46', '55', 'medium', '2', '10', '75001', '1000000', 'Term or Whole Life', '$500,000–$1,000,000', '20–30 years', 'Whole life can help with estate planning and permanent protection.', '2025-07-12 18:10:01.818382+00'), 
('60726bd0-6d89-4bf5-b546-31ec1fd8d683', '31', '45', 'medium', '1', '2', '50000', '100000', 'Term Life', '$750,000', '20 years', 'You’re in your prime earning years with dependents; this ensures family security.', '2025-07-12 18:10:01.818382+00'), 
('849685bd-d2bd-4ce6-a938-ba4f55acded1', '0', '120', 'high', '0', '100', '0', '10000000', 'Basic Term Life', '$250,000', '15 years', 'Based on the information provided, we suggest starting with a basic term life policy that provides essential coverage. You can always customize it later with the help of an advisor.', '2025-07-12 18:10:01.818382+00'), 
('a30f42ac-8b11-4fd4-8525-4ef4f6a04b06', '56', '65', 'low', '0', '10', '0', '75000', 'Final Expense', '$25,000–$100,000', 'Lifetime', 'You may only need coverage for funeral or minor debts.', '2025-07-12 18:10:01.818382+00'), 
('af16b132-21ca-47f9-9191-dce7267e5d7d', '18', '30', 'medium', '2', '10', '50001', '1000000', 'Term Life', '$500,000–$750,000', '25–30 years', 'You have dependents and growing income. Longer coverage protects during family-building years.', '2025-07-12 18:10:01.818382+00'), 
('c5e1bd4c-f530-4f7f-bfe2-94e4b9e28e25', '31', '45', 'low', '1', '2', '50000', '100000', 'Term Life', '$750,000', '20 years', 'You’re in your prime earning years with dependents; this ensures family security.', '2025-07-12 18:10:01.818382+00'), 
('c8732e66-80dc-4a83-be89-ccd5796423ee', '31', '45', 'high', '2', '10', '100001', '1000000', 'Term + Optional Whole', '$1,000,000+', '30 years', 'High income and risk means you may want optional permanent coverage as backup.', '2025-07-12 18:10:01.818382+00'), 
('d9b88be0-9e2b-432e-8977-f22352a97a34', '56', '65', 'high', '0', '2', '100001', '1000000', 'Whole Life', '$250,000–$500,000', 'Lifetime', 'A permanent policy can help with estate planning and wealth transfer.', '2025-07-12 18:10:01.818382+00'), 
('ee8861cd-e990-4371-849a-94350f7a8f73', '0', '120', 'low', '0', '100', '0', '10000000', 'Basic Term Life', '$250,000', '15 years', 'Based on the information provided, we suggest starting with a basic term life policy that provides essential coverage. You can always customize it later with the help of an advisor.', '2025-07-12 18:10:01.818382+00'), 
('f3f790f0-8078-4c10-8c3c-92aa5aa89efb', '56', '65', 'medium', '0', '10', '0', '75000', 'Final Expense', '$25,000–$100,000', 'Lifetime', 'You may only need coverage for funeral or minor debts.', '2025-07-12 18:10:01.818382+00'), 
('fbde4804-bb64-41c8-acde-1a0f03a5b68e', '18', '30', 'high', '2', '10', '50001', '1000000', 'Term Life', '$500,000–$750,000', '25–30 years', 'You have dependents and growing income. Longer coverage protects during family-building years.', '2025-07-12 18:10:01.818382+00');