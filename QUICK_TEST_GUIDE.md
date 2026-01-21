# 🧪 Guide de test rapide

## ⚡ Test en 5 minutes

### Prérequis
- ✅ Variables d'environnement configurées (`.env.local`)
- ✅ Migration SQL appliquée dans Supabase

### Démarrer l'app
```bash
npm run dev
```

---

## Test 1: Vérifier la redirection vers login ✅

**But:** Vérifier que cliquer sur "Edit" sans être connecté redirige vers le login

**Étapes:**
1. Allez à `http://localhost:5173/`
2. Cliquez sur le bouton "Edit"
3. ✅ Vous devriez être redirigé vers `/login`

---

## Test 2: Créer un compte ✅

**But:** Créer un nouveau compte utilisateur

**Étapes:**
1. Sur la page login, cliquez sur **"S'inscrire"**
2. Entrez un email valide: `test@example.com`
3. Entrez un mot de passe: `Test123!@#`
4. Cliquez sur **"S'inscrire"**
5. ✅ Vous devriez voir un message de succès
6. ✅ Vous devriez être redirigé vers l'accueil

---

## Test 3: Vérifier que l'Edit fonctionne maintenant ✅

**But:** Vérifier que le mode Edit fonctionne quand connecté

**Étapes:**
1. Vous êtes toujours connecté (après Test 2)
2. Cliquez sur le bouton "Edit"
3. ✅ Le bouton devrait devenir orange et afficher "Edit: ON"
4. ✅ Vous devriez pouvoir cocher/décocher les cartes

---

## Test 4: Accéder au profil ✅

**But:** Vérifier que la page de profil fonctionne

**Étapes:**
1. Cliquez sur l'icône utilisateur (en haut à droite)
2. ✅ Vous devriez voir votre profil
3. ✅ L'email devrait être votre email (lecture seule)
4. Les champs "Nom Complet" et "Bio" devraient être vides

---

## Test 5: Éditer le profil ✅

**But:** Modifier ses informations de profil

**Étapes:**
1. Sur la page profil, cliquez sur **"Modifier"**
2. Entrez un nom: `Jean Dupont`
3. Entrez une bio: `Collectionneur de cartes Ronflex`
4. Cliquez sur **"Sauvegarder"**
5. ✅ Les données devraient être sauvegardées
6. ✅ Un message de succès devrait s'afficher

---

## Test 6: Vérifier la persistance des données ✅

**But:** Vérifier que les données persistent

**Étapes:**
1. Rafraîchissez la page (F5)
2. Naviguez vers `/profile`
3. ✅ Votre nom et bio devraient toujours être là

---

## Test 7: Se déconnecter ✅

**But:** Tester la déconnexion

**Étapes:**
1. Sur la page profil, cliquez sur **"Déconnexion"**
2. ✅ Vous devriez être redirigé vers le login
3. ✅ L'icône utilisateur devrait disparaître de la page d'accueil

---

## Test 8: Se reconnecter ✅

**But:** Vérifier la connexion avec les identifiants créés

**Étapes:**
1. Sur le login, cliquez sur **"Se connecter"**
2. Entrez votre email: `test@example.com`
3. Entrez votre mot de passe: `Test123!@#`
4. Cliquez sur **"Se connecter"**
5. ✅ Vous devriez être redirigé vers l'accueil
6. ✅ L'icône utilisateur devrait réapparaître

---

## Test 9: Vérifier que les données ont persisté ✅

**But:** Vérifier que votre profil est toujours là après déconnexion/reconnexion

**Étapes:**
1. Cliquez sur l'icône utilisateur
2. ✅ Votre nom et bio devraient toujours être là

---

## Test 10: Tester les messages d'erreur ✅

**But:** Vérifier la gestion des erreurs

**Étapes:**
1. Déconnectez-vous
2. Essayez de vous connecter avec le mauvais mot de passe
3. ✅ Un message d'erreur devrait s'afficher
4. Essayez de vous connecter avec un email inexistant
5. ✅ Un message d'erreur devrait s'afficher

---

## ✅ Tous les tests passent?

Excellent! Votre système d'authentification fonctionne correctement!

---

## 🐛 Dépannage

### Problème: "Page login n'apparaît pas"
- Vérifiez que BrowserRouter est dans main.tsx
- Vérifiez que les routes sont définies dans App.tsx

### Problème: "Erreur d'authentification"
- Vérifiez vos variables d'environnement (.env.local)
- Vérifiez que l'authentification par Email est activée dans Supabase

### Problème: "Erreur RLS"
- Vérifiez que la migration SQL a été appliquée
- Vérifiez que les policies RLS sont correctes

### Problème: "Données ne persistent pas"
- Vérifiez que la table profiles existe dans Supabase
- Vérifiez que vous êtes connecté quand vous modifiez le profil

---

## 📊 Checklist de test

- [ ] Redirection vers login sans authentification
- [ ] Création de compte réussie
- [ ] Mode Edit fonctionne quand connecté
- [ ] Accès au profil
- [ ] Édition du profil
- [ ] Persistance des données
- [ ] Déconnexion fonctionne
- [ ] Reconnexion avec anciens identifiants
- [ ] Messages d'erreur affichés correctement

---

**Bon testage!** 🚀
