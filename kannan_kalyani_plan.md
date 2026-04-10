# 🚀 Kannan Kalyani Logistics — Rewrite & Advanced Calculator Plan

---

## 1. 🎯 Objective
Rebuild the current static website into a scalable web app with a **Smart Expense Calculator** and **Admin Pricing Control**.

---

## 2. 🔁 Tech Migration
- Frontend: React (Vite)
- Styling: Tailwind CSS
- Backend: Node.js + Express
- Database: Firebase / Supabase

---

## 3. 📐 Calculator Feature (Updated Logic)

### 3.1 User Inputs
- Material Type
- Measurement (ft): 145, 150, 195, 200, 250
- Number of Loads
- Location

---

### 3.2 Material Pricing Types

#### Type A: Per Foot Pricing
(Example: M-Sand, P-Sand, Metal)

Formula:
Material Cost = price_per_ft × selected_ft

---

#### Type B: Fixed Load Pricing
(Example: Gravel, Cutting Earth)

Formula:
Material Cost = price_per_load

---

### 3.3 Transport Cost
Transport Cost = location_rate

---

### 3.4 Final Calculation

Step 1:
Base Cost = Material Cost + Transport Cost

Step 2:
Total Cost = Base Cost × Number of Loads

---

### 3.5 Output
- Material Cost
- Transport Cost
- Total Cost

---

### 3.6 Disclaimer
“This is an approximate estimate. Actual cost may vary.”

---

## 4. 🛠 Admin Panel Features

### Material Configuration
Each material has:
- name
- pricing_type: "per_ft" or "per_load"
- price_per_ft (optional)
- price_per_load (optional)

Admin can:
- Select pricing type
- Update prices dynamically

---

### Location Configuration
- name
- transport_rate

---

## 5. 🗄 Data Structure

materials = [
  {
    name: "M-Sand",
    pricing_type: "per_ft",
    price_per_ft: 50
  },
  {
    name: "Gravel",
    pricing_type: "per_load",
    price_per_load: 3000
  }
]

locations = [
  {
    name: "Kollam",
    transport_rate: 1500
  }
]

---

## 6. 🔌 API Design

GET /materials
GET /locations
POST /calculate

Admin:
POST /materials
PUT /materials/:id
PUT /locations/:id

---

## 7. 🚦 Development Phases

Phase 1:
- React UI
- Static calculator logic

Phase 2:
- Backend integration
- Dynamic pricing

Phase 3:
- Admin panel

---

## 8. ✅ Final Goal
A modern, scalable logistics web app with a flexible pricing system and reliable cost estimation.
