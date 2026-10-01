# Nadel Challenge

Première maquette web d'une plateforme de concours d'innovation en équipe. Le site présente le défi, son calendrier, les étapes de participation, quelques équipes inscrites et un appel à inscription. Cette version est statique : les inscriptions, le classement et les données affichées sont des exemples à relier à une API.

## Lancer le site

Ouvrir `index.html` dans un navigateur. Aucun outil de compilation n'est nécessaire.

## Organisation proposée pour l'équipe

Utilisez un seul dépôt GitHub et découpez le produit en dossiers afin de pouvoir avancer en parallèle :

- **Front-end (personne 1)** : conserver la maquette dans `frontend/`, puis intégrer les pages d'inscription, tableau de bord équipe et classement via l'API.
- **Back-end (personne 2)** : créer `backend/`, choisir ensemble la technologie, puis développer les comptes, équipes, dépôts de projets, évaluations du jury et endpoints documentés.
- **Coordination / intégration (personne 3 ou responsable)** : tenir le backlog, vérifier les maquettes et API, gérer les issues et relire les pull requests.

Pour conserver cette première maquette à la racine, l'équipe peut créer les dossiers après validation du design, ou déplacer les trois fichiers web dans `frontend/` dans une PR dédiée.

## Démarrer sur GitHub

1. Créez une issue par fonctionnalité : « API équipes », « inscription », « dépôt d'un projet », « classement », « tableau de bord du jury ».
2. Ajoutez les membres comme collaborateurs dans **Settings ? Collaborators**.
3. Chacun travaille sur une branche courte (`feat/api-equipes`, `feat/inscription`) et ouvre une pull request vers `main`.
4. Demandez une revue par un autre membre et gardez `main` pour le code intégré.
5. D'accordez le contrat API avant l'intégration : chemins, exemples JSON, erreurs et authentification. Le front peut utiliser des données fictives en attendant.

## Première découpe API à convenir

- `GET /api/teams` : lister les équipes.
- `POST /api/teams` : créer une équipe.
- `GET /api/projects` : lister les projets soumis.
- `POST /api/projects` : créer ou mettre à jour une soumission.
- `GET /api/leaderboard` : lire les résultats publiés.

Ces routes sont des propositions de départ, pas encore implémentées. Il reste à choisir l'hébergement, la base de données, l'authentification et les règles de notation avec l'équipe.

## Prochaine étape

Validez le nom, les dates et les règles du concours, puis créez les issues GitHub avant de répartir le travail. Les dates et équipes de la maquette sont fictives.
