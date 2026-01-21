# Configuration de l'authentification Supabase

## Variables d'environnement requises

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Comment obtenir ces valeurs

1. Allez sur [console.supabase.com](https://console.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Vous verrez:
   - **Project URL** → Copiez-le dans `VITE_SUPABASE_URL`
   - **Project API keys** → Copiez la clé `anon` (public) dans `VITE_SUPABASE_ANON_KEY`

## Activation de l'authentification par Email

1. Dans Supabase, allez à **Authentication** → **Providers**
2. Vérifiez que **Email** est activé
3. Configurez les options si nécessaire

## Configuration des URL de redirection

1. Allez à **Authentication** → **URL Configuration**
2. Ajoutez les URLs de redirection pour votre application:
   - Pour le développement local: `http://localhost:5173/`
   - Pour la production: `https://your-domain.com/`

## Test de l'authentification

Après la configuration, vous pouvez tester en:
1. Exécutant `npm run dev`
2. Naviguant à l'URL de l'application
3. Cliquant sur le bouton "Edit"
4. Étant redirigé vers la page de login
5. Créant un nouveau compte
