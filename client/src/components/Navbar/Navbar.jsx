import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import ProfileModal from '../ProfileModal/ProfileModal';

const Navbar = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const moreDropdownRef = useRef(null);

  // Main navigation links with icons
  const mainLinks = [
    { to: "/dashboard", label: "Home", icon: "fa-home" },
    { to: "/dashboard/education", label: "Learn", icon: "fa-graduation-cap" },
    { to: "/dashboard/finance", label: "Finance", icon: "fa-chart-line" },
    { to: "/dashboard/safety", label: "Safety", icon: "fa-shield-alt" },
    { to: "/dashboard/leadership", label: "Lead", icon: "fa-users" },
    { to: "/dashboard/community", label: "Community", icon: "fa-comments" },
    { to: "/dashboard/blogs", label: "Blogs", icon: "fa-pen-fancy" }
  ];
  
  // More dropdown links
  const moreLinks = [
    { to: "/dashboard/tech", label: "Tech", icon: "fa-laptop-code" },
    { to: "/dashboard/health", label: "Health", icon: "fa-heartbeat" },
    { to: "/dashboard/entrepreneurship", label: "Business", icon: "fa-briefcase" }
  ];
  
  // Helper to check if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if any link in more dropdown is active
  const isMoreActive = () => {
    return moreLinks.some(link => isActive(link.to));
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setShowProfileModal(!showProfileModal);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMoreDropdown = (e) => {
    e.preventDefault();
    setShowMoreDropdown(!showMoreDropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(event.target)) {
        setShowMoreDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/dashboard">
            <img src="/Images/logo.png" alt="EmpowerHer Logo" className="brand-logo" />
            <span className="brand-text">EmpowerHer</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
        
        {/* Main navigation links - desktop */}
        <div className={`nav-container ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            {mainLinks.map((link, index) => (
              <li key={index}>
                <Link 
                  to={link.to} 
                  className={isActive(link.to) ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className={`fas ${link.icon}`}></i>
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
            <li className="more-dropdown" ref={moreDropdownRef}>
              <button onClick={toggleMoreDropdown} className={isMoreActive() ? 'active' : ''}>
                <i className="fas fa-ellipsis-h"></i>
                <span>More</span>
              </button>
              {showMoreDropdown && (
                <ul className="dropdown-menu">
                  {moreLinks.map((link, index) => (
                    <li key={index}>
                      <Link 
                        to={link.to} 
                        className={isActive(link.to) ? 'active' : ''}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setShowMoreDropdown(false);
                        }}
                      >
                        <i className={`fas ${link.icon}`}></i>
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
          
          <div className="nav-actions">
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
            <button className="profile-btn" onClick={handleProfileClick}>
              <i className="fas fa-user-circle"></i>
            </button>
          </div>
        </div>
      </nav>
      
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </>
  );
};

export default Navbar;