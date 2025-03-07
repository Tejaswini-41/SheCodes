import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import "./Safety.css";

const Safety = () => {
  const [activeTab, setActiveTab] = useState("laws");
  const [selectedState, setSelectedState] = useState("maharashtra");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLegalRights, setFilteredLegalRights] = useState({});

  const legalRights = {
    workplace: [
      {
        title: "Sexual Harassment of Women at Workplace Act, 2013",
        description: "Protection against workplace harassment",
        keyPoints: [
          "Mandatory Internal Complaints Committee",
          "90 days timeline for investigation",
          "Protection against retaliation",
          "Confidentiality provisions",
        ],
        helplineNumber: "1091",
      },
      // Add more workplace laws...
    ],
    domestic: [
      {
        title: "Protection of Women from Domestic Violence Act, 2005",
        description: "Legal protection against domestic violence",
        keyPoints: [
          "Right to reside in shared household",
          "Protection against physical/mental abuse",
          "Economic rights and maintenance",
          "Custody and compensation orders",
        ],
        helplineNumber: "181",
      },
      // Add more domestic laws...
    ],
    sexualAssault: [
      {
        title: "Criminal Law Amendment Act, 2013",
        description: "Strengthened laws against sexual offenses after the 2012 Delhi case",
        keyPoints: [
          "Expanded definition of rape beyond penetration",
          "Minimum 7 years imprisonment, extendable to life",
          "No character assassination of victim in court",
          "Recognition of acid attacks, voyeurism, and stalking as crimes"
        ],
        helplineNumber: "1098",
      },
      {
        title: "Rights of Sexual Assault Survivors",
        description: "Legal protections and entitlements for survivors",
        keyPoints: [
          "Right to file FIR at any police station (Zero FIR)",
          "Right to medical examination and treatment",
          "Right to confidentiality and privacy",
          "Right to free legal aid throughout the case",
          "Right to compensation under victim compensation schemes"
        ],
        helplineNumber: "7827-170-170",
      },
      {
        title: "POCSO Act, 2012",
        description: "Special law for sexual offenses against minors under 18",
        keyPoints: [
          "Child-friendly reporting and trial procedures",
          "Special courts for speedy trials",
          "Stringent punishments for offenders",
          "Support persons assigned to assist the child"
        ],
        helplineNumber: "1098 (Childline)",
      }
    ],
  };

  const emergencyContacts = [
    {
      name: "Women's Helpline",
      number: "1091",
      available: "24/7",
      type: "Emergency",
    },
    {
      name: "Domestic Violence Helpline",
      number: "181",
      available: "24/7",
      type: "Emergency",
    },
    // Add more emergency contacts...
  ];

  // Updated safetyTips array with more categories and detailed tips
  const [selectedTipCategory, setSelectedTipCategory] = useState("all");

  const safetyTips = [
    {
      id: "personal",
      category: "Personal Safety",
      tips: [
        "Stay aware of surroundings and avoid distractions like phones in public",
        "Share your location with trusted contacts when traveling alone",
        "Trust your instincts - if something feels wrong, remove yourself from the situation",
        "Keep emergency contacts on speed dial",
        "Use well-lit, populated routes when walking at night",
      ],
      icon: "fas fa-shield-alt",
      resource: {
        text: "Personal Safety Planning Guide",
        url: "https://www.thesafetybox.org/safety-awareness-tips-for-women-teens-and-girls",
      },
    },
    {
      id: "digital",
      category: "Digital Safety",
      tips: [
        "Use strong, unique passwords for all accounts",
        "Enable two-factor authentication where available",
        "Be cautious about sharing personal information online",
        "Regularly check privacy settings on social media accounts",
        "Be aware of location sharing in apps and photos",
      ],
      icon: "fas fa-laptop-code",
      resource: {
        text: "Digital Security Toolkit",
        url: "https://www.techsafety.org/resources-survivors",
      },
    },
    {
      id: "travel",
      category: "Travel Safety",
      tips: [
        "Research your destination thoroughly before traveling",
        "Share your itinerary with someone you trust",
        "Keep copies of important documents separate from originals",
        "Use transportation services with good reviews",
        "Stay in accommodations with secure entry systems and good ratings",
      ],
      icon: "fas fa-plane",
      resource: {
        text: "Safe Travel Checklist",
        url: "https://travel.state.gov/content/travel/en/international-travel/before-you-go/travelers-with-special-considerations/women-travelers.html",
      },
    },
    {
      id: "workplace",
      category: "Workplace Safety",
      tips: [
        "Know your company's harassment policies and reporting procedures",
        "Keep records of any concerning interactions",
        "Walk to your vehicle with colleagues after dark",
        "Be aware of emergency exits and procedures",
        "Report maintenance issues that could pose safety risks",
      ],
      icon: "fas fa-briefcase",
      resource: {
        text: "Workplace Rights Guide",
        url: "https://www.equalrights.org/issue/economic-workplace-equality/sexual-harassment/",
      },
    },
    {
      id: "public",
      category: "Public Transport Safety",
      tips: [
        "Wait for transport in well-lit, populated areas",
        "Sit near the driver or conductor when possible",
        "Keep valuables secure and out of sight",
        "Stay awake and alert during your journey",
        "Check that taxi/rideshare details match before entering",
      ],
      icon: "fas fa-bus",
      resource: {
        text: "Public Transit Safety Guide",
        url: "https://www.womenintransport.com/resources/personal-safety/",
      },
    },
    {
      id: "home",
      category: "Home Safety",
      tips: [
        "Install quality locks on all doors and windows",
        "Consider a security system or camera doorbell",
        "Never share on social media when your home will be empty",
        "Keep emergency contacts and local police numbers accessible",
        "Have a safety plan for emergencies",
      ],
      icon: "fas fa-home",
      resource: {
        text: "Home Security Checklist",
        url: "https://www.safety.com/home-safety-checklist/",
      },
    },
  ];

  const selfDefenseVideos = [
    {
      title: "Basic Self-Defense Moves Every Woman Should Know",
      instructor: "Sarah Chen",
      duration: "10 mins",
      thumbnail: "https://img.youtube.com/vi/KVpxP3ZZtAc/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=KVpxP3ZZtAc",
    },
    {
      title: "5 Self-Defense Moves Every Woman Should Know",
      instructor: "Roxanne Jones",
      duration: "8 mins",
      thumbnail: "https://img.youtube.com/vi/T7aNSRoDCmg/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=T7aNSRoDCmg",
    },
    {
      title: "Self Defense for Women - 10 Techniques",
      instructor: "Michelle Lee",
      duration: "12 mins",
      thumbnail: "https://img.youtube.com/vi/Gx3_x6RH1J4/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=Gx3_x6RH1J4",
    },
    {
      title: "Women's Self-Defense Techniques",
      instructor: "Priya Sharma",
      duration: "7 mins",
      thumbnail: "https://img.youtube.com/vi/9qyD7vjVfLI/hqdefault.jpg",
      videoUrl: "https://www.youtube.com/watch?v=9qyD7vjVfLI",
    },
    {
      title: "Self-Defense in Confined Spaces",
      instructor: "Tara Wilson",
      duration: "15 mins",
      thumbnail: "https://img.youtube.com/vi/9m-x64bKfR4/hqdefault.jpg", // Updated to match video ID
      videoUrl: "https://youtu.be/9m-x64bKfR4?si=a1He4kT5T43n-wWB",
    },
    {
      title: "How to Defend Against Common Attacks",
      instructor: "Alicia Rodriguez",
      duration: "9 mins",
      thumbnail: "https://img.youtube.com/vi/q1pBBRi3XF8/hqdefault.jpg",
      videoUrl: "https://youtu.be/q1pBBRi3XF8?si=HiRrzuQMUUMypXV6",
    },
  ];

  // Filter legal rights when search query or state changes
  useEffect(() => {
    // Create a copy of the original legal rights
    const filterLegalData = () => {
      const filtered = {};
      
      // Filter each category
      Object.keys(legalRights).forEach(category => {
        filtered[category] = legalRights[category].filter(law => {
          // Check if the law matches the search query in title, description or key points
          const matchesSearch = searchQuery === '' || 
            law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            law.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            law.keyPoints.some(point => point.toLowerCase().includes(searchQuery.toLowerCase()));
          
          // In a real app, you would filter by state here too
          // For now, we'll assume all laws apply to the selected state
          const matchesState = true;
          
          return matchesSearch && matchesState;
        });
      });
      
      return filtered;
    };
    
    setFilteredLegalRights(filterLegalData());
  }, [searchQuery, selectedState]);

  return (
    <div className="safety-container">
      <Navbar />
      <div className="safety-page">
        <div className="safety-hero">
          <h1>Know Your Rights, Stay Safe</h1>
          <p>Comprehensive guide to women's legal rights and safety</p>

          <div className="emergency-banner">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Emergency? Call Women's Helpline: 1091</span>
            <button className="sos-btn">SOS Alert</button>
          </div>
        </div>

        <div className="safety-navigation">
          <button
            className={`nav-btn ${activeTab === "laws" ? "active" : ""}`}
            onClick={() => setActiveTab("laws")}
          >
            Legal Rights
          </button>
          {/* <button
            className={`nav-btn ${activeTab === "emergency" ? "active" : ""}`}
            onClick={() => setActiveTab("emergency")}
          >
            Emergency Help
          </button> */}
          <button
            className={`nav-btn ${activeTab === "selfDefense" ? "active" : ""}`}
            onClick={() => setActiveTab("selfDefense")}
          >
            Self Defense
          </button>
          <button
            className={`nav-btn ${activeTab === "resources" ? "active" : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
        </div>

        {activeTab === "laws" && (
          <section className="legal-rights-section">
            <div className="search-filters">
              <input
                type="text"
                placeholder="Search legal information..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="state-select"
              >
                <option value="maharashtra">Maharashtra</option>
                <option value="delhi">Delhi</option>
                <option value="karnataka">Karnataka</option>
                <option value="tamilnadu">Tamil Nadu</option>
                <option value="allstates">All States</option>
              </select>
            </div>

            {/* Show count of filtered results */}
            <div className="filter-results-info">
              {Object.values(filteredLegalRights).reduce((total, laws) => total + laws.length, 0)} laws found
              {searchQuery && <span> matching "{searchQuery}"</span>}
              {selectedState !== 'allstates' && <span> in {selectedState}</span>}
              {(searchQuery || selectedState !== 'allstates') && (
                <button 
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedState('allstates');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </div>

            {Object.values(filteredLegalRights).every(laws => laws.length === 0) ? (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <h3>No laws found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="laws-grid">
                {filteredLegalRights.workplace && filteredLegalRights.workplace.length > 0 && (
                  <div className="workplace-laws">
                    <h2><i className="fas fa-briefcase"></i> Workplace Rights</h2>
                    {filteredLegalRights.workplace.map((law, index) => (
                      <div key={index} className="law-card">
                        <div className="law-card-header">
                          <h3>{law.title}</h3>
                          <span className="law-year">2013</span>
                        </div>
                        <p className="law-description">{law.description}</p>
                        <ul className="key-points">
                          {law.keyPoints.map((point, i) => (
                            <li key={i}>
                              <i className="fas fa-check-circle"></i> {point}
                            </li>
                          ))}
                        </ul>
                        <div className="helpline">
                          Helpline: <strong>{law.helplineNumber}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {filteredLegalRights.domestic && filteredLegalRights.domestic.length > 0 && (
                  <div className="domestic-laws">
                    <h2><i className="fas fa-home"></i> Domestic Rights</h2>
                    {filteredLegalRights.domestic.map((law, index) => (
                      <div key={index} className="law-card">
                        <div className="law-card-header">
                          <h3>{law.title}</h3>
                          <span className="law-year">2005</span>
                        </div>
                        <p className="law-description">{law.description}</p>
                        <ul className="key-points">
                          {law.keyPoints.map((point, i) => (
                            <li key={i}>
                              <i className="fas fa-check-circle"></i> {point}
                            </li>
                          ))}
                        </ul>
                        <div className="helpline">
                          Helpline: <strong>{law.helplineNumber}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {filteredLegalRights.sexualAssault && filteredLegalRights.sexualAssault.length > 0 && (
                  <div className="sexual-assault-laws">
                    <h2><i className="fas fa-gavel"></i> Sexual Assault & Rape Laws</h2>
                    {filteredLegalRights.sexualAssault.map((law, index) => (
                      <div key={index} className="law-card">
                        <div className="law-card-header">
                          <h3>{law.title}</h3>
                          <span className="law-year">
                            {law.title.includes("2013") ? "2013" : 
                             law.title.includes("2012") ? "2012" : ""}
                          </span>
                        </div>
                        <p className="law-description">{law.description}</p>
                        <ul className="key-points">
                          {law.keyPoints.map((point, i) => (
                            <li key={i}>
                              <i className="fas fa-check-circle"></i> {point}
                            </li>
                          ))}
                        </ul>
                        <div className="helpline">
                          Helpline: <strong>{law.helplineNumber}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {activeTab === "emergency" && (
          <section className="emergency-section">
            <div className="emergency-map">
              <h2>Nearby Safe Places</h2>
              {/* Add interactive map component */}
              <div className="map-placeholder">
                Map showing police stations, hospitals, and safe zones
              </div>
            </div>

            <div className="emergency-contacts">
              <h2>Emergency Contacts</h2>
              <div className="contacts-grid">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="contact-card">
                    <h3>{contact.name}</h3>
                    <div className="contact-number">
                      <i className="fas fa-phone"></i>
                      {contact.number}
                    </div>
                    <span className="availability">{contact.available}</span>
                    <button className="call-btn">Call Now</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {activeTab === "selfDefense" && (
          <section className="self-defense-section">
            <div className="video-tutorials">
              <h2>Self-Defense Tutorials</h2>
              <div className="videos-grid">
                {selfDefenseVideos.map((video, index) => (
                  <div
                    key={index}
                    className="video-card"
                    onClick={() => window.open(video.videoUrl, "_blank")}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="video-thumbnail">
                      <img src={video.thumbnail} alt={video.title} />
                      <div className="play-button">
                        <i className="fas fa-play"></i>
                      </div>
                    </div>
                    <div className="video-info">
                      <h3>{video.title}</h3>
                      <p>{video.instructor}</p>
                      <span>{video.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="safety-tips">
              <h2>Personal Safety Tips & Strategies</h2>
              <p className="section-description">
                Expert-recommended safety practices for various situations
              </p>

              <div className="tips-categories">
                <button
                  className={`category-filter ${
                    selectedTipCategory === "all" ? "active" : ""
                  }`}
                  onClick={() => setSelectedTipCategory("all")}
                >
                  All Tips
                </button>
                {safetyTips.map((category, i) => (
                  <button
                    key={i}
                    className={`category-filter ${
                      selectedTipCategory === category.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedTipCategory(category.id)}
                  >
                    <i className={category.icon}></i> {category.category}
                  </button>
                ))}
              </div>

              <div className="tips-grid">
                {safetyTips
                  .filter(
                    (category) =>
                      selectedTipCategory === "all" ||
                      selectedTipCategory === category.id
                  )
                  .map((category, index) => (
                    <div key={index} className={`tips-card ${category.id}`}>
                      <div className="tips-header">
                        <div className="tips-icon">
                          <i className={category.icon}></i>
                        </div>
                        <h3>{category.category}</h3>
                        <span className="tip-count">
                          {category.tips.length} Tips
                        </span>
                      </div>
                      <div className="tips-content">
                        <ul>
                          {category.tips.map((tip, i) => (
                            <li key={i}>
                              <span className="tip-bullet">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                        {category.resource && (
                          <div className="resource-link">
                            <a
                              href={category.resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <i className="fas fa-external-link-alt"></i>{" "}
                              {category.resource.text}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}
{activeTab === "resources" && (
  <section className="resources-section">
    <div className="helplines-resources">
      <h2>Women's Helpline Numbers</h2>
      <p className="section-description">24/7 support services available across India</p>
      
      <div className="helplines-grid">
        <div className="helpline-card">
          <div className="helpline-icon">
            <i className="fas fa-female"></i>
          </div>
          <h3>National Commission for Women (NCW)</h3>
          <div className="helpline-number">7827 170 170</div>
          <p>24/7 support for violence against women, online support, and referrals to authorities</p>
          <div className="helpline-actions">
            <a href="tel:7827170170" className="call-now-btn">
              <i className="fas fa-phone"></i> Call Now
            </a>
            <a href="https://ncwwomenhelpline.in/" target="_blank" rel="noopener noreferrer" className="visit-site-btn">
              <i className="fas fa-external-link-alt"></i> Website
            </a>
          </div>
        </div>
        
        <div className="helpline-card">
          <div className="helpline-icon">
            <i className="fas fa-child"></i>
          </div>
          <h3>Women Helpline (All India)</h3>
          <div className="helpline-number">181</div>
          <p>Ministry of Women & Child Development's 24/7 toll-free helpline for women in distress</p>
          <div className="helpline-actions">
            <a href="tel:181" className="call-now-btn">
              <i className="fas fa-phone"></i> Call Now
            </a>
            <a href="https://wcd.nic.in/" target="_blank" rel="noopener noreferrer" className="visit-site-btn">
              <i className="fas fa-external-link-alt"></i> Website
            </a>
          </div>
        </div>
        
        <div className="helpline-card">
          <div className="helpline-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3>Police Emergency</h3>
          <div className="helpline-number">100</div>
          <p>For immediate police assistance in emergency situations</p>
          <div className="helpline-actions">
            <a href="tel:100" className="call-now-btn">
              <i className="fas fa-phone"></i> Call Now
            </a>
          </div>
        </div>
        
        <div className="helpline-card">
          <div className="helpline-icon">
            <i className="fas fa-ambulance"></i>
          </div>
          <h3>Emergency Response Support System</h3>
          <div className="helpline-number">112</div>
          <p>Unified emergency number for police, fire, or medical services</p>
          <div className="helpline-actions">
            <a href="tel:112" className="call-now-btn">
              <i className="fas fa-phone"></i> Call Now
            </a>
          </div>
        </div>
        
        <div className="helpline-card">
          <div className="helpline-icon">
            <i className="fas fa-hands-helping"></i>
          </div>
          <h3>Delhi Commission for Women</h3>
          <div className="helpline-number">181</div>
          <p>Delhi-specific 24/7 helpline for women in distress</p>
          <div className="helpline-actions">
            <a href="tel:181" className="call-now-btn">
              <i className="fas fa-phone"></i> Call Now
            </a>
          </div>
        </div>
        
        <div className="helpline-card">
          <div className="helpline-icon">
            <i className="fas fa-home"></i>
          </div>
          <h3>Domestic Violence Helpline</h3>
          <div className="helpline-number">181</div>
          <p>Support for victims of domestic violence and abuse</p>
          <div className="helpline-actions">
            <a href="tel:181" className="call-now-btn">
              <i className="fas fa-phone"></i> Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
)}

        <section className="safety-community">
          <h2>Join Our Safety Network</h2>
          <p>Connect with other women and share safety tips</p>
          <button className="join-network-btn">Join Community</button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Safety;
