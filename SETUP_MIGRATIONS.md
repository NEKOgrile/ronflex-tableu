# Instructions pour appliquer les migrations Supabase

## Comment appliquer la migration de la table profiles

### Option 1 : Via Supabase Dashboard (Recommandé)

1. Accédez à [console.supabase.com](https://console.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Cliquez sur **New Query**
5. Copiez le contenu du fichier `supabase/migrations/20260121_create_profiles_table.sql`
6. Collez-le dans l'éditeur SQL
7. Cliquez sur **Run**

### Option 2 : Via Supabase CLI

```bash
# Installer la CLI Supabase si ce n'est pas fait
npm install -g supabase

# Se connecter à Supabase
supabase login

# Appliquer les migrations
supabase db push
```

### Option 3 : Crer manuellement la table (Si vous préférez)

Si vous avez une interface Supabase ouverte, vous pouvez :
1. Aller dans **Database** → **Tables**
2. Cliquer sur **Create a new table**
3. Créer la table `profiles` avec les colonnes appropriées
4. Activer RLS et créer les policies

## Vérification

Après avoir appliqué la migration, vérifiez que :
- ✅ La table `profiles` existe dans votre base de données
- ✅ Les colonnes `id`, `email`, `full_name`, `bio`, `created_at` existent
- ✅ RLS est activé sur la table
- ✅ Les policies de sécurité sont en place

## Notes importantes

- La table `profiles` est liée à la table `auth.users` via l'ID
- Chaque utilisateur ne peut voir et modifier que son propre profil (RLS)
- Le champ `updated_at` se met à jour automatiquement
