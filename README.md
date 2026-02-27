#  Application de Prédiction du Diabète

Application web Flask pour prédire le diabète en utilisant un modèle de Machine Learning (Logistic Regression + SMOTE).

**Auteurs:** Moustapha Youssouf Sall & Mouhamed Moustapha SY  
**Formation:** Master 2 IAGE - Data Management & Analytics  
**Institution:** Institut Supérieur d'Informatique (ISI)

---

##  Performance du Modèle

- **Recall:** 98.18% (détection des diabétiques)
- **Accuracy:** 80.52%
- **F1-Score:** 82.86%
- **Faux Négatifs:** 1 seul sur 55 diabétiques

---

##  Structure du Projet

```
diabetes-flask-app/
├── app.py                          # Serveur Flask (Backend)
├── best_model_smote.pkl            # Modèle ML entraîné
├── scaler_smote.pkl                # Scaler pour normalisation
├── requirements.txt                # Dépendances Python
├── templates/
│   └── index.html                  # Interface utilisateur
└── static/
    ├── css/
    │   └── style.css               # Styles CSS
    └── js/
        └── script.js               # JavaScript
```

---

##  Installation et Lancement

### 1. Prérequis

- Python 3.8 ou supérieur
- pip (gestionnaire de packages Python)

### 2. Installation des dépendances

```bash
pip install -r requirements.txt
```

### 3. Placer les fichiers du modèle

Assurez-vous que ces fichiers sont dans le dossier principal :
- `best_model_smote.pkl`
- `scaler_smote.pkl`

### 4. Lancer l'application

```bash
python app.py
```

### 5. Accéder à l'application

Ouvrez votre navigateur et allez à : **http://localhost:5000**

---

##  Utilisation

1. **Remplir le formulaire** avec les 8 caractéristiques du patient
2. **Cliquer sur "Analyser"**
3. **Consulter le résultat** et les probabilités

### Caractéristiques requises :

- **Pregnancies:** Nombre de grossesses
- **Glucose:** Concentration de glucose (mg/dL)
- **BloodPressure:** Pression artérielle diastolique (mm Hg)
- **SkinThickness:** Épaisseur du pli cutané (mm)
- **Insulin:** Insuline sérique (µU/mL)
- **BMI:** Indice de Masse Corporelle (kg/m²)
- **DiabetesPedigreeFunction:** Fonction héréditaire du diabète
- **Age:** Âge en années

---
##  API Endpoints

### `POST /predict`
Fait une prédiction pour un patient.

**Request Body (JSON):**
```json
{
  "pregnancies": 6,
  "glucose": 148,
  "bloodPressure": 72,
  "skinThickness": 35,
  "insulin": 125,
  "bmi": 33.6,
  "diabetesPedigreeFunction": 0.627,
  "age": 50
}
```

**Response (JSON):**
```json
{
  "prediction": 1,
  "prediction_text": "Diabétique",
  "probability_non_diabetic": 0.15,
  "probability_diabetic": 0.85,
  "confidence": 85.0
}
```

### `GET /health`
Vérifie si l'application fonctionne.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true
}
```

### `GET /stats`
Retourne les statistiques du modèle.

---

##  Fonctionnalités

-  Interface utilisateur moderne et responsive
-  Validation en temps réel des champs
-  Animation des résultats
-  Affichage des probabilités
-  Messages d'avertissement médicaux
-  Raccourcis clavier (Ctrl+Enter pour soumettre)
-  Design mobile-friendly

---

##  Avertissement Important

Cette application est un **outil d'aide à la décision** basé sur l'intelligence artificielle. 

**Elle ne remplace PAS un diagnostic médical professionnel.**

Consultez toujours un médecin qualifié pour un diagnostic et un traitement appropriés.

---

##  Technologies Utilisées

### Backend
- **Flask** - Framework web Python
- **Scikit-learn** - Machine Learning
- **Joblib** - Sauvegarde/chargement du modèle
- **Pandas & Numpy** - Traitement des données

### Frontend
- **HTML5** - Structure
- **CSS3** - Design et animations
- **JavaScript (Vanilla)** - Interactivité

---

##  Améliorations Futures

- [ ] Authentification utilisateur
- [ ] Base de données pour stocker l'historique
- [ ] Export des résultats en PDF
- [ ] API REST complète avec documentation
- [ ] Dashboard pour visualiser les statistiques
- [ ] Support multilingue
- [ ] Tests unitaires

---

##  Dépannage

### Erreur: "Modèle non chargé"
- Vérifiez que `best_model_smote.pkl` et `scaler_smote.pkl` sont dans le bon dossier
- Vérifiez les permissions de lecture des fichiers

### Port 5000 déjà utilisé
Modifiez le port dans `app.py` :
```python
app.run(debug=True, host='0.0.0.0', port=8000)
```

### Erreur d'importation
Réinstallez les dépendances :
```bash
pip install -r requirements.txt --upgrade
```

