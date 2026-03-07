"""
Application Flask pour la prédiction du diabète
Auteurs: Moustapha Youssouf Sall & Mouhamed Moustapha SY
Master 2 IAGE - Data Management & Analytics
"""

from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd 
import os

app = Flask(__name__)

MODEL_PATH = 'random_forest_diabetes.pkl'
SCALER_PATH = 'scaler_diabetes.pkl'

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print(" Modèle et scaler chargés avec succès!")
except Exception as e:
    print(f" Erreur lors du chargement: {e}")
    model = None
    scaler = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        if model is None:
            return jsonify({'error': 'Modèle non disponible'}), 500

        features = pd.DataFrame({
            'Pregnancies': [float(data['pregnancies'])],
            'Glucose': [float(data['glucose'])],
            'BloodPressure': [float(data['bloodPressure'])],
            'SkinThickness': [float(data['skinThickness'])],
            'Insulin': [float(data['insulin'])],
            'BMI': [float(data['bmi'])],
            'DiabetesPedigreeFunction': [float(data['diabetesPedigreeFunction'])],
            'Age': [float(data['age'])]
        })

        # Appliquer le scaler si nécessaire (ajouté pour cohérence)
        if scaler:
            features_scaled = scaler.transform(features)
            prediction = model.predict(features_scaled)
            probabilities = model.predict_proba(features_scaled)
        else:
            prediction = model.predict(features)
            probabilities = model.predict_proba(features)

        result = {
            'prediction': int(prediction[0]),
            'prediction_text': 'Diabétique' if prediction[0] == 1 else 'Non Diabétique',
            'probability_non_diabetic': float(probabilities[0][0]),
            'probability_diabetic': float(probabilities[0][1]),
            'confidence': float(max(probabilities[0]) * 100)
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': f'Erreur lors de la prédiction: {str(e)}'}), 400

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

@app.route('/stats')
def stats():
    return jsonify({
        'model_name': 'Random Forest',
        'accuracy': 0.8766,
        'precision': 0.8214,
        'recall': 0.8364,
        'f1_score': 0.8288
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)