# Log-ON Électriciens

Un électricien disponible, près de chez vous — Nabeul et Cap Bon. Site web, app Android et app iOS partagent le même code et la même base de données.

**Site :** https://inestanitxr.github.io/logon-electriciens/ (Arabe : `?lang=ar`)

## Structure

- `docs/` — l'app (GitHub Pages sert ce dossier ; c'est aussi le dossier web pour Capacitor)
  - `index.html`, `style.css`, `app.js` — interface
  - `i18n.js` — tous les textes FR / AR
  - `store.js` — couche données : mode démo (localStorage) ou Supabase
  - `config.js` — URL + clé anon Supabase (vide = mode démo)
  - `data.js` — profils fictifs du mode démo
  - `sw.js`, `manifest.webmanifest`, icônes — PWA installable
- `supabase/schema.sql` — tables, sécurité (RLS), stockage photos, temps réel

## Activer le vrai backend (une fois)

1. Créer un projet sur https://supabase.com (gratuit).
2. SQL Editor → coller `supabase/schema.sql` → Run.
3. Authentication → Providers → Email : désactiver « Confirm email ». Authentication → Settings : activer « Allow anonymous sign-ins ».
4. Project Settings → API : copier `Project URL` et `anon public` key dans `docs/config.js`.
5. Créer son compte dans l'app, puis dans SQL Editor : `insert into public.admins(user_id) select id from auth.users where email='216XXXXXXXX@phone.logon.tn';` (son propre numéro) → l'onglet Administration apparaît dans Compte.

Connexion = numéro de téléphone + code PIN à 6 chiffres. La vérification par SMS s'ajoute plus tard en branchant un fournisseur SMS dans Supabase.
