# SheCodes

## Overview
SheCodes is a web-based platform designed to empower women by providing access to education, mentorship, business resources, and community support. The platform consists of a **server-side** API built with Node.js and Express and a **client-side** React application.

## Project Structure
```
SheCodes/
│
├── server/
│   ├── index.js                   # Server entry point
│   ├── config/
│   │   ├── db.js                  # Database connection
│   │   └── cloudStorage.js        # File upload config (if needed)
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── userController.js      # User profile & role management
│   │   ├── courseController.js    # Course & education management
│   │   ├── communityController.js # Community forums, discussions
│   │   ├── mentorController.js    # Mentorship requests & approvals
│   │   ├── businessController.js  # Business & funding resources
│   │   ├── safetyController.js    # Safety & legal guidance
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT authentication middleware
│   │   ├── roleMiddleware.js      # Role-based access control
│   ├── models/
│   │   ├── User.js                # User schema/model
│   │   ├── Course.js              # Course schema
│   │   ├── Community.js           # Community discussion schema
│   │   ├── Mentor.js              # Mentorship requests schema
│   │   ├── Business.js            # Business funding schema
│   │   ├── Safety.js              # Safety & legal articles schema
│   ├── routes/
│   │   ├── auth.js                # Authentication routes
│   │   ├── user.js                # User profile routes
│   │   ├── courses.js             # Education & skill development
│   │   ├── community.js           # Community forum routes
│   │   ├── mentor.js              # Mentorship & leadership routes
│   │   ├── business.js            # Business & funding routes
│   │   ├── safety.js              # Safety & legal info routes
│   ├── uploads/                   # File uploads (if applicable)
│   ├── .env                        # Environment variables
│   ├── package.json                # Dependencies & scripts
│   ├── README.md                   # API documentation
│
└── client/
    └── src/
        ├── App.js                 # Main React component with routes
        ├── index.css              # Global styles
        ├── main.jsx               # Entry point
        ├── context/
        │   ├── AuthContext.jsx     # Authentication context
        │   ├── UserContext.jsx     # User & role context
        ├── pages/
        │   ├── Login/
        │   │   └── Login.jsx       # Login component
        │   ├── Register/
        │   │   └── Register.jsx    # Registration component
        │   ├── Dashboard/
        │   │   └── Dashboard.jsx   # User dashboard
        │   ├── Education/
        │   │   ├── Courses.jsx     # List of courses
        │   │   ├── CourseDetail.jsx# Course details page
        │   ├── Community/
        │   │   ├── Forum.jsx       # Community discussions
        │   │   ├── PostDetail.jsx  # View individual posts
        │   ├── Mentorship/
        │   │   ├── Mentors.jsx     # List of available mentors
        │   │   ├── MentorDetail.jsx# Mentor profile
        │   ├── Business/
        │   │   ├── Funding.jsx     # Business funding resources
        │   │   ├── ApplyFunding.jsx# Apply for funding
        │   ├── Safety/
        │   │   ├── SafetyTips.jsx  # Safety & legal guidance
        │   │   ├── LegalRights.jsx # Legal rights information
        ├── components/
        │   ├── Navbar.jsx          # Navbar component
        │   ├── Footer.jsx          # Footer component
        │   ├── Sidebar.jsx         # Sidebar navigation
        ├── assets/                 # Images, icons, styles
        ├── utils/                  # Utility functions & helpers
        ├── api/                    # API calls (Axios)
        │   ├── auth.js             # Auth API calls
        │   ├── courses.js          # Courses API calls
        │   ├── community.js        # Community API calls
        │   ├── mentorship.js       # Mentorship API calls
        │   ├── business.js         # Business API calls
        │   ├── safety.js           # Safety API calls
```

## Features
- **User Authentication:** Secure login and registration with JWT authentication.
- **Education & Skill Development:** Courses and educational resources.
- **Community Support:** Forums and discussion spaces for networking.
- **Mentorship Program:** Users can connect with mentors for guidance.
- **Business & Funding Resources:** Support for entrepreneurship and financial aid.
- **Safety & Legal Guidance:** Resources to ensure women's safety and awareness.

## Installation
### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required variables (e.g., database URI, JWT secret).
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm run dev
   ```

## Technologies Used
- **Backend:** Node.js, Express, MongoDB
- **Frontend:** React, Context API, Axios
- **Authentication:** JWT
- **Deployment:** Cloud storage & hosting (TBD)

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

