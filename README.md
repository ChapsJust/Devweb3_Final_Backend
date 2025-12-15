# StockTrader API - Backend

API REST pour l'application de simulation de trading d'actions StockTrader.

## Fonctionnalités

- **Authentification** : Inscription, connexion et gestion des tokens JWT
- **Gestion des utilisateurs** : CRUD complet des utilisateurs
- **Gestion des stocks** : Liste, achat et vente d'actions
- **Portefeuille** : Gestion du portefeuille utilisateur
- **Documentation API** : Interface Swagger interactive

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/ChapsJust/Devweb3_Final_Backend.git
cd backend/
```

### 2. Configuration

```bash
npm install
cp .env.example .env
```

## Lancement

### Mode développement

```bash
npm run dev
```

### Mode production

```bash
npm run build
npm start
```

## Tests

```bash
npm run test
```

## Endpoints API

### Authentification

| Méthode | Endpoint              | Description |
| ------- | --------------------- | ----------- |
| POST    | `/api/users/register` | Inscription |
| POST    | `/api/users/login`    | Connexion   |

### Utilisateurs

| Méthode | Endpoint         | Description              |
| ------- | ---------------- | ------------------------ |
| GET     | `/api/users`     | Liste des utilisateurs   |
| GET     | `/api/users/:id` | Détails d'un utilisateur |
| PUT     | `/api/users/:id` | Modifier un utilisateur  |
| DELETE  | `/api/users/:id` | Supprimer un utilisateur |

### Stocks

| Méthode | Endpoint           | Description          |
| ------- | ------------------ | -------------------- |
| GET     | `/api/stocks`      | Liste des actions    |
| GET     | `/api/stocks/:id`  | Détails d'une action |
| POST    | `/api/stocks/buy`  | Acheter une action   |
| POST    | `/api/stocks/sell` | Vendre une action    |

### Jetons

| Méthode | Endpoint              | Description         |
| ------- | --------------------- | ------------------- |
| POST    | `/api/jetons/refresh` | Rafraîchir le token |

## Scripts disponibles

| Script          | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Lancer en mode développement |
| `npm run build` | Compiler le projet           |
| `npm start`     | Lancer en mode production    |
| `npm run test`  | Exécuter les tests           |
| `npm run lint`  | Vérifier le code avec ESLint |

## Auteur

Justin

## Licence

Ce projet est réalisé dans le cadre du cours de Développement Web 3.
