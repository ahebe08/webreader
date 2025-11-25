# WebReader

WebReader est une application permettant la gestion, la consultation et la lecture de livres numériques.  
L’architecture repose sur un frontend React, un backend Node.js/Express, une base PostgreSQL et Docker pour l’orchestration.

---

## 1. Présentation

WebReader permet aux utilisateurs de :
- créer un compte et se connecter,
- consulter un catalogue de livres,
- afficher les détails d’un livre,
- lire des fichiers PDF directement depuis le navigateur.

Le projet est conçu pour être maintenable, extensible et facilement déployable.

---

## 2. Fonctionnalités principales

### Frontend
- React moderne et responsive
- Authentification (inscription, connexion)
- Liste et détails des livres
- Lecture PDF intégrée
- Gestion de l’état via Context API

### Backend
- API REST en Express
- Authentification JWT
- Gestion des utilisateurs et des livres
- Uploads sécurisés (PDF et images)
- Validation des données
- Middleware de sécurité

### Base de données
- PostgreSQL
- Scripts d’initialisation et seeds
- Volumes persistants via Docker

### Infrastructure
- Docker + docker-compose
- Réseau interne pour communication conteneur
- Conteneurs frontend, backend et base de données

---

## 3. Structure du projet

```

webreader/
├── frontend/
├── backend/
├── database/
├── uploads/
│   ├── .gitkeep
│   ├── covers/.gitkeep
│   └── pdfs/.gitkeep
├── docker-compose.yml
├── .env
├── .gitignore
└── README.md

```

> Les dossiers `uploads/` sont versionnés vides grâce à `.gitkeep`.

---

## 4. Prérequis

- Docker Desktop
- Git
- (Optionnel) Node.js pour un lancement hors Docker

---

## 5. Installation et démarrage

### 1) Cloner le projet

```

git clone [https://github.com/ahebe08/webreader.git](https://github.com/ahebe08/webreader.git)
cd webreader

```

### 2) Créer les fichiers `.env`

Fichiers requis :
- `/.env`
- `/frontend/.env`
- `/backend/.env`

Exemple minimal backend :

```

PORT=5000
JWT_SECRET=changeme
DATABASE_URL=postgres://postgres:postgres@db:5432/webreader

```

### 3) Lancer les conteneurs

```

docker-compose up --build

```

### 4) Accès aux services

- Frontend : http://localhost:5173  
- Backend API : http://localhost:5000  
- PostgreSQL : port 5432  

---

## 6. Commandes utiles

```

docker-compose down
docker-compose logs backend
docker-compose logs frontend
docker-compose build --no-cache
docker exec -it webreader-backend sh

```

---

## 7. Sécurité

- Les fichiers `.env` ne sont jamais versionnés.
- Les secrets JWT doivent être changés en production.
- Les uploads utilisateurs ne sont pas versionnés.
- Les dossiers `uploads/` sont commités vides uniquement via `.gitkeep`.

---

## 8. Technologies utilisées

### Frontend
- React, React Router, Context API
- Fetch API / Axios
- pdf.js ou react-pdf

### Backend
- Node.js, Express
- JWT, Multer
- PostgreSQL (pg)
- Joi / Validator

### DevOps
- Docker, docker-compose

---