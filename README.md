# Insight 221 — site statique prêt pour Netlify

Ce projet contient la version déployable du site : **20 articles uniques**, classés en cinq rubriques, avec une image principale par article, les illustrations intégrées aux textes, un moteur de recherche côté navigateur, un formulaire de newsletter Netlify, un flux RSS, un `robots.txt`, un `sitemap.xml`, des balises Open Graph et des données structurées JSON-LD pour les pages d’articles.

Deux doublons trouvés dans le document de départ n’ont été publiés qu’une fois chacun :
- *Du bitume aux bancs d’école : comment les routes rurales changent l’avenir des enfants sénégalais*
- *Du berceau au bureau : la faille invisible qui freine le marché du travail sénégalais*

## Déploiement Netlify

### Option recommandée : dépôt Git

1. Décompresser le dossier puis le placer dans un dépôt GitHub, GitLab ou Bitbucket.
2. Dans Netlify, choisir **Add new project** puis importer le dépôt.
3. Laisser Netlify lire `netlify.toml` :
   - dossier publié : `dist`
   - commande de build : aucune
4. Déployer.

### Option rapide : Netlify Drop

1. Décompresser le projet.
2. Ouvrir le dossier `dist`.
3. Déposer son contenu ou ce dossier sur Netlify Drop.

## Connexion de `insight221.com`

1. Dans Netlify : **Domain management → Add domain**, puis saisir `insight221.com`.
2. Chez le registraire du domaine :
   - pour le sous-domaine `www`, créer un CNAME vers le sous-domaine Netlify affiché dans le tableau de bord ;
   - pour le domaine racine, utiliser de préférence un enregistrement ALIAS, ANAME ou CNAME aplati vers `apex-loadbalancer.netlify.com` lorsque le prestataire DNS le permet ;
   - ou déléguer le DNS à Netlify et recopier les serveurs de noms fournis.
3. Attendre la validation DNS dans Netlify, puis vérifier que la redirection `www` → domaine racine fonctionne.

## À compléter avant mise en production publique

La page `/mentions-legales/` contient une zone clairement signalée à compléter avec l’identité légale de l’éditeur, une adresse de contact et les informations administratives pertinentes. Elles n’ont pas été fournies dans le contenu de départ.

## Structure

- `dist/` : site prêt à être publié
- `dist/articles/` : pages d’articles individuelles et canoniques
- `dist/rubriques/` : pages par rubrique
- `dist/assets/images/` : images extraites du document source
- `dist/sitemap.xml` et `dist/robots.txt` : fichiers de découverte pour les moteurs
- `dist/feed.xml` : flux RSS
- `dist/_headers` : entêtes de sécurité et cache
- `netlify.toml` : configuration Netlify
- `scripts/validate_site.py` : vérifications structurelles locales
