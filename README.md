# Font Group Manager

A web application for uploading, organizing, and managing font collections. This application allows users to create and manage font groups by combining multiple fonts together for easier organization and usage.

## Features

- **Font Upload**: Upload TTF font files to your collection
- **Font Management**: View, preview, and delete fonts in your collection
- **Font Groups**: Create custom font groups by combining multiple fonts
- **Group Management**: Edit or delete existing font groups
- **Modern UI**: Clean and responsive interface built with React and Tailwind CSS

## Tech Stack

### Backend

- PHP
- RESTful API endpoints
- JSON storage for font groups
- File system storage for font files

### Frontend

- React with TypeScript
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- React Icons

## Project Structure

```
font-group-manager/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.tsx          # Main application component
│   │   └── api.ts           # API communication module
│   └── ...
├── server/                  # PHP backend
│   ├── api/                 # API endpoints
│   ├── controllers/         # Controller classes
│   ├── models/              # Data models
│   ├── core/                # Core functionality
│   ├── data/                # JSON data storage
│   └── uploads/             # Font file storage
└── docker-compose.yml       # Docker configuration
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- Node.js and npm (for local development)

### Installation & Setup

1. Clone the repository

   ```bash
   git clone <repository-url>
   cd font-group-manager
   ```

2. Start the application using Docker

   ```bash
   docker-compose up -d
   ```

3. Access the application
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

### Development

#### Using Docker (Recommended)

When using Docker, both frontend and backend development environments are already configured:

```bash
# Start the entire application stack
docker-compose up -d

# View logs from both services
docker-compose logs -f

# View logs from a specific service
docker-compose logs -f client
docker-compose logs -f server
```

Any changes to the code will automatically reload in both frontend and backend services, as the Docker configuration includes volume mounts that reflect changes immediately.

#### Without Docker

If you prefer to develop without Docker, you can run each part separately:

##### Frontend (React)

```bash
cd client
npm install
npm run dev
```

The React development server will start at [http://localhost:3000](http://localhost:3000) with hot reload enabled.

##### Backend (PHP)

```bash
cd server
# You need PHP installed locally
php -S localhost:5000
```

Note: When developing without Docker, you'll need to ensure all dependencies (Node.js, npm, PHP) are installed on your local machine.

## Usage Guide

### Uploading Fonts

1. Navigate to the Font Upload section
2. Click "Choose File" and select a TTF font file
3. Click "Upload Font" to add it to your collection

### Creating Font Groups

1. Navigate to the Font Group section
2. Enter a name for your group
3. Select at least two fonts to include in the group
4. Click "Create Group" to save your font group

### Managing Font Groups

- Edit: Click the edit icon next to a font group to modify its name or included fonts
- Delete: Click the delete icon next to a font group to remove it

## Docker Configuration

The project includes a `docker-compose.yml` file with the following services:

- **client**: React frontend application (port 3000)
- **server**: PHP backend API (port 5000)

All data is stored in mounted volumes to persist between container restarts.
