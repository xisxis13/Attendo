# Attendo

![Vue.js](https://img.shields.io/badge/Vue.js-35495E?logo=vuedotjs&logoColor=4FC08D)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-FFD859?logo=pinia&logoColor=black)
![Vue Router](https://img.shields.io/badge/Vue_Router-35495E?logo=vuedotjs&logoColor=4FC08D)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?logo=supabase&logoColor=white)

Attendo est un outil de prise de présence pensé pour suivre les étudiants pendant les sessions d'évaluation de l'ESI (HE2B). Il associe chaque étudiant à ses unités d'enseignement (UE), à une session, à une épreuve et à un local, afin de centraliser la gestion des présences au même endroit.

Le projet a été réalisé dans le cadre du cours *4WEB3 (Développement Web 3)*, durant l'année académique 2024-2025. Il est développé avec Vue.js, et Supabase s'occupe de la base de données et de l'authentification.

## Fonctionnalités

- Connexion avec un compte Google (OAuth via Supabase)
- Page d'accueil affichant l'utilisateur connecté et son état de connexion
- Création et consultation des sessions d'examens
- Gestion des unités d'enseignement (UE), rattachées aux sessions
- Gestion des examens, plusieurs par UE possibles
- Attribution des locaux aux examens
- Prise de présence : chaque étudiant se marque présent ou absent directement dans l'interface
- Fil d'Ariane pour se repérer d'une vue à l'autre

## Stack technique

| Outil | Rôle |
| --- | --- |
| Vue 3 | Framework principal |
| Pinia | Gestion de l'état |
| Vue Router | Navigation entre les vues |
| Tailwind CSS | Mise en forme |
| Supabase | Base de données, API et authentification |

## Installation

Il faut avoir [Node.js](https://nodejs.org/) installé ainsi qu'un compte [Supabase](https://supabase.com/).
**Attention** : si vous n'avez pas de compte Google HE2B, il vous sera impossible de vous connectez à l'application et donc de la tester en profondeur.

**1. Cloner le dépôt**

```bash
git clone https://github.com/votre-pseudo/nom-du-depot.git
cd nom-du-depot
```

**2. Installer les dépendances**

```bash
npm install
```

**3. Configurer Supabase**

- Créer un nouveau projet sur Supabase
- Importer le schéma SQL et les fichiers CSV fournis dans la base de données
- Activer l'authentification Google dans les paramètres du projet

**4. Renseigner les variables d'environnement**

Créer un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon
```

**5. Lancer l'application**

```bash
npm run dev
```

L'application est ensuite accessible sur l'adresse affichée dans le terminal (par défaut `http://localhost:5173`).

## Auteur

Alexis Ravasco, étudiant en dernière année de bachelier en développement d'applications, HELHa Mons.
