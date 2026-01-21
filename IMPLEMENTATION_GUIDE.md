# Guide complet - Authentification et Profil utilisateur

## Vue d'ensemble

J'ai implémenté un système complet d'authentification pour votre application Ronflex Tableau avec:

### ✅ Fonctionnalités ajoutées

1. **Système d'authentification Supabase**
   - Inscription et connexion par email/mot de passe
   - Gestion des sessions utilisateur
   - Contexte d'authentification React

2. **Page de Login**
   - Bascule entre Connexion / Inscription
   - Gestion des erreurs
   - Redirection automatique

3. **Page de Profil**
   - Affichage du profil utilisateur
   - Édition du nom et bio
   - Statistiques (date de création, nombre de cartes)
   - Bouton de déconnexion

4. **Vérification d'authentification pour l'édition**
   - En cliquant sur "Edit", si vous n'êtes pas connecté → redirection vers le login
   - Si connecté → mode édition activé
   - Bouton de profil dans la barre de navigation

5. **Nouvelle table de base de données**
   - Table `profiles` pour stocker les informations utilisateur
   - Row Level Security (RLS) pour la sécurité
   - Suppression en cascade des profils quand un utilisateur est supprimé

---

## Fichiers créés/modifiés

### Fichiers créés:
```
src/
  contexts/
    AuthContext.tsx              # Contexte d'authentification
  pages/
    Login.tsx                    # Page de connexion/inscription
    Profile.tsx                  # Page de profil utilisateur
  components/
    ProtectedRoute.tsx           # Route protégée (optionnel)

supabase/migrations/
  20260121_create_profiles_table.sql  # Migration SQL

Documentation:
  SETUP_MIGRATIONS.md            # Instructions pour les migrations
  AUTHENTICATION_SETUP.md        # Configuration de l'authentification
  IMPLEMENTATION_GUIDE.md        # Ce fichier
```

### Fichiers modifiés:
```
src/
  main.tsx                       # Ajout de BrowserRouter et AuthProvider
  App.tsx                        # Routes, vérification auth pour Edit
```

### Packages installés:
- `react-router-dom` - Pour la navigation entre les pages

---

## Configuration requise

### 1. Variables d'environnement (.env.local)

Créez un fichier `.env.local` à la racine du projet:

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anonyme
```

### 2. Activation de l'authentification Supabase

Dans [console.supabase.com](https://console.supabase.com):

1. Allez à **Authentication** → **Providers**
2. Assurez-vous que **Email** est activé
3. Configurez les **URL Configuration**:
   - Local: `http://localhost:5173/`
   - Production: `https://votre-domaine.com/`

### 3. Appliquer la migration de la table profiles

**Option A: Via Supabase Dashboard (Simple)**
1. Ouvrez [console.supabase.com](https://console.supabase.com)
2. Allez à **SQL Editor** → **New Query**
3. Copiez le contenu de `supabase/migrations/20260121_create_profiles_table.sql`
4. Collez et exécutez

**Option B: Via CLI**
```bash
supabase login
supabase db push
```

### 4. Vérifier le setup

Après la migration, vérifiez dans Supabase:
- La table `profiles` existe dans **Database** → **Tables**
- RLS est activé (icône 🔐 à côté du nom de la table)

---

## Comment ça marche

### Flux d'authentification

```
Utilisateur clique sur "Edit"
    ↓
Vérification: isAuthenticated?
    ├─ OUI → Mode édition activé
    └─ NON → Redirection vers /login
```

### Flux de connexion

```
Page Login
    ↓
L'utilisateur choisit: "Se connecter" ou "S'inscrire"
    ↓
Email + Mot de passe valide?
    ├─ OUI → Redirection vers /
    └─ NON → Message d'erreur affiché
```

### Flux de profil

```
Clic sur icône utilisateur (User)
    ↓
Page /profile
    ├─ Email (lecture seule)
    ├─ Nom complet (éditable)
    ├─ Bio (éditable)
    ├─ Stats (date création, total cartes)
    └─ Bouton Déconnexion
```

---

## Utilisation

### Pour les utilisateurs:

1. **Première visite:**
   - Cliquez sur "Edit" ou naviguez vers `/login`
   - Cliquez sur "S'inscrire"
   - Remplissez email et mot de passe
   - Compte créé!

2. **Connexion:**
   - Remplissez email et mot de passe
   - Cliquez sur "Se connecter"

3. **Mode Édition:**
   - Cliquez sur "Edit"
   - Vous pouvez maintenant:
     - Cocher/décocher les cartes possédées
     - Ajouter/modifier les images
     - Modifier les cartes

4. **Profil:**
   - Cliquez sur l'icône utilisateur (User)
   - Modifiez vos informations
   - Déconnectez-vous quand vous le souhaitez

---

## Architecture de sécurité

### Row Level Security (RLS)

La table `profiles` utilise RLS pour garantir que:
- Chaque utilisateur ne peut voir que son propre profil
- Chaque utilisateur ne peut modifier que ses propres données
- Les données supprimées en cascade si un utilisateur supprime son compte

### Tokens d'authentification

- Les tokens Supabase sont gérés automatiquement
- Les sessions persistent dans le navigateur
- Déconnexion claire les sessions

---

## Points importants

⚠️ **À noter:**
- Les utilisateurs doivent créer un compte pour éditer
- Les données de profil sont stockées séparemment des cartes
- Les statistiques de cartes peuvent être synchronisées via un trigger (optionnel)

💡 **Amélioration future (optionnel):**
- Ajouter une photo de profil
- Créer des collections publiques/privées
- Ajouter un système de favoris
- Synchroniser le compteur de cartes automatiquement

---

## Dépannage

### "Module not found: react-router-dom"
```bash
npm install react-router-dom
```

### La page de login n'apparaît pas
- Vérifiez que `BrowserRouter` est dans `main.tsx`
- Vérifiez que les routes sont définies dans `App.tsx`

### "VITE_SUPABASE_URL is undefined"
- Créez un fichier `.env.local`
- Ajoutez vos variables Supabase

### "Row level policy violation"
- Vérifiez que les RLS policies sont correctes
- Vérifiez que l'utilisateur est connecté quand il accède à son profil

---

## Tests recommandés

```bash
# Démarrer l'application
npm run dev

# Créer un compte
# 1. Naviguez à http://localhost:5173/
# 2. Cliquez sur Edit
# 3. Cliquez sur "S'inscrire"
# 4. Remplissez le formulaire

# Tester l'édition
# 1. Ajoutez/modifiez des cartes
# 2. Naviguez vers votre profil
# 3. Modifiez vos informations

# Tester la déconnexion
# 1. Cliquez sur votre profil
# 2. Cliquez sur "Déconnexion"
# 3. Essayez de cliquer sur Edit → devrait rediriger vers login
```

---

Vous avez maintenant un système d'authentification complet! 🎉
