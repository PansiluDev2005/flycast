<h1 align="center">
  <br>
  <img src="https://lucide.dev/icons/plane-takeoff.svg" alt="Flycast" width="100">
  <br>
  Flycast
  <br>
</h1>

<h4 align="center">An AI-Powered Flight Delay Prediction System utilizing a Polyglot Microservices Architecture.</h4>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#running-locally">Running Locally</a> •
  <a href="#user-logins">User Logins (Demo)</a>
</p>

---

## Overview

**Flycast** shifts aviation management from reactive tracking to proactive prediction. It features a premium, responsive web interface for passengers and dispatchers, powered by a highly optimized Machine Learning backend that evaluates flight schedules and predicts delays before they happen.

### Features
- **Passenger Triage (Predictor):** Search for individual flights to check AI-calculated delay probabilities and estimated delay duration.
  - *Sample Input 1:* Carrier: `AA`, Origin: `JFK`, Dest: `LAX`, Time: `0800`, Dist: `2475`
  - *Sample Input 2:* Carrier: `DL`, Origin: `ATL`, Dest: `MIA`, Time: `1430`, Dist: `594`
- **Dispatcher Dashboard:** Upload bulk CSV schedules for rapid batch AI inference and analytics.
- **Admin Panel:** Monitor system-wide statistics and user demographics.
- **Premium UI/UX:** Built with a sleek dark-mode, aviation-inspired design and glassmorphism styling.

## Architecture

Flycast is built using a **Polyglot Monorepo Architecture**, separating concerns into three primary services:

1. **`frontend/` (React.js UI)**
   - Built with **React** and **Vite**.
   - Styled with **Tailwind CSS v4** for a state-of-the-art interface.
   - Charts powered by **Recharts**.

2. **`backend-node/` (Node.js API Gateway)**
   - Built with **Express.js** and **Mongoose**.
   - Handles JWT Authentication and Role-Based Access Control (RBAC).
   - Proxies incoming API requests and multipart CSV file streams directly to the ML microservice.
   - Connected to **MongoDB Atlas**.

3. **`backend-ml/` (Python ML Microservice)**
   - Built with **Flask** and **Waitress**.
   - Powered by **Pandas** for rapid batch dataframe processing.
   - Leverages **Scikit-Learn** (`.pkl` models) to perform Label Encoding, Random Forest Classification, and Decision Tree Regression.

---

## Running Locally

To run the entire system locally, you need to spin up all three services in three separate terminal windows.

### 1. Python ML Backend (Terminal 1)
This service performs the actual AI predictions.
```bash
cd backend-ml
pip install -r requirements.txt
python app.py
```
*(Runs on `http://localhost:5001`)*

### 2. Node.js API Gateway (Terminal 2)
This service handles database connections and request routing.
```bash
cd backend-node
npm install
npm start
```
*(Runs on `http://localhost:5000`)*

### 3. React Frontend (Terminal 3)
This serves the UI to the user.
```bash
cd frontend
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## User Logins

For demonstration and testing purposes, the frontend is equipped with a fallback mock-authentication layer. If you haven't explicitly registered these users in your MongoDB database yet, you can still log in using the following test credentials to bypass the database check and view the different UI roles:

| Role | Username | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | *Any password* | Access to Admin Panel, Dashboard, and Predictor. |
| **Dispatcher** | `dispatcher` | *Any password* | Access to the Bulk Upload CSV Dashboard and Predictor. |
| **Passenger** | `jdoe123` *(or anything else)* | *Any password* | Access to the single-flight Predictor tool only. |

> **Note:** To test the Dispatcher bulk upload, ensure your CSV has the following exact column headers: `FLIGHT_ID, DATE, CARRIER, ORIGIN, DEST, CRS_DEP_TIME, DISTANCE`.


Sample Flight 1 (New York to Los Angeles)

Flight ID: AA123
Airline Carrier Code: AA (American Airlines)
Origin (Code): JFK
Dest (Code): LAX
Date: (Pick any date, e.g., tomorrow's date)
Dep Time (HHMM): 0800 (8:00 AM)
Distance (Miles): 2475
Sample Flight 2 (Atlanta to Miami - High Risk)

Flight ID: DL456
Airline Carrier Code: DL (Delta)
Origin (Code): ATL
Dest (Code): MIA
Date: (Pick any date)
Dep Time (HHMM): 1430 (2:30 PM)
Distance (Miles): 594