# ✅ Checklist de configuration

Utilisez cette checklist pour vous assurer que tout est correctement configuré.

---

## Phase 1: Configuration de l'environnement

### 1.1 Variables d'environnement
- [ ] Fichier `.env.local` créé dans la racine du projet
- [ ] `VITE_SUPABASE_URL` rempli
- [ ] `VITE_SUPABASE_ANON_KEY` rempli
- [ ] Fichier `.env.local` n'est PAS committé (dans `.gitignore`)

**Tester:**
```bash
npm run dev
# Allez à http://localhost:5173/
# Ouvrez la console (F12)
# import.meta.env.VITE_SUPABASE_URL devrait être défini
```

### 1.2 Package.json
- [ ] `react-router-dom` est installé
- [ ] Pas d'erreurs dans `npm install`

**Tester:**
```bash
npm list react-router-dom
```

---

## Phase 2: Configuration Supabase

### 2.1 Authentification par Email
- [ ] Aller sur https://console.supabase.com
- [ ] Sélectionner le projet
- [ ] Authentication → Providers
- [ ] **Email** est activé (toggle vert)

### 2.2 URL Configuration
- [ ] Authentication → URL Configuration
- [ ] Ajouter `http://localhost:5173/` (développement)
- [ ] Ajouter `http://localhost:5173/login` (développement)
- [ ] Ajouter `http://localhost:5173/profile` (développement)
- [ ] Ajouter URL de production si applicable

### 2.3 API Keys
- [ ] Settings → API
- [ ] `Project URL` visible
- [ ] `Project API Keys` visible
- [ ] Clés copiées dans `.env.local`

---

## Phase 3: Migration SQL

### 3.1 Appliquer la migration
- [ ] Aller dans Supabase SQL Editor
- [ ] Créer une nouvelle query
- [ ] Copier le contenu de `supabase/migrations/20260121_create_profiles_table.sql`
- [ ] Exécuter la query
- [ ] Pas d'erreur SQL

### 3.2 Vérifier la table profiles
- [ ] Database → Tables
- [ ] Table `profiles` existe
- [ ] Colonnes visibles:
  - [ ] `id`
  - [ ] `email`
  - [ ] `full_name`
  - [ ] `bio`
  - [ ] `avatar_url`
  - [ ] `total_cards`
  - [ ] `created_at`
  - [ ] `updated_at`

### 3.3 Vérifier la sécurité RLS
- [ ] Table `profiles` avec icône 🔐 (RLS activé)
- [ ] Policies visibles:
  - [ ] "Users can view their own profile" (SELECT)
  - [ ] "Users can update their own profile" (UPDATE)
  - [ ] "Users can insert their own profile" (INSERT)

---

## Phase 4: Code et routes

### 4.1 Fichiers créés
- [ ] `src/contexts/AuthContext.tsx` existe
- [ ] `src/pages/Login.tsx` existe
- [ ] `src/pages/Profile.tsx` existe
- [ ] `src/components/ProtectedRoute.tsx` existe

### 4.2 Fichiers modifiés
- [ ] `src/main.tsx` importe BrowserRouter
- [ ] `src/main.tsx` importe AuthProvider
- [ ] `src/App.tsx` importe Routes et Route
- [ ] `src/App.tsx` utilise useAuth()

### 4.3 Vérifier les imports
- [ ] `npm run build` réussit sans erreur
- [ ] Pas d'avertissement TypeScript

**Tester:**
```bash
npm run build
# Devrait terminer avec ✓ built in X.XXs
```

---

## Phase 5: Tests fonctionnels

### 5.1 Navigation
- [ ] `http://localhost:5173/` charge l'accueil
- [ ] `http://localhost:5173/login` charge la page login
- [ ] `http://localhost:5173/profile` charge la page profil

### 5.2 Flux de connexion
- [ ] Clic sur "Edit" → redirection vers `/login` (non connecté)
- [ ] Remplir email/mot de passe → clic "S'inscrire"
- [ ] Message de succès affiché
- [ ] Redirection vers l'accueil
- [ ] Clic "Edit" → mode édition activé (connecté)

### 5.3 Profil utilisateur
- [ ] Clic sur icône utilisateur (User) → page profil chargée
- [ ] Email affiché en lecture seule
- [ ] Champs "Nom" et "Bio" présents
- [ ] Clic "Modifier" → champs deviennent éditables
- [ ] Remplir un nom et une bio
- [ ] Clic "Sauvegarder" → message de succès
- [ ] Actualiser la page → données persistées

### 5.4 Déconnexion
- [ ] Sur la page profil, clic "Déconnexion"
- [ ] Redirection vers le login
- [ ] Clic "Edit" redirige à nouveau vers login

### 5.5 Reconnexion
- [ ] Rentrer les identifiants corrects
- [ ] Clic "Se connecter"
- [ ] Redirection vers l'accueil
- [ ] Profil contient toujours les données précédentes

### 5.6 Gestion des erreurs
- [ ] Mot de passe incorrect → message d'erreur
- [ ] Email inexistant → message d'erreur
- [ ] Champs vides → pas d'envoi du formulaire

---

## Phase 6: Performance et sécurité

### 6.1 Sécurité
- [ ] Pas de `console.log()` affichant des données sensibles
- [ ] `.env.local` dans `.gitignore`
- [ ] Tokens JWT pas exposés en frontend
- [ ] Pas d'erreurs sensibles affichées à l'utilisateur

### 6.2 Performance
- [ ] Page se charge rapidement (< 2s)
- [ ] Pas d'appels API multiples
- [ ] localStorage utilisé pour la session

---

## Phase 7: Documentation

### 7.1 Fichiers de documentation
- [ ] `NEXT_STEPS.md` créé
- [ ] `IMPLEMENTATION_GUIDE.md` créé
- [ ] `AUTHENTICATION_SETUP.md` créé
- [ ] `AUTH_API_REFERENCE.md` créé
- [ ] `QUICK_TEST_GUIDE.md` créé
- [ ] `PROJECT_STRUCTURE.md` créé
- [ ] `README_FR.md` créé
- [ ] `COMPLETION_SUMMARY.md` créé

---

## ✅ Tout est prêt!

Si tous les points sont cochés ✅, votre application est prête pour:

1. ✅ Les utilisateurs de créer des comptes
2. ✅ Les utilisateurs de se connecter
3. ✅ Les utilisateurs d'éditer leur profil
4. ✅ La protection du mode édition par authentification
5. ✅ Le stockage sécurisé des données

---

## 🐛 Dépannage rapide

| Problème | Checklist |
|----------|-----------|
| Routes ne fonctionnent pas | ✅ BrowserRouter dans main.tsx? |
| Auth échoue | ✅ Variables d'env correctes? |
| RLS error | ✅ Migration SQL appliquée? |
| Profile vide | ✅ Authentification par Email activée? |
| Logout ne fonctionne pas | ✅ signOut() appelé? |

---

## 📞 Besoin d'aide?

1. Consultez le document correspondant:
   - Navigation? → Consultez `PROJECT_STRUCTURE.md`
   - Auth? → Consultez `AUTHENTICATION_SETUP.md`
   - API? → Consultez `AUTH_API_REFERENCE.md`

2. Relancez `npm run dev` et cherchez les erreurs dans la console

3. Vérifiez Supabase:
   - Database → Votre table existe?
   - Authentication → Email activé?
   - Logs → Des erreurs d'API?

---

**Une fois tous les points cochés, vous êtes prêt!** 🚀
