# Remp-mp4 - YouTube Clone with Exclusive Private Channel

## Description

**Remp-mp4** is a revolutionary platform that reinvents the concept of video sharing by offering a **unique feature: the exclusive private channel**. Unlike other video platforms, Remp-mp4 allows you to create your own private video ecosystem, accessible only to people you personally choose.

## 🎯 Main Feature: Exclusive Private Channel

### The Revolutionary Concept
Remp-mp4 transforms your traditional YouTube channel into an **ultra-secure private space**. Your entire channel becomes invisible to the public and accessible only through a **personalized invitation system**.

### How It Works
1. **Private Mode Activation**: Make your entire channel private with a simple click
2. **Granular Control**: Manage individually who can access your channel
3. **Instant Revocation**: Remove access at any time for any user

### Perfect Use Cases
- **Companies**: Share training, presentations, or internal content exclusively with your employees
- **Families**: Create a private space to share your memories only with your loved ones
- **Educators**: Broadcast private courses to your selected students
- **Premium Creators**: Offer exclusive content to your VIP subscribers
- **Confidential Projects**: Share sensitive content with trusted partners

### Access Control Features
- **Custom Guest List**: Add/remove people individually
- **Temporary Links**: Configure access with expiration dates
- **Enhanced Authentication**: Optional password protection
- **Activity Logs**: Track who accesses your channel and when
- **Notifications**: Receive alerts for new access
- **Permission Management**: Define access levels (read-only, comments, sharing)

## Complementary Features

### Video Management
- **Content Types**:
  - Regular videos (standard format)
  - Shorts (short vertical format)
- **Flexible Storage Options**:
  - Local storage in public directory
  - Cloud streaming via MUX (future functionality)
- **User Uploads**:
  - Automatic thumbnail system
  - Optimized streaming playback
  - Automatic classification between videos and shorts based on format

### Storage Structure for Pre-integrated Videos (if you host them yourself)
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

### Supported Video Formats
- Format: MP4, WEBP
- Maximum resolution for regular videos: 4K (3840x2160)
- Format for shorts: Vertical (9:16)
- Adaptive streaming via MUX

### User Interactions
- Like/dislike system (visible only to guests)
- Subscription system for private channels
- Private comments on videos and shorts
- TikTok-style vertical navigation for shorts
- Separate viewing history for videos and shorts

### User Interface
- Responsive design with Tailwind CSS
- Separate navigation for videos and shorts
- Search bar with filters (in private space)
- Dark/light mode
- YouTube-inspired interface with security elements

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
- MUX SDK for video streaming

## Installation

```sh
# Clone the project
git clone https://github.com/DL-maker/Remp_Mp4-Youtube_clone-.git

# Install dependencies
cd Remp_Mp4-Youtube_clone-
npm install

# Configure environment variables
cp .env.example .env.local

# Add MUX credentials to .env.local
MUX_TOKEN_ID=your_token_id
MUX_TOKEN_SECRET=your_token_secret

# Run Prisma migrations
npx prisma migrate dev

# Start development server
npm run dev
```

## Environment Variables

```sh
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# MUX Configuration
MUX_TOKEN_ID="your_token_id"
MUX_TOKEN_SECRET="your_token_secret"

# Private Channel Configuration
PRIVATE_CHANNEL_BASE_URL="https://your-domain.com"
ENCRYPTION_KEY="your-encryption-key"
```

## Private Channel Configuration

In your account settings, you can:
- **Enable Private Mode**: Make your entire channel private
- **Manage Guests**: Add/remove people individually
- **Configure Access Links**: Customize invitation URLs
- **Set Expirations**: Configure access validity duration
- **Set Permissions**: Control what each guest can do
- **View Logs**: Monitor your private channel activity

## API Routes

### Private Channel Management
- `POST /api/private-channel/activate` - Activate private mode
- `POST /api/private-channel/invite` - Invite a person
- `DELETE /api/private-channel/revoke/:userId` - Revoke access
- `GET /api/private-channel/guests` - List guests
- `GET /api/private-channel/logs` - View access logs
- `PUT /api/private-channel/permissions/:userId` - Modify permissions

### Regular Videos
- `GET /api/videos` - List videos (respects private permissions)
- `POST /api/videos` - Upload video (local or MUX)
- `GET /api/videos/:id` - Video details (with access verification)
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

### MUX-Specific Routes
- `POST /api/mux/upload` - Initialize MUX upload
- `GET /api/mux/asset/:id` - Get MUX asset details
- `DELETE /api/mux/asset/:id` - Delete MUX asset

### Shorts
- `GET /api/shorts` - List shorts (respects private permissions)
- `POST /api/shorts` - Upload short
- `GET /api/shorts/:id` - Short details (with access verification)
- `PUT /api/shorts/:id` - Update short
- `DELETE /api/shorts/:id` - Delete short (future functionality)

### Access and Authentication
- `POST /api/access/verify` - Verify invitation link
- `GET /api/access/channel/:token` - Access private channel
- `POST /api/access/request` - Request channel access (future functionality)
- `GET /api/access/status` - Check access status (future functionality)

## Enhanced Security
- **Multi-layer authentication** via Supabase
- **Encrypted invitation links** with unique tokens
- **Real-time access verification** for each request (future functionality)
- **Sensitive data encryption** like password 

## Performance
- **Conditional loading** based on access rights
- **Media optimization** for private channels
- **Private CDN** for fast and secure distribution

## Private Channel Usage Guide

### For Channel Creators:
1. Log in to your account
2. Access channel settings
3. Enable "Private Channel Mode"
4. Generate a unique token and give it to trusted person(s)
5. Configure permissions for each guest (future functionality)
6. Monitor activity from your dashboard in the "Vos videos" page

### For Guests:
1. Receive your unique invitation link
2. Click the link to create your account or log in
3. Automatically access the private channel
4. Enjoy exclusive content according to your permissions
5. Interact in the private space (likes, comments, etc.)

## Unique Advantages of Remp-mp4

✅ **Total Confidentiality**: Your content remains invisible to the public
✅ **Absolute Control**: You decide who sees what and when (future functionality for the what & when option)
⛔ **Maximum Flexibility**: Change permissions at any time (future functionality)
✅ **Enhanced Security**: Advanced encryption and authentication

## Contribution
1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License.

---

*Remp-mp4: Reinvent video sharing with uncompromising privacy.*