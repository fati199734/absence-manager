# Frontend Web – Gestion des Absences

## Présentation
Ce dossier contient l'application web du projet de gestion des absences, développée avec **React.js** (JavaScript) et du CSS simple.

## Installation
1. Ouvrir un terminal dans le dossier `/web`
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Lancer l'application en mode développement :
   ```bash
   npm start
   ```

## Structure du projet
- `src/components/` : Composants réutilisables (boutons, formulaires, etc.)
- `src/pages/` : Pages principales (login, dashboard, etc.)
- `src/styles/` : Fichiers CSS
- `src/App.js` : Configuration des routes
- `src/api/` : (à créer) Fonctions pour communiquer avec l'API backend

## Connexion à l'API backend
- L'URL de l'API Django doit être configurée dans un fichier `.env` ou dans le code (`http://localhost:8000/` par défaut).
- L'authentification se fait par token JWT (voir README backend).

## Dépendances principales
- React
- react-router-dom (navigation)
- axios (requêtes HTTP)

## Conseils
- Adapter le design selon les maquettes fournies.
- Documenter chaque composant/page si besoin.

---

**Pour toute question, voir le README global ou contacter l'équipe projet.**
