# CodeCast - Video Learning Platform

CodeCast is a modern video learning platform built with React, TypeScript, and MongoDB. It provides a seamless experience for creators to upload educational content and for learners to discover and engage with high-quality programming tutorials.

## Features

- 🎥 Video upload and streaming
- 📝 Interactive code examples
- 💬 Real-time comments and discussions
- 🔍 Advanced search and filtering
- 📱 Responsive design for all devices
- 🔐 Secure authentication and authorization
- 📊 Analytics and progress tracking

## Prerequisites

- Node.js 18.0.0 or higher
- MongoDB 6.0 or higher (local or MongoDB Atlas)
- npm or yarn

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/codecast.git
cd codecast
```

### 2. Install dependencies

```bash
# Using npm
npm install

# OR using yarn
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory and add the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/codecast

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# App Configuration
NODE_ENV=development
PORT=3000

# Frontend URL (for CORS and redirects)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Seed the database (optional)

To populate the database with sample data, run:

```bash
# Using npm
npm run seed

# OR using yarn
yarn seed
```

This will create:
- Admin user: admin@codecast.dev / admin123
- Creator user: sarah@codecast.dev / creator123
- Viewer user: alex@codecast.dev / viewer123

### 5. Start the development server

```bash
# Using npm
npm run dev

# OR using yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `dev` - Start the development server
- `build` - Build the application for production
- `start` - Start the production server
- `lint` - Run ESLint
- `format` - Format code with Prettier
- `test` - Run tests
- `test:coverage` - Run tests with coverage
- `seed` - Seed the database with sample data

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod
- **UI Components**: Radix UI, Shadcn/ui
- **Build Tool**: Vite
- **Testing**: Vitest, React Testing Library

## Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions and configurations
│   ├── models/         # MongoDB models
│   ├── pages/          # Next.js pages
│   ├── services/       # API services
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
├── public/             # Static files
├── tests/              # Test files
└── .env               # Environment variables
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query/latest)
