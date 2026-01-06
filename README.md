# Todo Full-Stack Web Application

A comprehensive full-stack todo application built with modern web technologies, featuring a Next.js frontend and FastAPI backend with secure authentication and database integration.

## 🚀 Features

- **Full-stack application**: Complete with both frontend and backend components
- **Authentication**: Secure user registration and login functionality
- **Todo Management**: Create, read, update, and delete todo items
- **Responsive UI**: Modern UI that works on desktop and mobile devices
- **Secure API**: Protected endpoints with JWT authentication
- **Database Integration**: PostgreSQL database with Neon for real-time data storage

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React-based framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling framework
- **Shadcn UI**: Reusable UI components

### Backend
- **FastAPI**: High-performance Python web framework
- **SQLModel**: SQL database modeling and querying
- **Pydantic**: Data validation and settings management
- **PostgreSQL**: Relational database (with Neon integration)
- **JWT**: Secure authentication tokens
- **Better Auth**: Complete authentication solution

### Development Tools
- **Git**: Version control
- **Claude Tools**: AI-assisted development agents and skills

## 📁 Project Structure

```
Todo Full-Stack Web Application/
├── backend/                  # FastAPI backend
│   ├── main.py              # Main application entry point
│   ├── models.py            # Database models
│   ├── db.py                # Database configuration
│   ├── routes/              # API route handlers
│   │   ├── auth.py          # Authentication routes
│   │   └── tasks.py         # Todo task routes
│   ├── dependencies/        # Authentication dependencies
│   └── tests/               # Unit and integration tests
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/             # Application pages and layouts
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/             # Utility functions and API calls
│   │   └── types/           # TypeScript type definitions
│   ├── package.json         # Frontend dependencies
│   └── next.config.mjs      # Next.js configuration
├── .claude/                 # AI development agents and skills
├── specs/                   # Project specifications
└── history/                 # Development history and prompts
```

## 🏗️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.9 or higher)
- PostgreSQL or Neon database account

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables (use `.env.example` as reference):
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration
   ```

6. Run the development server:
   ```bash
   python run_server.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables (use `.env.example` as reference):
   ```bash
   cp .env.example .env
   # Edit .env with your actual configuration
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🔐 Authentication

The application uses JWT-based authentication with secure token handling. Users can register, log in, and their actions are protected by authentication middleware.

## 🧪 Testing

Backend tests are located in the `backend/tests` directory and can be run with:

```bash
cd backend
pytest
```

## 🚀 Deployment

### Backend Deployment
The backend can be deployed to platforms like:
- Heroku
- Railway
- Google Cloud Run
- AWS Lambda

### Frontend Deployment
The frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages
- AWS S3

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

This project was developed as part of a hackathon team effort using AI-assisted development tools and methodologies.