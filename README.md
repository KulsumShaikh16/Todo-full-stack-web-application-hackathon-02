# Todo Full-Stack Web Application

A comprehensive full-stack todo application built with modern web technologies, featuring a Next.js frontend and FastAPI backend with secure authentication and database integration.

## 🚀 Features

- **Full-stack application**: Complete with both frontend and backend components
- **Authentication**: Secure user registration and login functionality
- **Todo Management**: Create, read, update, and delete todo items
- **AI-Powered Chatbot**: Intelligent assistant to help manage tasks using Google Gemini AI
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
- **Google Gemini AI**: AI-powered chatbot functionality

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
- Google Gemini API Key (optional, for AI chatbot features)

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
   # Edit .env with your actual configuration including:
   # - DATABASE_URL: Your PostgreSQL connection string
   # - BETTER_AUTH_SECRET: Your JWT secret
   # - GEMINI_API_KEY: Your Google Gemini API key (required for chatbot)
   # - GEMINI_MODEL: Model name (default: gemini-1.5-flash)
   ```

6. Run the development server:
   ```bash
   python run_server.py
   ```

### AI Chatbot Configuration

To enable the AI chatbot functionality:

1. Obtain a Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
2. Add your `GEMINI_API_KEY` to the backend `.env` file
3. Ensure the `GEMINI_MODEL` is set (default: gemini-1.5-flash)
4. The chatbot will automatically be enabled when the backend starts successfully with the API key

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
- Railway (recommended)
- Google Cloud Run
- AWS Lambda

When deploying the backend, make sure to set the following environment variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Your JWT secret
- `GEMINI_API_KEY`: Your Google Gemini API key (required for chatbot)
- `GEMINI_MODEL`: Model name (default: gemini-1.5-flash)
- `CORS_ORIGINS`: Comma-separated list of allowed origins (e.g., your frontend URL)

⚠️ **Important**: If you're experiencing issues with the chatbot not showing responses, sign-in/sign-up errors ("failed to fetch"), or API calls failing,
ensure your `CORS_ORIGINS` variable includes your frontend's domain exactly as it appears in the browser:

Common issues and solutions:
- **Sign-in/Sign-up errors**: Often caused by incorrect CORS configuration or wrong backend URL
- **"Failed to fetch" errors**: Usually indicates a communication problem between frontend and backend
- **Empty chat responses**: Could be due to missing GEMINI_API_KEY or CORS issues

Troubleshooting steps:
- For local development: `http://localhost:3000,http://127.0.0.1:3000`
- For Vercel deployment: Add your Vercel URL (e.g., `https://your-app.vercel.app`)
- Example for both: `http://localhost:3000,https://your-app.vercel.app`
- Make sure `NEXT_PUBLIC_API_URL` in your frontend points to your backend URL

#### Railway Specific Setup:
1. Connect your GitHub repository to Railway
2. Add the environment variables mentioned above in the Railway dashboard under Settings > Environment Variables
3. Ensure your database is properly configured
4. Deploy the application and note the backend URL for frontend configuration

### Frontend Deployment
The frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- GitHub Pages
- AWS S3

When deploying the frontend, ensure you set the following environment variable:
- `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., your Railway app URL)

### Troubleshooting Common Issues

#### Sign-In/Sign-Up "Failed to Fetch" Errors
1. **Verify API URL**: Ensure `NEXT_PUBLIC_API_URL` in your frontend environment points to your deployed backend
2. **Check CORS Configuration**: Confirm `CORS_ORIGINS` in your backend includes your frontend domain
3. **Network Issues**: Check if your backend is running and accessible at the specified URL
4. **Browser Console**: Look for specific error messages in developer tools (F12)

#### Chatbot Not Responding
1. **API Key**: Ensure `GEMINI_API_KEY` is set in your backend environment variables
2. **Model Availability**: Confirm the `GEMINI_MODEL` is available and properly configured
3. **CORS Issues**: Same as above - ensure proper CORS configuration
4. **Authentication**: Make sure you're logged in when using chat functionality

#### Testing Backend Connectivity
You can test if your backend is accessible using:
```bash
curl -X GET "YOUR_BACKEND_URL/health"
```
This should return a health status if the backend is running properly.

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