# Freelance Hub

A full-stack MERN web application for freelancer-to-freelancer collaboration. Experienced freelancers can hire beginner freelancers for contract-based tasks and delegation of freelance work.

## 🚀 Features

### Core Functionality
- **Two User Roles**: Beginner Freelancer & Experienced Freelancer
- **Contract Management**: Create, browse, and manage contracts
- **Application System**: Apply to contracts with proposals
- **Real-time Messaging**: Socket.io-powered chat system
- **Ratings & Reviews**: Rate freelancers after contract completion

### Authentication & Security
- JWT-based authentication
- Bcrypt password hashing
- Protected routes with role-based access control

### User Experience
- Modern, responsive UI
- Clean dashboard design
- Loading states & error handling
- Role-specific interfaces

## 🛠 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React 18
- React Router DOM
- Axios for API requests
- Socket.io-client
- CSS3 with custom properties

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd freelance-hub
```

2. **Install server dependencies**
```bash
npm install
```

3. **Install client dependencies**
```bash
cd client
npm install
cd ..
```

4. **Environment Variables**
Create a `.env` file in the root directory:
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelance-hub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d
```

5. **Start the application**

Run both frontend and backend (from root directory):
```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

Or use the provided scripts:
```bash
npm run server  # Backend only
npm run client  # Frontend only
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📱 Usage

### For Experienced Freelancers
1. Register as "Experienced Freelancer"
2. Post contracts with title, description, skills required, budget, and deadline
3. Review applications from beginner freelancers
4. Accept or reject applicants
5. Communicate via real-time chat
6. Rate freelancers after contract completion

### For Beginner Freelancers
1. Register as "Beginner Freelancer"
2. Browse available contracts
3. Apply to contracts with a proposal
4. Track application status
5. Communicate with clients via chat
6. Build your rating through completed work

## 🗂 Project Structure

```
freelance-hub/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/     # Reusable components
│       ├── context/        # React context
│       ├── pages/          # Page components
│       ├── App.css         # Global styles
│       ├── App.js          # Main app component
│       └── index.js        # Entry point
├── middleware/             # Express middleware
├── models/                 # Mongoose schemas
│   ├── User.js
│   ├── Contract.js
│   ├── Application.js
│   ├── Message.js
│   └── Review.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── users.js
│   ├── contracts.js
│   ├── applications.js
│   ├── messages.js
│   └── reviews.js
├── server.js               # Express server
├── package.json
└── .env                    # Environment variables
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update profile

### Contracts
- `GET /api/contracts` - Get all contracts (filter by status)
- `GET /api/contracts/:id` - Get contract details
- `POST /api/contracts` - Create contract (experienced only)
- `PUT /api/contracts/:id` - Update contract
- `GET /api/contracts/my/contracts` - Get user's contracts

### Applications
- `POST /api/applications` - Apply to contract (beginner only)
- `GET /api/applications/my-applications` - Get my applications
- `GET /api/applications/contract/:contractId` - Get contract applications
- `PUT /api/applications/:id/:action` - Accept/Reject application

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:userId` - Get conversation
- `GET /api/messages/conversations/list` - Get all conversations

### Reviews
- `POST /api/reviews` - Create review (experienced only)
- `GET /api/reviews/user/:userId` - Get user reviews
- `GET /api/reviews/my-reviews` - Get my reviews

## 🎨 UI Features

- Responsive design for mobile and desktop
- Modern card-based layout
- Status badges for contracts and applications
- Star ratings display
- Real-time chat interface
- Loading spinners and error states
- Role-specific navigation

## 🔒 Security Features

- JWT authentication with protected routes
- Password hashing with bcrypt
- Role-based access control
- Input validation on all forms
- MongoDB injection protection via Mongoose

## 🚧 Future Enhancements

- [ ] File upload for portfolio
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Payment integration
- [ ] Contract templates
- [ ] Analytics dashboard
- [ ] Mobile app

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.
