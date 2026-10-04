# Nadel Challenge

Site avec une API PHP/MySQL prévue pour un hébergement cPanel. Les visiteurs peuvent créer un compte ou se connecter. Les mots de passe sont hachés par PHP et les sessions utilisent des cookies HTTP-only. Les préférences restent locales au navigateur. Les publications et fiches d’organisation soumises avec l’API sont partagées après validation par un modérateur.

## Mise en ligne sur cPanel

1. Dans **cPanel → MySQL Databases**, créez une base et un utilisateur, puis accordez à cet utilisateur tous les privilèges sur la base. Notez le nom complet cPanel, souvent préfixé par le nom du compte.
2. Dans **phpMyAdmin**, choisissez la base, puis importez `api/schema.sql`. Si vous aviez déjà créé les anciennes tables avec la première version de l’API, importez plutôt `api/migration-accounts.sql` pour conserver les contenus existants.
3. Copiez le contenu du projet dans le dossier document root du domaine (souvent `public_html`). Gardez le dossier `api` à côté de `index.html`.
4. Dans le gestionnaire de fichiers cPanel, copiez `api/config.example.php` vers `api/config.php`. Renseignez le DSN, le nom d’utilisateur et le mot de passe MySQL. Ne publiez jamais `config.php` dans un dépôt public. Le fichier `api/.htaccess` interdit son accès HTTP.
5. Activez le certificat SSL du domaine dans cPanel. Le fichier `.htaccess` à la racine redirige le site vers HTTPS et active HSTS ; l’API refuse aussi les requêtes non sécurisées. L’API est appelée sur le même domaine à `/api/index.php`.

L’hébergement doit proposer PHP 8.1+ avec PDO MySQL et `mbstring` (sélection de version dans **cPanel → MultiPHP Manager**). Si le site est installé dans un sous-dossier plutôt qu’à la racine du domaine, adaptez `apiUrl` dans `app.js` au chemin `/votre-dossier/api/index.php`.

## Modération

Les nouvelles publications et fiches organisation arrivent avec le statut `pending`. Seuls les contenus `approved` sont renvoyés aux visiteurs. Après vérification dans phpMyAdmin, un modérateur peut approuver un élément en exécutant par exemple :

```sql
UPDATE community_posts SET status = 'approved' WHERE id = 1;
UPDATE organizations SET status = 'approved' WHERE id = 1;
```

Consulter les signalements reçus avec :

```sql
SELECT * FROM community_flags WHERE status = 'open' ORDER BY created_at DESC;
```

La création de compte ne comprend pas encore de confirmation d’adresse courriel ni de récupération de mot de passe. Une identité saisie dans une fiche n’est donc pas une preuve d’appartenance à l’organisation. Les signalements ne sont pas transmis automatiquement à une mairie ou un service d’urgence. Configurez une adresse de contact pour la modération, une politique de conservation des données et une protection anti-abus avant d’ouvrir largement les inscriptions publiques.

## Mode sans serveur

Si l’API n’est pas configurée ou joignable, l’interface reste utilisable en mode aperçu local. Les données locales ne sont pas partagées. Une fois l’API en service, les visiteurs voient les publications et organisations approuvées depuis MySQL.
