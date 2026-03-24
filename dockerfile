# Utilise une version stable de Python
FROM python:3.11-slim

# Définit le dossier de travail
WORKDIR /app

# Copie les fichiers de dépendances
COPY requirements.txt .

# Installe les bibliothèques
RUN pip install --no-cache-dir -r requirements.txt

# Copie tout le reste du code
COPY . .

# Hugging Face utilise par défaut le port 7860
ENV FLASK_RUN_PORT=7860

# Commande pour lancer l'app avec Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:7860", "app:app"]