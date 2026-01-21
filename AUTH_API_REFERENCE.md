# Référence rapide - API d'authentification

## Hook `useAuth()`

Dans vos composants, vous pouvez utiliser le hook `useAuth()`:

```tsx
import { useAuth } from '../contexts/AuthContext';

function MonComposant() {
  const { user, isAuthenticated, loading, signIn, signUp, signOut } = useAuth();
  
  return (
    <div>
      {loading && <p>Chargement...</p>}
      {isAuthenticated && <p>Bienvenue {user?.email}</p>}
      {!isAuthenticated && <p>Veuillez vous connecter</p>}
    </div>
  );
}
```

## Propriétés disponibles

### `user`
- Type: `User | null`
- Description: L'utilisateur actuel
- Propriétés: `id` (UUID), `email` (string)

```tsx
if (user) {
  console.log(user.id);    // UUID
  console.log(user.email); // email@example.com
}
```

### `isAuthenticated`
- Type: `boolean`
- Description: True si l'utilisateur est connecté

```tsx
if (isAuthenticated) {
  // Afficher le mode édition
}
```

### `loading`
- Type: `boolean`
- Description: True pendant le chargement de l'état d'authentification

```tsx
if (loading) {
  return <div>Chargement...</div>;
}
```

## Méthodes disponibles

### `signUp(email, password)`
Créer un nouveau compte

```tsx
try {
  await signUp('user@example.com', 'password123');
  console.log('Inscription réussie');
} catch (error) {
  console.error('Erreur:', error.message);
}
```

### `signIn(email, password)`
Connecter un utilisateur existant

```tsx
try {
  await signIn('user@example.com', 'password123');
  console.log('Connexion réussie');
} catch (error) {
  console.error('Erreur:', error.message);
}
```

### `signOut()`
Déconnecter l'utilisateur actuel

```tsx
try {
  await signOut();
  console.log('Déconnecté');
} catch (error) {
  console.error('Erreur:', error.message);
}
```

## Exemples d'utilisation

### Exemple 1: Vérifier l'authentification avant d'éditer

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function EditButton() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Activer le mode édition
  };

  return <button onClick={handleClick}>Éditer</button>;
}
```

### Exemple 2: Afficher des infos utilisateur

```tsx
import { useAuth } from '../contexts/AuthContext';

function UserGreeting() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Chargement...</div>;
  
  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return <div>Bienvenue {user?.email}</div>;
}
```

### Exemple 3: Afficher le bouton de déconnexion

```tsx
import { useAuth } from '../contexts/AuthContext';

function LogoutButton() {
  const { isAuthenticated, signOut } = useAuth();

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirection automatique par le contexte
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  return <button onClick={handleLogout}>Déconnexion</button>;
}
```

## Gestion des erreurs

Les erreurs sont retournées par Supabase. Exemples courants:

```tsx
try {
  await signIn('user@example.com', 'wrongpassword');
} catch (error) {
  if (error.message.includes('Invalid login credentials')) {
    console.error('Email ou mot de passe incorrect');
  }
}
```

## Notes importantes

- ✅ Le hook doit être utilisé dans un composant enfant de `AuthProvider`
- ✅ Les changements d'authentification sont automatiquement synchronisés
- ✅ Les sessions persistent automatiquement dans le navigateur
- ⚠️ Tous les appels async peuvent lever des erreurs

---

Pour plus d'informations, consultez `IMPLEMENTATION_GUIDE.md`
