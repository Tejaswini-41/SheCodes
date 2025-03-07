import React, { useState, useContext } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import Events from './components/Events';
import Mentorship from './components/Mentorship';
import Discussions from './components/Discussions';
import './Community.css';

const Community = () => {
  const [activeTab, setActiveTab] = useState("mentorship");
  const { user } = useContext(AuthContext);
  
  // Check if user is logged in and has a role
  const isAdmin = user && user.role === 'admin';
  const isLoggedIn = !!user;

  return (
    <div className="community-container">
      <Navbar/>
      <h1>Our Community</h1>
      
      <div className="tabs">
        <button 
          className={activeTab === "discussions" ? "active" : ""} 
          onClick={() => setActiveTab("discussions")}
        >
          Discussions
        </button>
        <button 
          className={activeTab === "mentorship" ? "active" : ""} 
          onClick={() => setActiveTab("mentorship")}
        >
          Mentorship
        </button>
        <button 
          className={activeTab === "events" ? "active" : ""} 
          onClick={() => setActiveTab("events")}
        >
          Events
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === "discussions" && <Discussions isAdmin={isAdmin} isLoggedIn={isLoggedIn} />}
        {activeTab === "mentorship" && <Mentorship isAdmin={isAdmin} isLoggedIn={isLoggedIn} />}
        {activeTab === "events" && <Events isAdmin={isAdmin} isLoggedIn={isLoggedIn} />}
      </div>
    </div>
  );
};

export default Community;