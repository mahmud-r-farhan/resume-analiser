
# MERN Stack Advanced Authentication System

This project is a MERN (MongoDB, Express, React, Node.js) stack application that implements an advanced authentication system with email verification.

## Features

- User registration with email verification
- Login with username or email
- Modern, responsive UI with form validation
- JWT-based authentication
- MongoDB for data storage
- Express.js backend
- React frontend with React Router

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or later)
- MongoDB

## Installation

1. Clone the repository:

   \`\`\`
   git clone https://github.com/your-username/mern-auth-system.git
   cd mern-auth-system
   \`\`\`

2. Install backend dependencies:

   \`\`\`
   cd backend
   npm install
   \`\`\`

3. Install frontend dependencies:

   \`\`\`
   cd ../frontend
   npm install
   \`\`\`

## Configuration

1. Create a \`.env\` file in the \`backend\` directory with the following content:

   \`\`\`
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_gmail_address
   EMAIL_PASS=your_gmail_app_password
   FRONTEND_URL=http://localhost:3000
   \`\`\`

   Replace the placeholders with your actual values.

2. To use Gmail for sending verification emails, you need to:
   - Enable 2-Step Verification for your Google account
   - Generate an App Password for your application

## Running the Application

1. Start the backend server:

   \`\`\`
   cd backend
   npm start
   \`\`\`

2. In a new terminal, start the frontend development server:

   \`\`\`
   cd frontend
   npm start
   \`\`\`

3. Open your browser and navigate to \`http://localhost:3000\` to use the application.

## API Endpoints

- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login a user
- GET /api/auth/verify/:token - Verify user's email

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any questions or inquiries, please contact me at [dev@devplus.fun](mailto:dev@devplus.fun).


