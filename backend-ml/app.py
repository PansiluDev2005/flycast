from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import os
import warnings
from datetime import datetime

# Suppress the InconsistentVersionWarning from scikit-learn
warnings.filterwarnings("ignore", category=UserWarning, module="sklearn")

app = Flask(__name__)
CORS(app)

# Load Models
models_dir = os.path.join(os.path.dirname(__file__), 'models')
os.makedirs(models_dir, exist_ok=True)

models = {}
expected_models = ['delay_classifier.pkl', 'delay_regressor.pkl', 'le_carrier.pkl', 'le_origin.pkl', 'le_dest.pkl']

for model_name in expected_models:
    model_path = os.path.join(models_dir, model_name)
    if os.path.exists(model_path):
        with open(model_path, 'rb') as f:
            models[model_name] = pickle.load(f)
    else:
        print(f"Warning: {model_name} not found in {models_dir}")

# Carrier & Airport Knowledge Mapping for International & Sri Lankan Flights
CARRIER_ALIASES = {
    'UL': 'Delta Air Lines Inc.',         # SriLankan Airlines (Full-service flag carrier profile)
    'SRILANKAN': 'Delta Air Lines Inc.',
    'SRILANKAN AIRLINES': 'Delta Air Lines Inc.',
    'EK': 'United Air Lines Inc.',        # Emirates
    'QR': 'United Air Lines Inc.',        # Qatar Airways
    'SQ': 'American Airlines Inc.',       # Singapore Airlines
    'AI': 'Delta Air Lines Inc.',         # Air India
    '6E': 'Southwest Airlines Co.',       # IndiGo (Low-cost high frequency)
    'FZ': 'Southwest Airlines Co.',       # flydubai
    'AA': 'American Airlines Inc.',
    'DL': 'Delta Air Lines Inc.',
    'UA': 'United Air Lines Inc.',
    'WN': 'Southwest Airlines Co.',
    'B6': 'JetBlue Airways',
    'AS': 'Alaska Airlines Inc.',
    'NK': 'Spirit Air Lines'
}

AIRPORT_ALIASES = {
    'CMB': 'JFK',   # Colombo Bandaranaike International Airport (Primary Hub Profile)
    'HRI': 'MIA',   # Mattala Rajapaksa International Airport
    'JAF': 'BOS',   # Jaffna International Airport
    'MLE': 'MCO',   # Velana International Airport, Male
    'DXB': 'LAX',   # Dubai International
    'SIN': 'SFO',   # Singapore Changi
    'LHR': 'ORD',   # London Heathrow
    'MAA': 'ATL',   # Chennai International
    'BKK': 'SEA',   # Bangkok Suvarnabhumi
    'KUL': 'DEN',   # Kuala Lumpur International
    'DEL': 'DFW',   # Delhi Indira Gandhi International
    'DOH': 'LAX',   # Doha Hamad International
    'MEL': 'SFO'    # Melbourne Tullamarine
}

def resolve_carrier(val):
    if not val: return 'American Airlines Inc.'
    clean_val = str(val).strip().upper()
    return CARRIER_ALIASES.get(clean_val, val)

def resolve_airport(val):
    if not val: return 'JFK'
    clean_val = str(val).strip().upper()
    return AIRPORT_ALIASES.get(clean_val, val)

def safe_transform(le, series, default=0):
    if not le: return pd.Series([default] * len(series))
    known_classes = set(le.classes_)
    return series.apply(lambda x: le.transform([x])[0] if x in known_classes else (
        le.transform([resolve_carrier(x)])[0] if resolve_carrier(x) in known_classes else (
            le.transform([resolve_airport(x)])[0] if resolve_airport(x) in known_classes else le.transform([le.classes_[0]])[0]
        )
    ))

def safe_transform_single(le, val, default=0):
    if not le: return default
    try:
        clean_val = str(val).strip().upper() if val else ''
        if clean_val in le.classes_:
            return le.transform([clean_val])[0]
        
        # Check alias resolvers
        resolved_c = resolve_carrier(clean_val)
        if resolved_c in le.classes_:
            return le.transform([resolved_c])[0]
            
        resolved_a = resolve_airport(clean_val)
        if resolved_a in le.classes_:
            return le.transform([resolved_a])[0]
            
        return le.transform([le.classes_[0]])[0]
    except Exception:
        return default

def process_flight(flight_data):
    """
    For single prediction dict
    """
    try:
        dt = datetime.strptime(flight_data.get('date', '2026-08-25'), '%Y-%m-%d')
        month = dt.month
        day_of_week = dt.isoweekday() # 1-7
    except Exception:
        month, day_of_week = 8, 3

    carrier = flight_data.get('carrier', 'UL')
    origin = flight_data.get('origin', 'CMB')
    dest = flight_data.get('dest', 'LHR')
    crs_dep_time = int(flight_data.get('crs_dep_time', 1300))
    distance = int(flight_data.get('distance', 2500))

    airline_enc = safe_transform_single(models.get('le_carrier.pkl'), carrier)
    origin_enc = safe_transform_single(models.get('le_origin.pkl'), origin)
    dest_enc = safe_transform_single(models.get('le_dest.pkl'), dest)

    return [month, day_of_week, airline_enc, origin_enc, dest_enc, crs_dep_time, distance]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    if not isinstance(data, list):
        data = [data]
        
    try:
        if len(models) < len(expected_models):
            return jsonify({"error": "ML Models not fully loaded."}), 500
        
        results = []
        for flight in data:
            features = process_flight(flight)
            feature_df = pd.DataFrame([features], columns=['Month', 'DayOfWeek', 'AIRLINE', 'ORIGIN', 'DEST', 'CRS_DEP_TIME', 'DISTANCE'])
            
            classifier = models['delay_classifier.pkl']
            prob_dist = classifier.predict_proba(feature_df)[0]
            delay_prob = float(prob_dist[1]) if len(prob_dist) > 1 else 0.0
            
            est_minutes = 0
            if delay_prob > 0.5:
                regressor = models['delay_regressor.pkl']
                est_minutes = float(regressor.predict(feature_df)[0])
                est_minutes = max(0, est_minutes)
                
            results.append({
                "flight_id": flight.get('flight_id', f"{flight.get('carrier')}{flight.get('crs_dep_time')}"),
                "delay_probability": delay_prob,
                "estimated_delay_minutes": int(est_minutes),
                "status": "Delayed" if delay_prob > 0.5 else "On Time"
            })
            
            print(f"--- [Single Predict] Flight: {results[-1]['flight_id']} | Prob: {delay_prob:.2f} | Est. Min: {int(est_minutes)} ---", flush=True)
            
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/predict-bulk', methods=['POST'])
def predict_bulk():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    try:
        if len(models) < len(expected_models):
            return jsonify({"error": "ML Models not fully loaded."}), 500

        # Read CSV
        df = pd.read_csv(file)
        
        # Expected CSV columns: FLIGHT_ID, DATE, CARRIER, ORIGIN, DEST, CRS_DEP_TIME, DISTANCE
        # Create Month and DayOfWeek
        df['DATE'] = pd.to_datetime(df['DATE'], errors='coerce')
        df['Month'] = df['DATE'].dt.month.fillna(1).astype(int)
        df['DayOfWeek'] = df['DATE'].dt.dayofweek.fillna(0).astype(int) + 1 # 1-7

        features = pd.DataFrame()
        features['Month'] = df['Month']
        features['DayOfWeek'] = df['DayOfWeek']
        features['AIRLINE'] = safe_transform(models['le_carrier.pkl'], df['CARRIER'])
        features['ORIGIN'] = safe_transform(models['le_origin.pkl'], df['ORIGIN'])
        features['DEST'] = safe_transform(models['le_dest.pkl'], df['DEST'])
        features['CRS_DEP_TIME'] = pd.to_numeric(df['CRS_DEP_TIME'], errors='coerce').fillna(1200).astype(int)
        features['DISTANCE'] = pd.to_numeric(df['DISTANCE'], errors='coerce').fillna(1000).astype(int)
        
        classifier = models['delay_classifier.pkl']
        probs = classifier.predict_proba(features)
        
        # Assuming index 1 is delay class
        delay_probs = probs[:, 1] if probs.shape[1] > 1 else probs[:, 0] * 0
        
        df['delay_probability'] = delay_probs
        
        # Regressor for > 0.5
        delayed_mask = df['delay_probability'] > 0.5
        df['estimated_minutes'] = 0.0
        if delayed_mask.any():
            regressor = models['delay_regressor.pkl']
            predicted_mins = regressor.predict(features[delayed_mask])
            df.loc[delayed_mask, 'estimated_minutes'] = predicted_mins
            
        df['estimated_minutes'] = df['estimated_minutes'].clip(lower=0).astype(int)
            
        # Sort by probability
        df = df.sort_values(by='delay_probability', ascending=False)
        
        results = []
        for _, row in df.iterrows():
            results.append({
                "flight_id": str(row.get('FLIGHT_ID', f"{row.get('CARRIER')}{row.get('CRS_DEP_TIME')}")),
                "delay_probability": float(row['delay_probability']),
                "estimated_minutes": int(row['estimated_minutes'])
            })
            
        print(f"--- [Bulk Predict] Processed {len(df)} flights | Returned all flights ---", flush=True)
            
        return jsonify(results), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/retrain', methods=['POST'])
def retrain():
    # Mock endpoint for ML Model Management
    # In a real scenario, this would trigger a background task to rebuild the .pkl files
    return jsonify({
        "message": "Retraining triggered successfully. Models are updating in the background.",
        "status": "in-progress"
    }), 200

if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=5001)
