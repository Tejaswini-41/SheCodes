import React, { useState, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { AuthContext } from '../../context/AuthContext';
import Events from './components/Events';
import Mentorship from './components/Mentorship';
import Discussions from './components/Discussions';
import './Community.css';

const Community = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("mentorship");
  
  // Check if user is logged in and has a role
  const isAdmin = user?.role === 'admin';

  
  return (
    <div className="community-container">
      <Navbar />
      <div className="community-page">
        <div className="community-hero">
          <h1>Our Community</h1>
          <p>Connect, Share, and Grow Together</p>
        </div>

        <div className="community-navigation">
          <button 
            className={`nav-btn ${activeTab === "discussions" ? 'active' : ''}`} 
            onClick={() => setActiveTab("discussions")}
          >
            Discussions
          </button>
          <button 
            className={`nav-btn ${activeTab === "mentorship" ? 'active' : ''}`} 
            onClick={() => setActiveTab("mentorship")}
          >
            Mentorship
          </button>
          <button 
            className={`nav-btn ${activeTab === "events" ? 'active' : ''}`} 
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
        </div>

        <div className="tab-content">
        {activeTab === "discussions" && <Discussions isAdmin={isAdmin} isLoggedIn={isAuthenticated} />}
        {activeTab === "mentorship" && <Mentorship isAdmin={isAdmin} isLoggedIn={isAuthenticated} />}
        {activeTab === "events" && <Events />}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Community;