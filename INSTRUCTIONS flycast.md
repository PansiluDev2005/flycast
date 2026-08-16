# Flycast System Architecture & Implementation Guide
**Version:** 1.0.0
**Context:** This document serves as the master blueprint for the Antigravity IDE agent to build "Flycast," an AI-Powered Flight Delay Prediction System utilizing a Polyglot Microservices Architecture.

## 1. System Overview
Flycast shifts aviation management from reactive tracking to proactive prediction. It utilizes a MERN stack (MongoDB, Express.js, React.js, Node.js) for the primary application and a decoupled Python Flask microservice for executing Machine Learning inferences (Random Forest) to predict flight delays.

### 1.1 Core User Roles (RBAC)
1. **Passenger (B2C):** Can check individual flight delay probabilities, view estimated delay durations, and save flights to a personal watchlist.
2. **Flight Dispatcher (B2B):** Can access the Operational Triage Dashboard to upload bulk flight schedules (CSV) for batch AI prediction.
3. **Admin:** Can manage user roles and view system-wide prediction analytics.

---

## 2. Tech Stack & Architecture
* **Frontend:** React.js, Tailwind CSS, Axios, React Router, Recharts (for analytics).
* **API Gateway (Backend):** Node.js, Express.js, Mongoose, JWT (Authentication), Bcrypt (Password Hashing).
* **Database:** MongoDB Atlas.
* **ML Microservice:** Python 3, Flask, Scikit-Learn, Pandas.
* **Pre-trained ML Assets:** `delay_classifier.pkl`, `delay_regressor.pkl`, `le_carrier.pkl`, `le_origin.pkl`, `le_dest.pkl` (Provided by user, do not train from scratch).

---

## 3. Recommended Directory Structure (Monorepo)
The agent should scaffold the project using the following structure:

```text
flycast/
│
├── frontend/                 # React.js Application
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Gauges, FileUpload)
│   │   ├── pages/            # Views (Home, Predictor, Dashboard, Admin)
│   │   ├── context/          # React Context (AuthContext)
│   │   └── utils/            # Axios interceptors, helpers
│   └── package.json
│
├── backend-node/             # Node.js / Express API Gateway
│   ├── controllers/          # Auth, Users, Watchlist, Proxy to Flask
│   ├── models/               # Mongoose Schemas (User, Watchlist)
│   ├── routes/               # API endpoint definitions
│   ├── middleware/           # JWT verification, Role-checking
│   ├── .env                  # Port (5000), Mongo URI, JWT Secret
│   └── server.js
│
└── backend-ml/               # Python Flask Microservice
    ├── models/               # PLACE THE 5 DOWNLOADED .PKL FILES HERE
    ├── app.py                # Flask server and inference endpoints
    └── requirements.txt      # flask, scikit-learn, pandas, flask-cors


    4. Database Schema (Mongoose / Node.js)
4.1 User Model (models/User.js)
name: String, required

email: String, required, unique

password: String, required (Hashed via Bcrypt)

role: String, enum: ['Passenger', 'Dispatcher', 'Admin'], default: 'Passenger'

4.2 Watchlist Model (models/Watchlist.js)
user_id: ObjectId (Ref: User)

airline: String (e.g., 'UL' for SriLankan Airlines)

flight_number: String

origin: String (e.g., 'CMB')

destination: String

scheduled_time: Date

predicted_delay_prob: Number

predicted_delay_minutes: Number

5. API Specifications
5.1 Node.js API Gateway (Runs on Port 5000)
POST /api/auth/register - Create new user, hash password.

POST /api/auth/login - Verify credentials, return JWT.

GET /api/watchlist - (Protected) Get user's saved flights.

POST /api/watchlist - (Protected) Save a new flight.

POST /api/predict/single - (Protected) Receives flight data from React, securely forwards it to the Flask ML service, and returns the AI response to React.

POST /api/predict/bulk - (Protected, Dispatcher Only) Receives CSV from React, forwards to Flask, returns processed triage data.

5.2 Python Flask ML Service (Runs on Port 5001)
POST /predict

Input Payload: JSON containing date, airline, origin, destination, scheduled_time, distance.

Process:

Parse date to extract Month and DayOfWeek.

Load le_carrier.pkl, le_origin.pkl, le_dest.pkl to encode string inputs to integers.

Feed encoded array [Month, DayOfWeek, AIRLINE, ORIGIN, DEST, CRS_DEP_TIME, DISTANCE] into delay_classifier.pkl.

If probability > 0.5, feed into delay_regressor.pkl.

Output Payload: JSON { "delay_probability": 0.85, "estimated_minutes": 45 }.

POST /predict-bulk

Input: CSV file.

Process: Apply encodings and models to the entire Pandas DataFrame.

Output: JSON array of high-risk flights sorted by delay probability.

6. Implementation Steps for the IDE Agent
Agent Instructions: Execute the following phases sequentially. Do not proceed to the next phase until the current one is fully functional.

Phase 1: Environment & Scaffold
Initialize the root directory.

Create the three main folders (frontend, backend-node, backend-ml).

Initialize package.json in Node and React; create requirements.txt in Flask.

Phase 2: Python ML Microservice
Set up a basic Flask server in backend-ml/app.py.

Implement logic to load the 5 .pkl models using the pickle library on server startup (to prevent loading overhead on every request).

Create the /predict endpoint that handles data transformation (Label Encoding) and returns the Random Forest predictions. Test this locally.

Phase 3: Node.js API Gateway
Connect to MongoDB Atlas.

Implement User Auth (Bcrypt, JWT) and Mongoose schemas.

Create the proxy routes in Node.js that format user requests and forward them via axios to http://localhost:5001/predict.

Phase 4: React Frontend
Set up React Router with protected routes based on JWT and RBAC (Passenger vs Dispatcher views).

Build the Predictor Form (Inputs: Date, Time, Airline, Origin, Destination, Distance).

Build the Prediction UI (Display a visual gauge for Probability and a text alert for Duration).

Build the Dispatcher Dashboard (File upload component for CSVs and a data table to display flagged flights).

Phase 5: Polish & UX
Apply Tailwind CSS for a modern, responsive, and professional UI.

Implement loading spinners during API calls (specifically during ML inference).

Add robust error handling (e.g., if the user inputs an airport code that the Label Encoder does not recognize).