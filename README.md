# Remp-mp4 - Local/Web YouTube Clone with Shorts

## Description

**Remp-mp4** est une application web innovante qui réplique les fonctionnalités principales de YouTube, y compris les vidéos régulières et les shorts. Construite avec Next.js et Tailwind CSS, elle permet de gérer vos vidéos localement et via le streaming cloud grâce à l'intégration de MUX. Vous avez un contrôle total sur qui peut voir vos vidéos en partageant des liens uniquement avec des personnes de confiance.

## Fonctionnalités Principales

### Gestion des Vidéos
- **Types de Contenu** :
  - Vidéos régulières (format standard)
  - Shorts (format vertical court)
- **Options de Stockage Flexibles** :
  - Stockage local dans le répertoire public
  - Streaming cloud via MUX
- **Téléchargements Utilisateur** :
  - Téléchargements de vidéos par les utilisateurs
  - Système automatique de miniatures
  - Lecture optimisée en streaming
  - Classification automatique entre vidéos et shorts basée sur le format

### Options de Stockage Vidéo
- **Stockage Local** :
  ```
  public/
  ├── videos/
  │   ├── video1.mp4
  │   ├── video2.mp4
  │   ├── video3.mp4
  │   └── video4.mp4
  └── shorts/
      ├── short1.mp4
      ├── short2.mp4
      └── short3.mp4
  ```
- **Stockage Cloud MUX** :
  - Hébergement vidéo prêt pour le streaming
  - Optimisation automatique des vidéos
  - Distribution globale via CDN
  - Analyses vidéo en temps réel
  - Streaming adaptatif

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
cd Remp_Mp4-Youtube_clone-.git
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
```

## API Routes

### Vidéos Régulières
- `GET /api/videos` - Lister les vidéos
- `POST /api/videos` - Télécharger une vidéo (locale ou MUX)
- `GET /api/videos/:id` - Détails de la vidéo
- `PUT /api/videos/:id` - Mettre à jour une vidéo
- `DELETE /api/videos/:id` - Supprimer une vidéo

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

### Utilisateurs
- `GET /api/users/:id` - Profil utilisateur
- `POST /api/users/subscribe` - S'abonner à une chaîne
- `POST /api/users/unsubscribe` - Se désabonner d'une chaîne

### Interactions
- `POST /api/videos/:id/like` - Aimer une vidéo/short
- `POST /api/videos/:id/dislike` - Ne pas aimer une vidéo/short
- `POST /api/videos/:id/comments` - Commenter une vidéo/short

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
- Validation des fichiers téléchargés
- Protection CSRF
- Limitation de taux des API
- Sanitisation des entrées utilisateur
- Gestion sécurisée des identifiants MUX

## Performance
- Mise en cache des vidéos
- Chargement paresseux des composants
- Optimisation des images
- Streaming vidéo (local et MUX)
- Compression des assets
- Distribution globale via CDN MUX

## Contribution
1. Forkez le projet
2. Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commitez vos modifications (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence
Ce projet est sous licence MIT.
