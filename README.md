# Remp-mp4 - Clone YouTube avec partage sécurisé

## Description

**Remp-mp4** est une plateforme innovante qui réplique les fonctionnalités principales de YouTube, y compris les vidéos régulières et les shorts. Construite avec Next.js et Tailwind CSS, elle vous permet de gérer et partager vos vidéos de manière sécurisée et contrôlée, en donnant accès uniquement aux personnes de votre choix via des liens uniques générés pour chaque contenu.

## Fonctionnalités Principales

### Partage de Contenu Contrôlé
- **Génération de liens uniques** pour chaque vidéo partagée
- **Contrôle d'accès précis** : partagez uniquement avec les personnes de confiance
- **Options d'expiration** pour les contenus sensibles
- **Protection par mot de passe** optionnelle
- **Statistiques de visualisation** pour suivre qui accède à vos vidéos

### Gestion des Vidéos
- **Types de Contenu** :
  - Vidéos régulières (format standard)
  - Shorts (format vertical court)
- **Options de Stockage Flexibles** :
  - Stockage local dans le répertoire public
  - Streaming cloud via MUX
- **Téléchargements Utilisateur** :
  - Système automatique de miniatures
  - Lecture optimisée en streaming
  - Classification automatique entre vidéos et shorts basée sur le format

### Structure de Stockage
```
public/
├── videos/
│   ├── video1.mp4
│   ├── video2.mp4
│   └── video3.mp4
└── shorts/
    ├── short1.mp4
    ├── short2.mp4
    └── short3.mp4
```

### Formats Vidéo Supportés
- Format : MP4, WEBP
- Résolution maximale pour vidéos régulières : 4K (3840x2160)
- Format pour shorts : Vertical (9:16)
- Streaming adaptatif via MUX

### Interactions Utilisateur
- Système de likes/dislikes
- Système d'abonnement aux chaînes
- Commentaires sur les vidéos et shorts
- Navigation verticale de type TikTok pour les shorts
- Historique de visionnage séparé pour les vidéos et shorts

### Interface Utilisateur
- Design réactif avec Tailwind CSS
- Navigation séparée pour les vidéos et shorts
- Barre de recherche avec filtres
- Mode sombre/clair
- Interface inspirée de YouTube

## Technologies Utilisées

### Frontend
- Next.js 14+
- Tailwind CSS
- React Query
- TypeScript

### Backend
- Next.js API Routes
- Prisma (ORM)
- PostgreSQL
- NextAuth.js (Authentification)
- MUX SDK pour le streaming vidéo

## Installation

```sh
# Cloner le projet
git clone https://github.com/DL-maker/Remp_Mp4-Youtube_clone-.git

# Installer les dépendances
cd Remp_Mp4-Youtube_clone-
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Ajouter les identifiants MUX à .env.local
MUX_TOKEN_ID=your_token_id
MUX_TOKEN_SECRET=your_token_secret

# Exécuter les migrations Prisma
npx prisma migrate dev

# Démarrer le serveur de développement
npm run dev
```

## Variables d'Environnement

```sh
# Base de données
DATABASE_URL="postgresql://..."

# Authentification
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Configuration MUX
MUX_TOKEN_ID="your_token_id"
MUX_TOKEN_SECRET="your_token_secret"

# Configuration des liens de partage
SHARE_BASE_URL="https://votre-domaine.com"
```

## Configuration du Partage

Dans les paramètres de votre compte, vous pouvez:
- **Activer/désactiver le partage**: Permet de générer des liens uniques pour partager votre contenu
- **Configurer l'URL de partage**: Spécifiez l'URL de base qui sera utilisée pour créer vos liens de partage
- **Définir des expirations**: Configurez la durée de validité de vos liens partagés
- **Ajouter des protections**: Options pour sécuriser davantage vos vidéos partagées

## API Routes

### Vidéos Régulières
- `GET /api/videos` - Lister les vidéos
- `POST /api/videos` - Télécharger une vidéo (locale ou MUX)
- `GET /api/videos/:id` - Détails de la vidéo
- `PUT /api/videos/:id` - Mettre à jour une vidéo
- `DELETE /api/videos/:id` - Supprimer une vidéo
- `POST /api/videos/:id/share` - Générer un lien de partage pour une vidéo

### Routes Spécifiques MUX
- `POST /api/mux/upload` - Initialiser le téléchargement MUX
- `GET /api/mux/asset/:id` - Obtenir les détails de l'asset MUX
- `DELETE /api/mux/asset/:id` - Supprimer l'asset MUX

### Shorts
- `GET /api/shorts` - Lister les shorts
- `POST /api/shorts` - Télécharger un short
- `GET /api/shorts/:id` - Détails du short
- `PUT /api/shorts/:id` - Mettre à jour un short
- `DELETE /api/shorts/:id` - Supprimer un short
- `POST /api/shorts/:id/share` - Générer un lien de partage pour un short

### Utilisateurs
- `GET /api/users/:id` - Profil utilisateur
- `POST /api/users/subscribe` - S'abonner à une chaîne
- `POST /api/users/unsubscribe` - Se désabonner d'une chaîne

### Partage et Accès
- `POST /api/share/create` - Créer un lien de partage
- `GET /api/share/verify/:token` - Vérifier un lien de partage
- `PUT /api/share/:id/expire` - Configurer l'expiration d'un partage
- `GET /api/share/stats/:id` - Obtenir les statistiques de visualisation

## Validation Vidéo

### Vidéos Régulières
- Format : MP4, WEBP
- Résolution maximale : 4K (3840x2160)

### Shorts
- Format : MP4, WEBP
- Résolution : Format vertical (9:16)

### Téléchargements MUX
- Supporte tous les principaux formats vidéo
- Transcodage automatique
- Formats de streaming adaptatif

## Sécurité
- Authentification utilisateur via NextAuth.js
- Liens de partage cryptés et à durée limitée
- Validation des fichiers téléchargés
- Protection CSRF
- Limitation de taux des API
- Sanitisation des entrées utilisateur
- Gestion sécurisée des identifiants MUX

## Performance
- Mise en cache des vidéos
- Chargement paresseux des composants
- Optimisation des images et miniatures
- Streaming vidéo (local et MUX)
- Compression des assets
- Distribution globale via CDN MUX

## Guide d'utilisation du partage

1. Connectez-vous à votre compte
2. Activez l'option "Partage" dans les paramètres du compte
3. Ajoutez l'URL de base pour vos liens de partage
4. Téléchargez votre vidéo
5. Utilisez le bouton "Partager" sur n'importe quelle vidéo
6. Copiez le lien généré et partagez-le uniquement avec les personnes désirées
7. Suivez les statistiques de visualisation dans votre tableau de bord

## Contribution
1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence
Ce projet est sous licence MIT.
