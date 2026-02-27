// ===== CONFIGURATION =====
const API_URL = '/predict';

// ===== ÉLÉMENTS DOM =====
const form = document.getElementById('predictionForm');
const resultSection = document.getElementById('resultSection');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultCard = document.getElementById('resultCard');
const resultIcon = document.getElementById('resultIcon');
const resultTitle = document.getElementById('resultTitle');
const resultConfidence = document.getElementById('resultConfidence');
const probaNonDiabetic = document.getElementById('probaNonDiabetic');
const probaDiabetic = document.getElementById('probaDiabetic');
const barNonDiabetic = document.getElementById('barNonDiabetic');
const barDiabetic = document.getElementById('barDiabetic');

// ===== EVENT LISTENERS =====
form.addEventListener('submit', handleSubmit);

// ===== FONCTIONS PRINCIPALES =====

/**
 * Gère la soumission du formulaire
 */
async function handleSubmit(e) {
    e.preventDefault();
    
    // Afficher le loading
    showLoading();
    
    // Récupérer les données du formulaire
    const formData = getFormData();
    
    try {
        // Faire la requête API
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la requête');
        }
        
        const result = await response.json();
        
        // Cacher le loading
        hideLoading();
        
        // Afficher les résultats
        displayResults(result);
        
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

/**
 * Récupère les données du formulaire
 */
function getFormData() {
    return {
        pregnancies: document.getElementById('pregnancies').value,
        glucose: document.getElementById('glucose').value,
        bloodPressure: document.getElementById('bloodPressure').value,
        skinThickness: document.getElementById('skinThickness').value,
        insulin: document.getElementById('insulin').value,
        bmi: document.getElementById('bmi').value,
        diabetesPedigreeFunction: document.getElementById('diabetesPedigreeFunction').value,
        age: document.getElementById('age').value
    };
}

/**
 * Affiche les résultats de la prédiction
 */
function displayResults(result) {
    // Afficher la section résultat
    resultSection.style.display = 'block';
    
    // Scroll vers les résultats
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Mettre à jour l'icône et le titre
    if (result.prediction === 1) {
        // Diabétique
        resultIcon.innerHTML = '🔴';
        resultTitle.innerHTML = '<span style="color: #e74c3c;">Patient Diabétique</span>';
        resultCard.style.borderColor = '#e74c3c';
    } else {
        // Non diabétique
        resultIcon.innerHTML = '🟢';
        resultTitle.innerHTML = '<span style="color: #2ecc71;">Patient Non Diabétique</span>';
        resultCard.style.borderColor = '#2ecc71';
    }
    
    // Afficher la confiance
    resultConfidence.textContent = `Confiance: ${result.confidence.toFixed(1)}%`;
    
    // Mettre à jour les probabilités
    const probaNonDiabeticValue = (result.probability_non_diabetic * 100).toFixed(1);
    const probaDiabeticValue = (result.probability_diabetic * 100).toFixed(1);
    
    probaNonDiabetic.textContent = probaNonDiabeticValue + '%';
    probaDiabetic.textContent = probaDiabeticValue + '%';
    
    // Animer les barres de progression
    setTimeout(() => {
        barNonDiabetic.style.width = probaNonDiabeticValue + '%';
        barDiabetic.style.width = probaDiabeticValue + '%';
    }, 100);
    
    // Ajouter animation
    resultCard.classList.add('fade-in');
}

/**
 * Affiche le loading overlay
 */
function showLoading() {
    loadingOverlay.style.display = 'flex';
}

/**
 * Cache le loading overlay
 */
function hideLoading() {
    loadingOverlay.style.display = 'none';
}

/**
 * Affiche un message d'erreur
 */
function showError(message) {
    alert(' Erreur: ' + message);
    console.error('Error:', message);
}

// ===== VALIDATION ET UX =====

/**
 * Validation en temps réel des champs
 */
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input[type="number"]');
    
    inputs.forEach(input => {
        // Highlight au focus
        input.addEventListener('focus', function() {
            this.style.borderColor = '#667eea';
        });
        
        // Reset au blur
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#ecf0f1';
            }
        });
        
        // Validation à la saisie
        input.addEventListener('input', function() {
            const value = parseFloat(this.value);
            const min = parseFloat(this.min);
            const max = parseFloat(this.max);
            
            if (value < min || value > max || isNaN(value)) {
                this.style.borderColor = '#f39c12';
            } else {
                this.style.borderColor = '#2ecc71';
            }
        });
    });
    
    // Reset du formulaire
    form.addEventListener('reset', function() {
        resultSection.style.display = 'none';
        
        inputs.forEach(input => {
            input.style.borderColor = '#ecf0f1';
        });
    });
});

// ===== RACCOURCIS CLAVIER =====
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter pour soumettre
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        form.dispatchEvent(new Event('submit'));
    }
    
    // Escape pour reset
    if (e.key === 'Escape') {
        form.reset();
    }
});

// ===== EXEMPLES DE PATIENTS =====

/**
 * Charge des exemples de patients prédéfinis
 */
function loadExample(type) {
    const examples = {
        diabetic: {
            pregnancies: 6,
            glucose: 148,
            bloodPressure: 72,
            skinThickness: 35,
            insulin: 125,
            bmi: 33.6,
            diabetesPedigreeFunction: 0.627,
            age: 50
        },
        nonDiabetic: {
            pregnancies: 1,
            glucose: 85,
            bloodPressure: 66,
            skinThickness: 29,
            insulin: 85,
            bmi: 26.6,
            diabetesPedigreeFunction: 0.351,
            age: 31
        }
    };
    
    const data = examples[type];
    if (data) {
        Object.keys(data).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = data[key];
            }
        });
    }
}

// Exporter pour utilisation externe
window.diabetesApp = {
    loadExample
};

console.log(' Application de prédiction du diabète chargée avec succès!');
console.log(' Astuce: Utilisez Ctrl+Enter pour soumettre rapidement');
console.log(' Astuce: Utilisez Escape pour réinitialiser le formulaire');