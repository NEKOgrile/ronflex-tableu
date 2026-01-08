# Ronflex Tableu - Collection de Cartes Snorlax

Une application web pour gérer votre collection de cartes Pokémon Snorlax. Affichez, filtrez et suivez vos cartes en mode galerie ou tableau.

## 🚀 Fonctionnalités

- Affichage en galerie ou tableau
- Filtres par nom, set, rareté, langue, etc.
- Suivi des cartes possédées/non possédées
- Mise à jour des images des cartes
- Ajout de nouvelles cartes via formulaire
- Statistiques de complétude
- Persistance des données utilisateur (localStorage)

## 🛠️ Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + Lucide Icons
- **Déploiement**: GitHub Pages
- **Base de données**: JSON statique + localStorage

## 📁 Structure du Projet

```
ronflex-tableu/
├── public/
│   └── cards.json          # Base de données principale des cartes
├── src/
│   ├── components/
│   │   ├── CardGallery.tsx # Affichage en galerie
│   │   ├── FilterBar.tsx   # Filtres et recherche
│   │   └── TableView.tsx   # Affichage en tableau
│   ├── lib/
│   │   └── supabase.ts     # (Non utilisé - remplacé par JSON)
│   ├── types/
│   │   └── card.ts         # Interface TypeScript pour les cartes
│   └── App.tsx             # Composant principal
├── package.json
├── vite.config.ts
└── README.md
```

## 🗄️ Base de Données

### Emplacement
La base de données principale est stockée dans `public/cards.json`.

### Structure des Données
Chaque carte suit cette interface TypeScript :

```typescript
interface SnorlaxCard {
  id: string;              // Identifiant unique
  possessed: boolean;      // Possédée ou non
  image_url: string;       // URL de l'image de la carte
  name: string;            // Nom de la carte
  set: string;             // Extension/Set
  number: string;          // Numéro de la carte
  release_date: string;    // Date de sortie (YYYY-MM-DD)
  rarity: string;          // Rareté (Common, Rare, Holographic, etc.)
  type: string;            // Type (Normal, Holo, Reverse, etc.)
  language: string;        // Langue (EN, JP, FR, etc.)
  principal: string;       // Carte principale Snorlax (true/false)
}
```

### Exemple de Données
```json
[
  {
    "id": "1",
    "possessed": false,
    "image_url": "https://example.com/card1.jpg",
    "name": "Snorlax Card 1",
    "set": "Base Set",
    "number": "001",
    "release_date": "2023-01-01",
    "rarity": "Common",
    "type": "Normal",
    "language": "EN",
    "principal": "true"
  }
]
```

### Accès et Modification
1. **Lire les données** : L'app charge automatiquement `public/cards.json` au démarrage
2. **Modifier manuellement** : Éditez directement `public/cards.json`
3. **Ajouter via l'app** : Utilisez le bouton "Add Card" (sauvegardé dans localStorage)
4. **Données utilisateur** : Possédées et images personnalisées stockées dans localStorage

## 🚀 Installation et Développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le repo
git clone https://github.com/NEKOgrile/ronflex-tableu.git
cd ronflex-tableu

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

### Build et Déploiement
```bash
# Build pour production
npm run build

# Déployer sur GitHub Pages
npm run deploy
```

## 🤖 Générer une Base de Données Complète avec GPT

Pour créer une base de données complète et bien structurée :

1. **Fournir ce contexte à GPT** :
   - Ce README complet
   - La structure des données (interface TypeScript)
   - Des exemples de cartes existantes
   - Les règles de nommage et classification des cartes Pokémon

2. **Demander à GPT** :
   - Générer un fichier JSON valide avec toutes les cartes Snorlax officielles
   - Respecter la structure exacte
   - Inclure des URLs d'images réelles quand possible
   - Organiser par sets et dates de sortie

3. **Remplacer le fichier** :
   - Copier le JSON généré dans `public/cards.json`
   - Tester l'app localement
   - Commit et déployer

## 📊 Statistiques

L'app affiche automatiquement :
- Nombre de cartes possédées
- Nombre de cartes manquantes
- Pourcentage de complétude

## 🎨 Personnalisation

- **Thème** : Couleurs Pokémon (bleu marine, orange, jaune)
- **Images** : Possibilité de mettre à jour les URLs d'images
- **Filtres** : Recherche par nom/numéro, filtres par set/rareté/langue

## 📝 Scripts Disponibles

- `npm run dev` : Développement local
- `npm run build` : Build de production
- `npm run deploy` : Déploiement GitHub Pages

## 🤝 Contribution

1. Fork le projet
2. Crée une branche (`git checkout -b feature/nouvelle-fonction`)
3. Commit tes changements (`git commit -am 'Ajoute nouvelle fonction'`)
4. Push (`git push origin feature/nouvelle-fonction`)
5. Crée une Pull Request

## 📄 Licence

Ce projet est open source. Utilisez-le comme vous voulez !

---

*Construit avec ❤️ pour les collectionneurs de cartes Pokémon*
