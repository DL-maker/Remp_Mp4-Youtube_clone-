# Remp-mp4 - Local YouTube Clone with Shorts

## Description
Remp-mp4 is a web application that replicates YouTube's core functionalities, including regular videos and shorts. Built with Next.js and Tailwind CSS, the application allows you to manage your videos locally while providing a YouTube-like experience.

## Main Features
### Video Management
- Support for two types of content:
  - Regular videos (standard format)
  - Shorts (vertical short format)
- User video uploads
- Automatic thumbnail system
- Optimized streaming playback
- Automatic classification between videos and shorts based on format

### User Interactions
- Like/dislike system
- Channel subscription system
- Comments on videos and shorts
- TikTok-style vertical navigation for shorts
- Separate viewing history for videos and shorts

### User Interface
- Responsive design with Tailwind CSS
- Separate navigation for videos and shorts
- Search bar with filters
- Dark/light mode
- YouTube-inspired interface

## Video Folder Structure
```
public/
├── videos/
│   ├── video1.mp4
│   ├── video2.mp4
│   ├── video3.mp4
│   └── video4.mp4
│      
└── shorts/
    ├── short1.mp4
    ├── short2.mp4
    └── short3.mp4
```

## Technologies Used
### Frontend
- Next.js 14+
- Tailwind CSS
- React Query
- TypeScript

### Backend
- Next.js API Routes
- Prisma (ORM)
- PostgreSQL
- NextAuth.js (Authentication)

## Installation
```bash
# Clone the project
git clone https://github.com/DL-maker/Remp_Mp4-Youtube_clone-.git

# Install dependencies
cd Remp_Mp4-Youtube_clone-.git
npm install

# Configure environment variables
cp .env.example .env.local

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## API Routes
### Regular Videos
- `GET /api/videos` - List videos
- `POST /api/videos` - Upload a video
- `GET /api/videos/:id` - Video details
- `PUT /api/videos/:id` - Update a video
- `DELETE /api/videos/:id` - Delete a video

### Shorts
- `GET /api/shorts` - List shorts
- `POST /api/shorts` - Upload a short
- `GET /api/shorts/:id` - Short details
- `PUT /api/shorts/:id` - Update a short
- `DELETE /api/shorts/:id` - Delete a short

### Users
- `GET /api/users/:id` - User profile
- `POST /api/users/subscribe` - Subscribe to a channel
- `POST /api/users/unsubscribe` - Unsubscribe from a channel

### Interactions
- `POST /api/videos/:id/like` - Like a video/short
- `POST /api/videos/:id/dislike` - Dislike a video/short
- `POST /api/videos/:id/comments` - Comment on a video/short

## Video Validation
### Regular Videos
- Format: MP4, WEBP
- Maximum resolution: 4K (3840x2160)

### Shorts
- Format: MP4, WEBP
- Resolution: Vertical format (9:16)

## Security
- User authentication via NextAuth.js
- Uploaded file validation
- CSRF protection
- API rate limiting
- User input sanitization

## Performance
- Video caching
- Component lazy loading
- Image optimization
- Video streaming
- Asset compression

## Contributing
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.
