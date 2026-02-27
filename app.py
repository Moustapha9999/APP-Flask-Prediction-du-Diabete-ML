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

# Charger le modèle et le scaler au démarrage
MODEL_PATH = 'meilleur_model_smote.pkl'
SCALER_PATH = 'scaler_smote.pkl'

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
    """Page d'accueil avec le formulaire"""
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint pour faire une prédiction
    Reçoit les données du formulaire et retourne la prédiction
    """
    try:
        # Récupérer les données du formulaire (JSON)
        data = request.get_json()
        
        # Vérifier que le modèle est chargé
        if model is None or scaler is None:
            return jsonify({
                'error': 'Modèle non disponible'
            }), 500
        
        # Extraire les features
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
        
        # Standardiser les données
        features_scaled = scaler.transform(features)
        
        # Faire la prédiction
        prediction = model.predict(features_scaled)
        probabilities = model.predict_proba(features_scaled)
        
        # Préparer la réponse
        result = {
            'prediction': int(prediction[0]),
            'prediction_text': 'Diabétique' if prediction[0] == 1 else 'Non Diabétique',
            'probability_non_diabetic': float(probabilities[0][0]),
            'probability_diabetic': float(probabilities[0][1]),
            'confidence': float(max(probabilities[0]) * 100)
        }
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            'error': f'Erreur lors de la prédiction: {str(e)}'
        }), 400


@app.route('/health')
def health():
    """Endpoint pour vérifier si l'API fonctionne"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None
    })


@app.route('/stats')
def stats():
    """Endpoint pour afficher les statistiques du modèle"""
    try:
        # Tu peux ajouter ici les statistiques de ton modèle
        # Par exemple, charger model_metrics.json si tu l'as sauvegardé
        return jsonify({
            'model_name': 'Logistic Regression (SMOTE)',
            'recall': 0.9818,
            'accuracy': 0.8052,
            'f1_score': 0.8286
        })
    except:
        return jsonify({'error': 'Statistiques non disponibles'}), 500


if __name__ == '__main__':
    # Lancer l'application Flask
    print("\n" + "="*60)
    print(" APPLICATION DE PRÉDICTION DU DIABÈTE")
    print("="*60)
    print("\n Serveur Flask démarré!")
    print(" URL: http://localhost:5000")
    print(" Appuyez sur Ctrl+C pour arrêter\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)