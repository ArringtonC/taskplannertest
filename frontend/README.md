# Task Planner Frontend

A modern React application for managing tasks with complexity tracking, monthly distribution visualization, and task breakdown capabilities.

## 📋 Project Overview

Task Planner is a comprehensive task management application designed to help users visualize task distribution, analyze complexity, and prevent overload. Key features include:

- Interactive dashboard with table/card views of tasks
- Monthly Mapper calendar showing task distribution
- Complexity tracking and analysis
- Task breakdown capabilities
- Full CRUD operations for task management

## 🚀 Getting Started

### Prerequisites

- Node.js (v14.0 or higher)
- npm or yarn
- Backend API running (see backend repository)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-planner-frontend.git
   cd task-planner-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📜 Available Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally
- `npm test` - Run the test suite

## 🔑 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## 🖥️ Pages and Components

- **Dashboard** - Main task management view with table/card layouts
- **Monthly Mapper** - Calendar view showing task distribution by month
- **Task Components** - Reusable components for displaying and editing tasks
- **Utility Modules** - Business logic for task analysis and complexity

## 🛠️ Technology Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Routing and navigation
- **Context API** - State management
- **Fetch API** - Data fetching

## 📁 Project Structure

```
frontend/
├── public/           # Static assets
├── src/
│   ├── api/          # API service functions
│   ├── assets/       # Images, icons, etc.
│   ├── components/   # Reusable components
│   │   └── Task/     # Task-specific components
│   ├── context/      # React context providers
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   ├── styles/       # Global styles
│   ├── utils/        # Utility functions
│   ├── App.tsx       # Main app component
│   ├── main.tsx      # Entry point
│   └── vite-env.d.ts # Vite type definitions
├── .env              # Environment variables (create this)
├── .gitignore        # Git ignore file
├── index.html        # HTML entry point
├── package.json      # Project dependencies
├── tailwind.config.js # Tailwind configuration
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

## 🧩 Key Features

### Task Dashboard

The dashboard provides two views for managing tasks:
- **Card View** - Visual representation of tasks with complexity indicators
- **Table View** - Efficient list view for quick scanning and management

### Monthly Mapper

Visualize task distribution across months:
- Identify overloaded months (more than 4 tasks)
- See complexity distribution
- Plan task redistribution

### Complexity Analytics

- Track task complexity on a scale of 1-8
- Calculate average and total complexity per month
- Identify months with high complexity load

## 🚀 Deployment

### Building for Production

To build the application for production:

1. Ensure environment variables are set correctly:
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. The build artifacts will be generated in the `dist` directory

### Docker Deployment

The project includes Docker support for easy deployment:

1. Build the Docker image:
   ```bash
   docker build -t task-planner-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 80:80 task-planner-frontend
   ```

### Docker Compose (with Backend)

The root directory contains a `docker-compose.yml` file to run both frontend and backend:

1. Configure environment variables for both applications
2. Start both services:
   ```bash
   docker-compose up -d
   ```

3. Access the application at http://localhost:80

### Hosting Options

The application can be hosted on various platforms:

- **Static Hosting**: Netlify, Vercel, GitHub Pages, AWS S3
- **Container Hosting**: AWS ECS, Google Cloud Run, Azure Container Instances
- **Virtual Machines**: Any provider supporting Docker or Node.js

### Production Considerations

- Set `VITE_API_URL` to your production backend URL
- Configure CI/CD pipelines for automated builds and deployments
- Set up monitoring and error tracking tools
- Use a CDN for improved content delivery

## 📝 License

This project is licensed under the MIT License

## Original Vite + React + TypeScript Template Information

This project was bootstrapped with Vite. Below is information about the template:

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
