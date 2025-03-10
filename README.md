# EmpowerHer - Women's Technology Platform

<div align="center"> 
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" /> 
  <img src="https://img.shields.io/badge/node-18.x-green.svg" /> 
  <img src="https://img.shields.io/badge/react-19.0.0-blue.svg" /> 
  <img src="https://img.shields.io/badge/mongodb-atlas-green.svg" /> 
  <img src="https://img.shields.io/badge/license-MIT-yellow.svg" /> 
</div> 

<p align="center"> 
  <img width="180" src="https://i.imgur.com/pSOxq3J.png" alt="EmpowerHer Logo"/> 
</p> 

<p align="center"> 
  🚀 A platform dedicated to empowering women in technology through education, mentorship, and community support. 
</p>

## ✨ Overview

EmpowerHer is a comprehensive web platform designed to bridge the gender gap in technology by providing women with the resources, support, and opportunities they need to thrive in tech careers. Our platform offers a variety of features including skill development resources, mentorship connections, job opportunities, financial guidance, safety information, and a supportive community of like-minded women.

## 🌟 Features

### 👩‍💻 Education & Career
- **Tech Jobs Board**: Browse and apply for women-friendly tech positions
- **Learning Resources**: Curated educational content for tech skill development
- **Career Guidance**: Expert advice on navigating tech careers

### 🤝 Community & Mentorship
- **Discussion Forums**: Connect with peers to share experiences and advice
- **Mentor Matching**: Find experienced mentors in your field of interest
- **Success Stories**: Inspiring stories from women who've excelled in tech

### 💰 Finance & Business
- **Financial Education**: Resources on budgeting, investing, and financial planning
- **Business Resources**: Support for women entrepreneurs in tech
- **Investment Tips**: Guidance on building financial security

### 🛡️ Safety & Legal
- **Legal Rights**: Information on workplace rights and protections
- **Safety Resources**: Personal safety tips and emergency contacts
- **Self-Defense Training**: Video resources on self-defense techniques

### 📱 Platform Features
- **Secure Authentication**: Role-based access with JWT authentication
- **Admin Dashboard**: Comprehensive management of platform content
- **Mobile Responsive**: Optimized experience across devices

## 🛠️ Technology Stack

### Backend
- **Node.js & Express**: Server-side framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT Authentication**: Secure user authentication
- **RESTful API**: Well-structured endpoints

### Frontend
- **React 19**: Modern UI library
- **React Router**: Client-side routing
- **Context API**: State management
- **Axios**: HTTP client for API requests

### External Services
- **Adzuna API**: Integration for job listings
- **YouTube Embeds**: Educational video content

## 📷 Screenshots

<div align="center"> 
  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=880" alt="Women in Tech" width="45%"/> 
  <img src="https://images.unsplash.com/photo-1574144113084-b6f450cc5e0d?q=80&w=880" alt="Community Discussion" width="45%"/> 
</div>

<div align="center"> 
  <img src="https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=880" alt="Financial Education" width="45%"/> 
  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=880" alt="Mentorship" width="45%"/> 
</div>

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB Account
- Adzuna API Key (for job listings)

### Steps to Install

1. Clone the repository
   ```bash
   git clone https://github.com/Tejaswini-41/SheCodes
   cd SheCodes

2. Install server dependencies

bash
Copy
Edit
cd server
npm install

3. Create .env file in the server directory with the following configuration:

ini
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_API_KEY=your_adzuna_api_key

4. Start the server
npm start

5. In the project root, navigate to the client directory and install client dependencies

cd client
npm install

6. Start the React application

npm run dev

💻 Folder Structure
EmpowerHer/
│
├── server/                   # Backend Node.js/Express app
│   ├── config/               # DB & configuration settings
│   ├── controllers/          # API controllers
│   ├── middleware/           # Custom middleware
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── services/             # Business logic
│   ├── schedulers/           # Recurring tasks
│   └── index.js              # Server entry point
│
└── client/                   # Frontend React app
    ├── public/               # Static assets
    └── src/
        ├── components/        # Reusable components
        ├── context/           # Context API state
        ├── hooks/             # Custom React hooks
        ├── pages/             # Page components
        │   ├── Admin/         # Admin dashboard pages
        │   ├── Auth/          # Login/Register pages
        │   ├── Blogs/         # Blog pages
        │   ├── Community/     # Community discussion pages
        │   ├── Dashboard/     # User dashboard pages
        │   ├── Finance/       # Financial resources pages
        │   ├── Mentorship/    # Mentorship program pages
        │   ├── Safety/        # Safety & legal resources pages
        │   └── Tech/          # Tech jobs & resources pages
        ├── utils/             # Utility functions
        ├── App.jsx            # Main component
        └── main.jsx           # Entry point

👩‍💻 Key Components

Dashboard
The dashboard provides users with a personalized experience including:
Daily inspirational quotes from women leaders
Latest job opportunities

Upcoming events
Recommended learning resources

Safety Resources
A comprehensive section offering:
Information on legal rights specific to women in the workplace

Emergency contacts and safety tips
Self-defense tutorial videos
State-specific legal information

Finance Education
Interactive financial education tools including:
Budgeting calculator based on the 50/30/20 rule

Investment guidance and tips
Banking essentials
Success stories from women who achieved financial independence

Community Discussions
A space for women to connect and share experiences:
Topic-based discussion threads
Professional networking opportunities
Ability to create and join conversations
Knowledge sharing across tech domains

🤝 Contributing
We welcome contributions to EmpowerHer! To contribute:

Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add some amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
Please ensure your code follows the project's coding standards and includes appropriate tests.

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgements
All the women pioneers in tech who inspire this platform
Adzuna API for job listing data
Font Awesome for beautiful icons
MongoDB Atlas for database hosting
<p align="center">Made with ❤️ for women on Behalf of Womens Day</p> 