# WebReader - Application de Lecture de Livres en Ligne

WebReader est une plateforme web complète permettant de lire des livres en ligne de manière sécurisée avec un lecteur PDF intégré, une gestion des utilisateurs et un catalogue de livres.

## Table des Matières
- [Description du Projet](#description-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Architecture Technique](#architecture-technique)
- [Installation et Démarrage](#installation-et-démarrage)
- [Documentation API](#documentation-api)
- [Structure du Projet](#structure-du-projet)
- [Développement](#développement)

## Description du Projet

WebReader est une application full-stack moderne qui offre une expérience de lecture numérique complète. Les utilisateurs peuvent s'inscrire, parcourir une bibliothèque de livres, consulter les détails des ouvrages et lire des PDF directement dans le navigateur avec suivi de progression.

## Fonctionnalités

### Gestion des Utilisateurs
- **Inscription** : Création de compte avec email et mot de passe
- **Connexion** : Authentification sécurisée avec JWT
- **Profil utilisateur** : Interface personnalisée pour chaque membre
- **Sessions persistantes** : Reconnexion automatique

### Catalogue de Livres
- **Liste complète** : Affichage grid/table de tous les livres disponibles
- **Fiche livre détaillée** : Vignette de couverture, titre, auteur, année, genre, description
- **Système de recherche** : Filtrage par titre, auteur ou genre
- **Métadonnées complètes** : Éditeur, ISBN, nombre de pages, langue

### Lecteur PDF Intégré
- **Visualisation en ligne** : Lecteur PDF natif intégré
- **Navigation fluide** : Interface de lecture optimisée
- **Sécurité renforcée** : Protection contre le téléchargement

## Architecture Technique

### Frontend (React)
- **Framework** : React 18 avec Hooks
- **Routing** : React Router DOM
- **Gestion d'état** : Context API
- **Styling** : CSS Modules avec variables CSS
- **Build** : Vite
- **Port** : 5173

### Backend (Node.js + Express)
- **Runtime** : Node.js 18
- **Framework** : Express.js
- **Authentification** : JWT
- **Base de données** : PostgreSQL avec Sequelize ORM
- **Uploads** : Multer avec validation (pas implémenté)
- **Sécurité** : Helmet, CORS, rate limiting
- **Port** : 5000

### Base de Données (PostgreSQL)
- **SGBD** : PostgreSQL 15
- **ORM** : Sequelize
- **Tables** : Users, Books, ReadingSessions
- **Port** : 5432

### Conteneurisation
- **Orchestration** : Docker Compose
- **Services** : Frontend, Backend, Database
- **Réseau** : Réseau interne Docker
- **Volumes** : Données persistantes PostgreSQL

## Installation et Démarrage

### Prérequis
- Docker Desktop
- Git
- 2GB RAM minimum

### Démarrage Rapide

1. **Cloner le projet**
```bash
git clone https://github.com/ahebe08/webreader.git
cd webreader
```

2. **Configurer les variables d'environnement**

Créer le fichier `.env` à la racine :
```env
# Database
DB_NAME=webreader_db
DB_USER=webreader
DB_PASSWORD=webreader_password
DB_HOST=db
DB_PORT=5432

# JWT
JWT_SECRET=votre_secret_jwt_super_securise

# App
NODE_ENV=development
PORT=5000
```

3. **Lancer l'application**
```bash
docker-compose up --build
```

4. **Accéder à l'application**
- Frontend : http://localhost:5173
- Backend API : http://localhost:5000
- Base de données : localhost:5432

### Commandes Utiles

```bash
# Arrêter les conteneurs
docker-compose down

# Voir les logs
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend

# Redémarrer un service
docker-compose restart frontend

# Reconstruire complètement
docker-compose down -v
docker-compose up --build --force-recreate

# Accéder à la base de données
docker-compose exec database psql -U webreader -d webreader_db
```

## Documentation API

### Statut des APIs

#### API FONCTIONNELLES - TESTÉES ET VALIDÉES

**AUTHENTIFICATION**
- POST /api/auth/register - Testé avec Postman et frontend
- POST /api/auth/login - Testé avec frontend
- GET /api/auth/profile - Testé avec frontend

**LIVRES**
- GET /api/books - Testé avec frontend
- GET /api/books/:id - Testé avec frontend
- GET /api/books/:id/pdf - Testé avec Postman et frontend
- GET /api/books/genres - Testé avec Postman

**UTILITAIRES**
- GET /api/health - Testé avec navigateur
- GET /uploads/covers/:filename - Testé avec Postman
- GET /uploads/pdfs/:filename - Testé avec Postman

### Détails des Endpoints

#### Authentification

##### POST `/api/auth/register`
**Description** : Inscription d'un nouvel utilisateur
```json
{
  "email": "utilisateur@example.com",
  "password": "MotDePasse123",
  "confirmPassword": "MotDePasse123"
}
```
**Réponse** :
```json
{
  "success": true,
  "message": "Utilisateur inscrit avec succès",
  "data": {
    "utilisateur": {
      "id": 1,
      "email": "utilisateur@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

##### POST `/api/auth/login`
**Description** : Connexion utilisateur
```json
{
  "email": "utilisateur@example.com",
  "password": "MotDePasse123"
}
```
**Réponse** : Similaire à `/register`

##### GET `/api/auth/profile` (Protégé)
**Description** : Récupérer le profil utilisateur
**Headers** : `Authorization: Bearer <token>`

#### Livres

##### GET `/api/books`
**Description** : Liste paginée des livres
**Query Params** :
- `page` : Numéro de page (défaut: 1)
- `limit` : Éléments par page (défaut: 12)
- `search` : Recherche texte
- `genre` : Filtre par genre

**Réponse** :
```json
{
  "success": true,
  "message": "Livres récupérés avec succès",
  "data": {
    "livres": [
      {
        "id": 1,
        "title": "Le Petit Prince",
        "author": "Antoine de Saint-Exupéry",
        "year": 1943,
        "description": "Conte poétique et philosophique...",
        "genre": "Classique",
        "publisher": "Gallimard",
        "page_count": 96,
        "cover_image": "le-petit-prince.jpg",
        "language": "fr",
        "sessionLecture": {
          "last_page": 25,
          "progress": 26.04
        }
      }
    ],
    "pagination": {
      "page": 1,
      "pagesTotales": 1,
      "totalLivres": 3,
      "aSuivant": false,
      "aPrecedent": false
    }
  }
}
```

##### GET `/api/books/:id`
**Description** : Détails d'un livre spécifique

##### GET `/api/books/:id/pdf` (Protégé Optionnel)
**Description** : Stream du fichier PDF

##### GET `/api/books/genres`
**Description** : Liste des genres disponibles

#### Utilitaires

##### GET `/api/health`
**Description** : Statut de l'API
```json
{
  "success": true,
  "status": "OK",
  "message": "API WebReader fonctionne correctement!",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environnement": "development"
}
```

**Protégé = Route nécessitant un token JWT**

## Structure du Projet

```
webreader/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookDetailModal.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Index.js
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── BooksPage.jsx
│   │   │   ├── index.js
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ReaderPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   ├── contexts/
│   │   │   └── AuthContext.js
│   │   ├── styles/
│   │   │   └── base.css
│   │   │   └── components.css
│   │   │   └── index.css
│   │   │   └── pages.css
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── Dockerfile
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── bookController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Book.js
│   │   │   ├── associations.js
│   │   │   └── ReadingSession.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── books.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── config/
│   │   │   ├── sequelize.js
│   │   │   └── upload.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   └── password.js
│   │   └── app.js
│   ├── package.json
│   ├── server.js
│   └── Dockerfile
├── database/
│   ├── init/
│   │   └── 01-init.sql
│   └── seeds/
│       └── 02-sample-data.sql
│       └── 03-add-covers.sql
├── uploads/
│   ├── covers/
│   └── pdfs/
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md
```

## Développement

### Structure de la Base de Données

#### Table `users`
```sql
id | email | password_hash | created_at | last_login | is_active
```

#### Table `books`
```sql
id | title | author | year | description | genre | publisher | isbn 
page_count | cover_image | pdf_path | file_size | language | created_at | updated_at
```

#### Table `reading_sessions`
```sql
id | user_id | book_id | last_page | progress | updated_at
```

### Variables CSS (Design System)

```css
:root {
  --primary-color: #4f46e5;
  --secondary-color: #7c3aed;
  --text-primary: #1f2937;
  --text-secondary: #4b5563;
  --background-default: #ffffff;
  --background-light: #f9fafb;
  --border-color: #e5e7eb;
}
```

### Sécurité

- **Mots de passe** : Hashage bcrypt
- **Sessions** : JWT avec expiration 7 jours
- **Uploads** : Validation des types MIME et tailles
- **CORS** : Configuration restrictive

### Tests Manuels

```bash
# Test santé API
curl http://localhost:5000/api/health

# Test liste livres
curl http://localhost:5000/api/books

# Test authentification
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123","confirmPassword":"Test123"}'
```

## Licence

Ce projet est développé dans un cadre d'une évaluation technique.

## Auteur

Développé avec le 🤍 par Ahébé Christ Koffi - [GitHub](https://github.com/ahebe08)

---

WebReader - Votre bibliothèque numérique moderne et sécurisée