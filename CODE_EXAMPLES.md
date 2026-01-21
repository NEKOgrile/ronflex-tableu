# 💻 Exemples de code - Utilisation pratique

## Exemple 1: Utiliser le hook useAuth() dans un composant

```tsx
import { useAuth } from '../contexts/AuthContext';

function MonComposant() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <div>Veuillez vous connecter</div>;
  }

  return (
    <div>
      <h1>Bienvenue {user?.email}!</h1>
      <p>Vous êtes connecté.</p>
    </div>
  );
}

export default MonComposant;
```

---

## Exemple 2: Bouton de déconnexion

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const { isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return null; // Caché si non connecté
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="btn btn-danger">
      Se déconnecter
    </button>
  );
}

export default LogoutButton;
```

---

## Exemple 3: Page protégée

```tsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function PagePrivée() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h1>Contenu privé - Seul un utilisateur connecté peut voir ceci</h1>
    </div>
  );
}

export default PagePrivée;
```

---

## Exemple 4: Vérifier la connexion avant une action

```tsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ModifierCartButton() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    if (!isAuthenticated) {
      // Rediriger vers login si non connecté
      navigate('/login');
      return;
    }

    // Sinon, effectuer l'action d'édition
    console.log('Mode édition activé');
    // ... logique d'édition ...
  };

  return <button onClick={handleEdit}>Modifier la carte</button>;
}

export default ModifierCartButton;
```

---

## Exemple 5: Formulaire de connexion

```tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/'); // Rediriger après succès
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  );
}

export default LoginForm;
```

---

## Exemple 6: Récupérer les données du profil

```tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  bio: string | null;
}

function ProfileData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setProfile(data);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) return <div>Chargement...</div>;
  if (!profile) return <div>Profil non trouvé</div>;

  return (
    <div>
      <h2>Profil de {profile.full_name || profile.email}</h2>
      <p>Bio: {profile.bio}</p>
    </div>
  );
}

export default ProfileData;
```

---

## Exemple 7: Sauvegarder les données du profil

```tsx
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function EditProfile() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          full_name: fullName,
          bio: bio,
        });

      if (error) throw error;

      setMessage('Profil sauvegardé!');
    } catch (error: any) {
      setMessage('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {message && <div>{message}</div>}
      
      <input
        type="text"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Nom complet"
      />
      
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Bio"
      />
      
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Sauvegarde...' : 'Sauvegarder'}
      </button>
    </div>
  );
}

export default EditProfile;
```

---

## Exemple 8: Navbar avec informations utilisateur

```tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/">Accueil</Link>

      {isAuthenticated ? (
        <>
          <span>Connecté en tant que: {user?.email}</span>
          <Link to="/profile">Mon profil</Link>
          <button onClick={handleLogout}>Déconnexion</button>
        </>
      ) : (
        <Link to="/login">Connexion</Link>
      )}
    </nav>
  );
}

export default Navbar;
```

---

## Exemple 9: Vérifier la connexion au démarrage

```tsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

function App() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('Utilisateur connecté:', user.email);
      } else {
        console.log('Utilisateur non connecté');
      }
    }
  }, [loading, user]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      {user ? (
        <div>Bienvenue {user.email}</div>
      ) : (
        <div>Veuillez vous connecter</div>
      )}
    </div>
  );
}

export default App;
```

---

## Exemple 10: Intégrer dans votre composant existant

```tsx
// Dans votre composant CardGallery.tsx ou TableView.tsx
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function CardGallery() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleEditMode = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    // Activer le mode édition
    setIsEditMode(true);
  };

  return (
    <button onClick={handleEditMode}>
      {isAuthenticated ? 'Éditer' : 'Se connecter pour éditer'}
    </button>
  );
}
```

---

## Bonnes pratiques

✅ **À faire:**
- Toujours vérifier `loading` avant `isAuthenticated`
- Utiliser `try/catch` pour les appels API
- Afficher des messages d'erreur clairs
- Rediriger vers `/login` si non connecté
- Utiliser le hook `useAuth()` plutôt que d'accéder directement à Supabase

❌ **À éviter:**
- Afficher des erreurs techniques à l'utilisateur
- Stocker les mots de passe en frontend
- Faire confiance au frontend uniquement pour la sécurité
- Oublier de vérifier `loading`

---

**Pour plus d'exemples, consultez les fichiers source!**
