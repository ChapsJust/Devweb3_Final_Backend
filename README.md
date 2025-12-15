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

## Jeu de données

Dans le fichier src/dev
Contient deux documents json.
La BD se nomme : Holding_DB

## Utilisateur pour la connexion

{
"name": "Camille Fournier",
"age": 29,
"email": "camille.fournier@email.com",
"password": "Camille456",
"isActive": true,
"roles": ["user", "analyst"],
"createdAt": { "$date": "2024-08-30T08:00:00Z" }
}

## Auteur

Justin

## Licence

Ce projet est réalisé dans le cadre du cours de Développement Web 3.
