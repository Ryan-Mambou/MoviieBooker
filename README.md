# MoviieBooker

Une application web moderne pour parcourir des films et effectuer des réservations.

## Aperçu

MoviieBooker est une application web full-stack qui permet aux utilisateurs de parcourir des films populaires, de rechercher des titres spécifiques, de consulter des informations détaillées sur chaque film et d'effectuer des réservations. L'application est construite avec un frontend React et un backend Node.js/Express, offrant une expérience utilisateur fluide et réactive.

## Fonctionnalités

- **Navigation de Films**: Parcourez une collection de films populaires avec pagination
- **Fonction de Recherche**: Recherchez des films par titre
- **Détails des Films**: Consultez des informations complètes sur chaque film, y compris le synopsis, les évaluations et la date de sortie
- **Authentification Utilisateur**: Inscrivez-vous et connectez-vous pour accéder aux fonctionnalités protégées
- **Système de Réservation**: Réservez des films avec un processus simple
- **Design Responsive**: Interface utilisateur entièrement responsive qui fonctionne sur ordinateur et appareils mobiles

## Stack Technologique

### Frontend

- React.js
- TypeScript
- React Router pour la navigation
- Axios pour les requêtes API
- Tailwind CSS pour le style

### Backend

- Node.js avec Express
- JWT pour l'authentification
- Architecture API RESTful

## Structure du Projet

```
MoviieBooker/
├── frontend/
│   ├── src/
│   │   ├── components/       # Composants UI réutilisables
│   │   ├── pages/            # Composants de pages
│   │   ├── services/         # Fonctions de service API
│   │   ├── types/            # Définitions de types TypeScript
│   │   ├── App.tsx           # Composant principal de l'application
│   │   └── index.tsx         # Point d'entrée de l'application
│   ├── package.json          # Dépendances frontend
│   └── vite.config.js        # Configuration Vite
│
├── backend/                   # Code côté serveur
│   ├── routes/               # Définitions des routes API
│   ├── controllers/          # Logique métier
│   ├── models/               # Modèles de données
│   ├── middleware/           # Middleware Express
│   ├── server.js             # Point d'entrée du serveur
│   └── package.json          # Dépendances backend
│
└── README.md                 # Documentation du projet
```

## Composants Clés

### Pages Frontend

- **Accueil**: Affiche une grille de cartes de films avec recherche et pagination
- **Connexion/Inscription**: Écrans d'authentification utilisateur
- **Détails du Film**: Vue détaillée d'un film sélectionné avec option de réservation

### Services API

L'application interagit avec une API backend qui fournit:

- Données de films (récupérées d'une base de données de films)
- Authentification utilisateur
- Gestion des réservations

## Authentification

L'application utilise JWT (JSON Web Tokens) pour l'authentification:

1. L'utilisateur s'inscrit ou se connecte
2. Le backend valide les identifiants et émet un token
3. Le token est stocké dans localStorage
4. Les requêtes API incluent le token dans l'en-tête Authorization
5. Les routes protégées vérifient le token avant de traiter les requêtes

## Gestion des Erreurs

L'application implémente une gestion complète des erreurs:

- Validation des formulaires pour les entrées utilisateur
- Réponses d'erreur API avec des messages significatifs
- Détection d'accès non autorisé avec invitations à se connecter
- Solutions de repli élégantes pour les problèmes de réseau

## Démarrage

### Prérequis

- Node.js (v14 ou ultérieur)
- npm ou yarn

### Installation

1. Clonez le dépôt:

   ```
   git clone https://github.com/your-username/MoviieBooker.git
   cd MoviieBooker
   ```

2. Installez les dépendances frontend:

   ```
   cd frontend
   npm install
   ```

3. Installez les dépendances backend:
   ```
   cd ../backend
   npm install
   ```

### Lancement de l'Application

1. Démarrez le serveur backend:

   ```
   cd backend
   npm run dev
   ```

2. Démarrez le serveur de développement frontend:

   ```
   cd frontend
   npm run dev
   ```

3. Ouvrez votre navigateur et accédez à `http://localhost:5173`

## Variables d'Environnement

Créez des fichiers `.env` dans les répertoires frontend et backend avec les variables suivantes:

### Frontend (.env)

```
VITE_API_URL=https://moviiebooker-qqi3.onrender.com
```

### Backend (.env)

```
PORT=3000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL=your_database_connection_string
```

## Déploiement

L'application est déployée à:

- Frontend: [Application MoviieBooker](https://movie-app-project-efrei.netlify.app/)
- API Backend: https://moviiebooker-qqi3.onrender.com

## Sources

Pour ce projet, les ressources suivantes ont été utilisées comme références:

### Documentation

- **Swagger**: [Integrating Swagger with NestJS: A Step-by-Step Guide](https://rehmat-sayany.medium.com/integrating-swagger-with-nestjs-a-step-by-step-guide-abd532743c43)
- **NestJS HttpService**: [Using Axios directly](https://docs.nestjs.com/techniques/http-module#using-axios-directly) and https://docs.nestjs.com/techniques/http-module
- **NestJS Controllers & Query Params**: [NestJS Controllers Documentation](https://docs.nestjs.com/controllers)

### Projets de référence

- **Authentification**: [OTP-Verification](https://github.com/Ryan-Mambou/OTP-Verification/tree/main/src) - Implémentation de référence pour l'authentification
