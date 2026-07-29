<div align="center">

# Sathrift

**Buy • Sell • Reuse**

*A second-hand marketplace built for university and college students*

<br />

![React Native](https://img.shields.io/badge/React_Native-Expo-00A651?style=flat-square&logo=expo&logoColor=white)
![Express.js](https://img.shields.io/badge/Backend-Express.js-00A651?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-00A651?style=flat-square&logo=mongodb&logoColor=white)
![Better Auth](https://img.shields.io/badge/Auth-Better_Auth-00A651?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-00A651?style=flat-square)

</div>

<br />

## Overview

Sathrift is a mobile-first second-hand marketplace designed specifically for campus communities. Students can list items they no longer need — textbooks, electronics, furniture, fashion — and connect directly with buyers, without the friction of a traditional e-commerce checkout.

The platform intentionally keeps the transaction layer simple. There is no in-app chat and no payment gateway; instead, every listing routes the buyer straight to the seller's WhatsApp, mirroring how students already prefer to negotiate and coordinate handoffs on campus.

Sathrift is built as a full-stack TypeScript application: a React Native (Expo) client on the front end, an Express.js API on the back end, MongoDB for persistence, Better Auth for authentication, and imgbb for image hosting.

<br />

## Key Features

- 📚 Post and browse listings across categories relevant to student life
- 💬 Direct WhatsApp handoff between buyer and seller — no in-app messaging overhead
- 🔐 Secure authentication via Better Auth, including email/password and social sign-in
- 🖼️ Fast, lightweight image uploads powered by imgbb
- 🏷️ Status tracking for listings (available / sold)
- 🎓 University-focused UX, built around how students actually buy and sell
- 🌓 Full light and dark mode support
- ⚡ Built on Expo's modern architecture for fast iteration and native performance

<br />

## Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| **Frontend** | React Native (Expo), TypeScript, NativeWind |
| **Backend**  | Express.js                          |
| **Database** | MongoDB                             |
| **Auth**     | Better Auth                         |
| **Media**    | imgbb                               |
| **Deployment** | EAS (Expo Application Services)   |

<br />

## App Architecture

```
┌─────────────────────────┐
│   React Native (Expo)   │
│      Mobile Client       │
└────────────┬─────────────┘
             │  REST (HTTPS)
             ▼
┌─────────────────────────┐
│      Express.js API      │
│  Auth · Listings · Users │
└────────────┬─────────────┘
             │
      ┌──────┴──────┐
      ▼             ▼
┌───────────┐  ┌───────────┐
│  MongoDB  │  │   imgbb   │
│  (data)   │  │  (images) │
└───────────┘  └───────────┘
```

> Authentication is handled end-to-end by Better Auth, sitting in front of the Express API and issuing sessions consumed by the mobile client.

<br />

## API Overview

| Method | Endpoint             | Description                          |
|--------|-----------------------|---------------------------------------|
| POST   | `/api/auth/*`          | Authentication (sign up, sign in, session, social login) |
| GET    | `/api/listings`        | Fetch all active listings              |
| POST   | `/api/listings`        | Create a new listing                   |
| GET    | `/api/listings/:id`    | Fetch a single listing by ID           |
| PATCH  | `/api/listings/:id`    | Update a listing (e.g. mark as sold)   |
| DELETE | `/api/listings/:id`    | Remove a listing                       |
| GET    | `/api/users/:id`       | Fetch a seller's public profile        |

<br />

## Environment Variables

Create a `.env` file in the backend root with the following:

```env
PORT=5000
DATABASE_URL=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:5000
IMGBB_API_KEY=your_imgbb_api_key
```

And in the Expo client's `.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

<br />

## Getting Started

Before you begin, make sure you have:

- Node.js 18 or later
- A MongoDB connection string (Atlas or local)
- An imgbb API key
- Expo CLI (`npm install -g expo-cli`) or the Expo Go app on a physical device

<br />

## Installation

Clone the repository and install dependencies for both client and server:

```bash
git clone https://github.com/your-username/sathrift.git
cd sathrift

# Client
npm install

# Server
cd server
npm install
```

<br />

## Running the App

**Start the backend:**

```bash
cd server
npm run dev
```

**Start the Expo client (in a separate terminal):**

```bash
npx expo start
```

Then scan the QR code with Expo Go, or launch a simulator with:

```bash
npx expo start --ios
npx expo start --android
```

<br />

## Folder Structure

```
sathrift/
├── app/                    # Expo Router screens
│   ├── (auth)/             # Login & register
│   ├── (tabs)/             # Main app tabs
│   └── explore/             # Listing browse & detail
├── components/              # Reusable UI components
├── lib/                      # Auth client, API helpers
├── assets/                   # Fonts, icons, static assets
├── server/                   # Express.js backend
│   ├── routes/                # API route handlers
│   ├── models/                 # MongoDB schemas
│   ├── middleware/              # Auth & request middleware
│   └── config/                   # Better Auth & DB config
└── README.md
```

<br />

## Security Notes

- All authentication is handled by Better Auth; no credentials are stored or managed manually.
- Environment variables (API keys, database URIs, auth secrets) are never committed to the repository.
- Seller contact is limited to WhatsApp deep links — no personal data beyond a phone number is exposed in a listing.
- Image uploads are proxied through the backend rather than exposing the imgbb key to the client.

> ⚠️ Always rotate your `BETTER_AUTH_SECRET` and API keys before deploying to production.

<br />

## Future Improvements

- In-app notifications for listing activity
- Seller ratings and reviews
- Campus-based location filtering
- Saved searches and wishlists
- Admin moderation dashboard

<br />

## Contributing

Contributions are welcome. Please open an issue to discuss any significant change before submitting a pull request.

```bash
git checkout -b feature/your-feature-name
git commit -m "Add: your feature"
git push origin feature/your-feature-name
```

<br />

## License

This project is licensed under the [MIT License](LICENSE).

<br />

## Author

<div align="center">

**Md. Abdur Rahman**

[Portfolio](https://your-portfolio-link.com) · [GitHub](https://github.com/your-username) · [LinkedIn](https://linkedin.com/in/your-linkedin)

</div>