import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Entrepreneurship.css';

const Entrepreneurship = () => {
  const [activeTab, setActiveTab] = useState('leaders');

  const mentors = [
    {
      name: "Indra Nooyi",
      role: "Former CEO, PepsiCo",
      expertise: ["Leadership", "Global Business", "Strategy"],
      availability: "2 slots available",
      image: "/Images/mentors/indra.jpg"
    },
    {
      name: "Sarah Chen",
      role: "VC & Fund Manager",
      expertise: ["Venture Capital", "Startups", "Fundraising"],
      availability: "Available for mentoring",
      image: "/Images/mentors/sarah.jpg"
    }
  ];

  const opportunities = [
    {
      title: "Women Entrepreneurs Fund",
      organization: "Global Impact Ventures",
      amount: "$50,000",
      deadline: "April 30, 2025",
      type: "Grant",
      eligibility: ["Women-owned business", "Tech startups", "Early-stage"],
      link: "https://opportunitiesforyouth.org/2023/09/24/funding-opportunities-for-organizations-interested-in-making-a-meaningful-impact/"
    },
    {
      title: "Startup Accelerator Program",
      organization: "TechStars Women",
      amount: "$120,000",
      deadline: "May 15, 2025",
      type: "Investment",
      eligibility: ["Tech startups", "Female founders", "MVP ready"],
      link: "https://www.startupindia.gov.in/content/sih/en/women_entrepreneurs.html"
    },
    {
      title: "DPIIT Women Entrepreneurship Program",
      organization: "Startup India",
      amount: "₹5,00,000",
      deadline: "June 30, 2025",
      type: "Grant",
      eligibility: ["Indian Women Entrepreneurs", "Registered Business", "Innovation Focus"],
      link: "https://www.startupindia.gov.in/content/sih/en/government-schemes.html"
    },
    {
      title: "NITI Aayog Women Transform",
      organization: "Government of India",
      amount: "₹10,00,000",
      deadline: "July 15, 2025",
      type: "Grant + Mentorship",
      eligibility: ["Women-led startups", "Social Impact", "Technology Focus"],
      link: "https://wep.gov.in/"
    }
  ];

  const businessLeaders = [
    {
      name: "Nirmala Sitharaman",
      role: "Finance Minister of India",
      company: "Government of India",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMyyRuxuPKjQOr0sCIXaMwAuBJdDzTnH9vRg&s",
      description: "First full-time female Finance Minister of India. Known for her strategic economic policies and reforms.",
      achievements: [
        "Union Finance Minister since 2019",
        "Listed in Forbes' 100 most powerful women",
        "Key role in economic reforms",
        "Former Defence Minister of India"
      ]
    },
    {
      name: "Nita Ambani",
      role: "Founder & Chairperson",
      company: "Reliance Foundation",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQINZf4irIJR7onj-2O3GE3jgJ5SyocQeSLsw&s",
      description: "A business leader, sports administrator, and philanthropist who has transformed education and sports in India.",
      achievements: [
        "First Indian woman to become IOC member",
        "Revolutionized Indian sports ecosystem",
        "Leading force behind Reliance Foundation",
        "Pioneer in educational initiatives"
      ]
    },
    {
      name: "Namita Thapar",
      role: "Executive Director",
      company: "Emcure Pharmaceuticals",
      image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRU5Ac5iG_y-jz1quwSSb6VlQrNmp_7-3Z9YHbiCAcG1V9fuKZPLWp5MvqeUIr_39COGJ1KLxUuXqyP_Fd1uiJBnuYFXWuRRJ4I8DZ1Kg",
      description: "Leading voice in Indian pharmaceutical industry and champion of women entrepreneurship.",
      achievements: [
        "Executive Director of Emcure Pharmaceuticals",
        "CEO of Emcure Pharmaceuticals",
        "Shark Tank India judge",
        "Young Global Leader - World Economic Forum",
        "Advocate for women's health and entrepreneurship",
        "Recipient of multiple business awards"
      ]
    },
    {
      name: "Vineeta Singh",
      role: "CEO & Co-founder",
      company: "SUGAR Cosmetics",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4Eplr6JQDKa20tjSX5-eWnI_9AlP8bLSLTQ&s",
      description: "CEO & Co-founder of SUGAR Cosmetics, one of India's fastest-growing beauty brands, focusing on millennial women.",
      achievements: [
        "Forbes 30 Under 30",
        "Shark Tank India Judge"
      ]
    }
  ];

  return (
    <div className="entrepreneurship-container">
      <Navbar />
      <div className="entrepreneurship-page">
        <div className="entrepreneurship-hero">
          <h1>Women in Business</h1>
          <p>Resources, funding, and support for women entrepreneurs</p>
        </div>

        <div className="quick-stats">
          <div className="stat-card">
            <i className="fas fa-users"></i>
            <h3>10,000+</h3>
            <p>Women Entrepreneurs</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-hand-holding-usd"></i>
            <h3>$5M+</h3>
            <p>Funding Secured</p>
          </div>
          <div className="stat-card">
            <i className="fas fa-building"></i>
            <h3>500+</h3>
            <p>Successful Startups</p>
          </div>
        </div>

        <div className="content-tabs">
          {/* <button
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
          <button
            className={`tab-btn ${activeTab === 'mentorship' ? 'active' : ''}`}
            onClick={() => setActiveTab('mentorship')}
          >
            Mentorship
          </button> */}
          <button
            className={`tab-btn ${activeTab === 'leaders' ? 'active' : ''}`}
            onClick={() => setActiveTab('leaders')}
          >
            Business Leaders
          </button>
          <button
            className={`tab-btn ${activeTab === 'funding' ? 'active' : ''}`}
            onClick={() => setActiveTab('funding')}
          >
            Funding
          </button>
        </div>

        {/* {activeTab === 'resources' && (
          <section className="resources-section">
            <h2>Business Resources</h2>
            <div className="resources-grid">
              {resources.map((resource, index) => (
                <div key={index} className="resource-card">
                  <div className="resource-icon">
                    <i className={resource.icon}></i>
                    <span className="resource-type">{resource.type}</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-meta">
                    <span>{resource.downloads} downloads</span>
                    <button className="download-btn">Download</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )} */}

        {activeTab === 'mentorship' && (
          <section className="mentorship-section">
            <h2>Expert Mentors</h2>
            <div className="mentors-grid">
              {mentors.map((mentor, index) => (
                <div key={index} className="mentor-card">
                  <img src={mentor.image} alt={mentor.name} />
                  <div className="mentor-info">
                    <h3>{mentor.name}</h3>
                    <p className="mentor-role">{mentor.role}</p>
                    <div className="expertise-tags">
                      {mentor.expertise.map((skill, i) => (
                        <span key={i} className="expertise-tag">{skill}</span>
                      ))}
                    </div>
                    <span className="availability">{mentor.availability}</span>
                    <button className="connect-btn">Schedule Call</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'funding' && (
          <section className="funding-section">
            <h2>Funding Opportunities</h2>
            <div className="opportunities-grid">
              {opportunities.map((opportunity, index) => (
                <div key={index} className="opportunity-card">
                  <div className="opportunity-header">
                    <h3>{opportunity.title}</h3>
                    <span className="opportunity-type">{opportunity.type}</span>
                  </div>
                  <div className="opportunity-details">
                    <p className="organization">{opportunity.organization}</p>
                    <p className="amount">{opportunity.amount}</p>
                    <div className="eligibility">
                      <h4>Eligibility:</h4>
                      <ul>
                        {opportunity.eligibility.map((criteria, i) => (
                          <li key={i}>{criteria}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="deadline">Deadline: {opportunity.deadline}</p>
                    <a
                      href={opportunity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="apply-btn"
                    >
                      Apply Now <i className="fas fa-external-link-alt"></i>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'leaders' && (
          <section className="leaders-section">
            <h2>Women Business Leaders</h2>
            <div className="leaders-grid">
              {businessLeaders.map((leader, index) => (
                <div key={index} className="leader-card">
                  <div className="leader-image">
                    <img src={leader.image} alt={leader.name} />
                  </div>
                  <div className="leader-info">
                    <h2>{leader.name}</h2>
                    <h3>{leader.role}</h3>
                    <h4>{leader.company}</h4>
                    <p>{leader.description}</p>
                    <div className="achievements">
                      <h4>Key Achievements:</h4>
                      <ul>
                        {leader.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="cta-section">
          <h2>Start Your Business Journey</h2>
          <p>Get personalized guidance and support for your startup</p>
          <button className="schedule-call-btn">Schedule Free Consultation</button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Entrepreneurship;