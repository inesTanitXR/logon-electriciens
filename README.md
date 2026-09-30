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
- `supabase/functions/notify-devis` — (optionnel) e-mail au magasin à chaque nouveau devis

## Fonctionnement

- **Approbation.** Un électricien crée son compte et sa fiche, puis attend l'approbation de Log-ON (par téléphone ou en magasin). Tant qu'il n'est pas approuvé, il n'apparaît pas aux clients et ne peut pas se mettre disponible. L'admin approuve depuis Compte → Administration → Électriciens.
- **Devis.** L'électricien écrit sur papier la liste du matériel ; le client la photographie dans l'app (onglet Log-ON ou bas de la liste) et l'envoie à Log-ON, sans compte, avec son numéro WhatsApp. L'électricien peut aussi l'envoyer pour son client (onglet Activité). Log-ON voit les demandes dans Administration → Devis, répond par WhatsApp en un geste et met à jour le statut (reçu → prix envoyé → confirmé → prêt / livré). Le client suit le statut dans « Mes devis ».
- **Promotion.** Administration → Promotion : titre et texte FR/AR, image, date de fin. Affichée sur l'écran d'accueil et dans l'onglet Log-ON.
- Le numéro WhatsApp du magasin utilisé par le bouton « Contacter Log-ON » est dans `docs/app.js` (`STORE_INFO.wa`).

## Activer le vrai backend (une fois)

1. Créer un projet sur https://supabase.com (gratuit).
2. SQL Editor → coller `supabase/schema.sql` → Run.
3. Authentication → Providers → Email : désactiver « Confirm email ». Authentication → Settings : activer « Allow anonymous sign-ins ».
4. Project Settings → API : copier `Project URL` et `anon public` key dans `docs/config.js`.
5. Storage : le script crée les buckets `photos` (public) et `devis` (privé).
6. Créer son compte dans l'app, puis dans SQL Editor : `insert into public.admins(user_id) select id from auth.users where email='216XXXXXXXX@phone.logon.tn';` (son propre numéro) → l'onglet Administration apparaît dans Compte.

7. (Optionnel) E-mail à chaque nouveau devis : déployer `supabase/functions/notify-devis` (voir le commentaire en tête du fichier) et créer un Database Webhook sur `public.devis` (INSERT) vers cette fonction.

Si le projet Supabase existait déjà avec l'ancienne version : relancer `schema.sql`, il migre `verified` → `status` (les vérifiés deviennent approuvés).

Connexion = numéro de téléphone + code PIN à 6 chiffres. La vérification par SMS s'ajoute plus tard en branchant un fournisseur SMS dans Supabase.
