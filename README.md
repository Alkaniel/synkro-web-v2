# Synkro — Client web

Interface web de l'application Synkro, une application de gestion de projet développée dans le cadre d'un test technique.

## Présentation

Synkro permet à des utilisateurs authentifiés de créer et gérer des projets, d'y ajouter des tâches, de suivre leur avancement via un système de statuts, et de collaborer en invitant des participants qui peuvent se voir assigner des tâches.

Ce dépôt contient uniquement le client web. L'API backend est disponible dans un dépôt séparé.

## Stack technique

- **React 19** + **TypeScript**
- **Vite** : bundler et serveur de développement
- **Tailwind CSS v4** : styles
- **shadcn/ui** : composants UI (Dialog, Select, Input…)
- **React Router v7** : routing côté client
- **Sonner** : notifications toast
- **Geist** : police d'écriture

## Prérequis

- Node.js >= 18
- **L'API backend Synkro doit impérativement tourner avant de lancer le client.** Sans elle, l'application ne fonctionnera pas, 
- aucune page ne sera accessible après la connexion. Voir le README du dépôt backend pour l'installer et la démarrer.

## Installation

```bash
git clone https://github.com/ton-compte/synkro-web.git
cd synkro-web
npm install
```

## Configuration

Crée un fichier `.env` à la racine du projet :

```env
VITE_API_URL=http://localhost:8080/api
```

Adapte l'URL si ton backend tourne sur un port différent.

## Lancer le projet

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

## Build de production

```bash
npm run build
```

Les fichiers générés se trouvent dans le dossier `dist/`.

## Structure du projet

```
src/
├── api/          # Fonctions d'appel à l'API (un fichier par ressource)
├── components/   # Composants partagés (layout, UI)
├── context/      # Contexte React (AuthContext)
├── features/     # Fonctionnalités découpées par domaine
│   ├── auth/
│   ├── projects/
│   ├── tasks/
│   ├── profile/
│   └── admin/
├── hooks/        # Hooks personnalisés (useApi, useApiMutation)
├── routes.tsx    # Définition des routes
└── types/        # Types TypeScript partagés (réponses API)
```

## Fonctionnalités

- Authentification (connexion / inscription) avec JWT
- Gestion des projets (création, modification, suppression)
- Gestion des tâches par projet avec suivi des statuts (À faire / En cours / Terminé)
- Filtre des tâches par statut
- Gestion des participants (invitation par email, rôles EDITOR / VIEWER)
- Affectation des tâches aux participants
- Transfert de propriété d'un projet
- Espace admin pour la gestion des utilisateurs (réservé aux admins)
