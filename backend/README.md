# Backend – Gestion des Absences

## Présentation
Ce backend est une API REST développée avec **Django** et **Django REST Framework** pour la gestion des absences dans un établissement d’enseignement. Il permet de gérer : départements, filières, groupes, étudiants, enseignants, modules, séances, absences, rapports, statistiques, et exports (Excel/PDF).

## Fonctionnalités principales
- CRUD complet sur tous les modèles (Département, Filière, Groupe, Étudiant, etc.)
- Authentification sécurisée par JWT
- Permissions : seuls les admins peuvent modifier, les autres peuvent lire
- Statistiques avancées (taux d’absentéisme, top absents, etc.)
- Export Excel et PDF personnalisés
- Documentation interactive (Swagger/Redoc)

## Prérequis
- Python 3.10+
- pip
- PostgreSQL (base de données cloud ou locale)

## Installation
1. **Cloner le projet**
   ```bash
   git clone <url-du-repo>
   cd backend
   ```
2. **Créer un environnement virtuel**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   # ou
   source venv/bin/activate  # Linux/Mac
   ```
3. **Installer les dépendances**
   ```bash
   pip install -r requirements.txt
   ```
4. **Configurer la base de données**
   - Modifier `backend/config/settings.py` avec vos identifiants PostgreSQL :
     ```python
     DATABASES = {
         'default': {
             'ENGINE': 'django.db.backends.postgresql',
             'NAME': '<nom_bdd>',
             'USER': '<user>',
             'PASSWORD': '<mdp>',
             'HOST': '<host>',
             'PORT': '5432',
         }
     }
     ```

## Lancer le serveur
1. **Appliquer les migrations**
   ```bash
   python manage.py migrate
   ```
2. **Créer un superutilisateur**
   ```bash
   python manage.py createsuperuser
   ```
3. **Démarrer le serveur**
   ```bash
   python manage.py runserver
   ```

## Structure du projet
- `attendance/` : App principale (modèles, vues, serializers, migrations)
- `config/` : Configuration Django
- `templates/`, `static/` : (si besoin)
- `venv/` : Environnement virtuel (à ne pas versionner)

## Utilisation de l’API
- **Documentation interactive** : [http://localhost:8000/swagger/](http://localhost:8000/swagger/) ou `/redoc/`
- **Authentification** : JWT (obtenir un token via `/api/token/`)
- **Endpoints principaux** :
  - `/api/departements/`, `/api/filieres/`, `/api/groupes/`, `/api/etudiants/`, etc. (CRUD)
  - `/api/presences/stats/` : Statistiques globales
  - `/api/presences/stats_par_filiere/` : Stats par filière
  - `/api/presences/stats_avancees/` : Stats avancées (filtres : filière, groupe, période)
  - `/api/generer_rapport_excel/` : Export Excel
  - `/api/generer_rapport_pdf/` : Export PDF (filtres possibles)

### Exemple d’authentification JWT
1. **Obtenir un token**
   - POST sur `/api/token/` avec :
     ```json
     { "username": "<admin>", "password": "<mdp>" }
     ```
   - Récupérer le champ `access` et l’utiliser dans l’en-tête :
     ```
     Authorization: Bearer <token>
     ```

### Tester l’API
- **Swagger** : [http://localhost:8000/swagger/](http://localhost:8000/swagger/)
- **Redoc** : [http://localhost:8000/redoc/](http://localhost:8000/redoc/)
- **Postman** : Importer les endpoints, ajouter le token JWT dans les headers

## Comptes de test
- **Superutilisateur** : créé via `createsuperuser` (voir section plus haut)
- **Autres comptes** : à créer via l’admin Django (`/admin/`)

## Annexes
- **Dépendances principales** :
  - Django, djangorestframework, djangorestframework-simplejwt, drf-yasg, pandas, openpyxl, reportlab
- **Fichiers utiles** :
  - `requirements.txt` : liste des dépendances
  - `attendance/views.py` : endpoints principaux
  - `attendance/models.py` : modèles de données
- **Liens utiles** :
  - [Django](https://docs.djangoproject.com/)
  - [DRF](https://www.django-rest-framework.org/)
  - [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/)
  - [drf-yasg](https://drf-yasg.readthedocs.io/)

## Exemples de requêtes API

### Authentification JWT
```bash
curl -X POST http://localhost:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "votre_mot_de_passe"}'
```
Réponse :
```json
{
  "refresh": "...",
  "access": "..."
}
```

### Exemple de requête GET protégée (liste des étudiants)
```bash
curl -X GET http://localhost:8000/api/etudiants/ \
  -H "Authorization: Bearer <votre_token_access>"
```

### Exemple de création (POST) d’un étudiant
```bash
curl -X POST http://localhost:8000/api/etudiants/ \
  -H "Authorization: Bearer <votre_token_access>" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Doe",
    "prenom": "John",
    "code_apogee": "123456",
    "email": "john.doe@example.com",
    "filiere": 1,
    "groupe": 1
  }'
```

### Export Excel
```bash
curl -X GET http://localhost:8000/api/generer_rapport_excel/ \
  -H "Authorization: Bearer <votre_token_access>" --output rapport.xlsx
```

### Export PDF filtré
```bash
curl -X GET "http://localhost:8000/api/generer_rapport_pdf/?filiere=1&date_debut=2024-01-01&date_fin=2024-06-30" \
  -H "Authorization: Bearer <votre_token_access>" --output rapport.pdf
```

### Statistiques avancées
```bash
curl -X GET "http://localhost:8000/api/presences/stats_avancees/?filiere=1&groupe=2" \
  -H "Authorization: Bearer <votre_token_access>"
```

## FAQ (Questions fréquentes)

**1. J’ai une erreur 401 Unauthorized !**
- Vérifiez que vous avez bien ajouté le header `Authorization: Bearer <token>`.
- Le token JWT expire : récupérez-en un nouveau si besoin.

**2. J’ai une erreur 404 Not Found sur un endpoint !**
- Vérifiez l’URL (voir la doc Swagger ou la section Endpoints ci-dessus).
- L’objet demandé existe-t-il ?

**3. Comment créer un superutilisateur ?**
- `python manage.py createsuperuser` puis suivez les instructions.

**4. Comment filtrer les exports ou les stats ?**
- Ajoutez les paramètres dans l’URL, par exemple : `/api/generer_rapport_pdf/?filiere=1&date_debut=2024-01-01&date_fin=2024-06-30`

**5. Comment voir la documentation interactive ?**
- Swagger : [http://localhost:8000/swagger/](http://localhost:8000/swagger/)
- Redoc : [http://localhost:8000/redoc/](http://localhost:8000/redoc/)

**6. Où trouver la liste des utilisateurs ?**
- Via `/api/etudiants/`, `/api/enseignants/`, ou l’admin Django `/admin/`.

**7. Problème d’installation d’une dépendance (ex: reportlab, psycopg2) ?**
- Assurez-vous d’avoir Python 3.10+ et pip à jour.
- Sous Windows, privilégiez l’installation via `pip install -r requirements.txt` dans un venv.

**8. Comment réinitialiser la base de données ?**
- Supprimez le fichier SQLite (si utilisé) ou videz la base PostgreSQL, puis relancez `python manage.py migrate`.

---

**Pour toute question ou bug, voir la documentation ou contacter le développeur principal.** 