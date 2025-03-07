import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Leadership.css';

const Leadership = () => {
  const [activeTab, setActiveTab] = useState('inspiration');

  const leaderSpotlights = [
    {
      name: "Falguni Nayar",
      role: "Founder & CEO, Nykaa",
      image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSbE7x4MzDqFMkKcKAhgNHZ_hLtNBnpA-S5pKMpihU28onujnecjOud1oZHiVGQ924bTJIzE8H4bUSsZ-5gPUGpNIwEQtwDwlT8QhZkh5Y",
      quote: "Age is just a number when it comes to entrepreneurship.",
      achievements: [
        "Built India's leading beauty retail platform",
        "Former investment banker turned entrepreneur",
        "Created a billion-dollar beauty empire"
      ]
    },
    {
      name: "Tejaswini Durge",
      role: "Student at VIIT",
      image: "https://media.licdn.com/dms/image/v2/D4D22AQE3t-Ga8sfKYA/feedshare-shrink_800/B4DZVVK5tBGcAg-/0/1740890726030?e=1744243200&v=beta&t=47heRQ2TDbDXqtCXFJ53_zHMsf_cGNUIBvR_MNrq20k",
      quote: "Leadership is not about being in charge. It is about taking care of those in your charge.",
      achievements: [
        "Batch Representative",
        "AI Enthusiast"
      ]
    },
    {
      name: "Gauri Karkhile",
      role: "Student at VIIT",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOsQSa4kYWSDV0gE9hhLhhx1enDsiLHlQ9AdyqWU_fA1XVND0e6VHbMlaceOIGeT7YnnQ&usqp=CAU",
      quote: "The best way to predict the future is to create it.",
      achievements: [
        "Active participant in college events",
        "Aspiring leader"
      ]
    },
    {
      name: "Sanika Boke",
      role: "Student at VIIT",
      image: "https://media.licdn.com/dms/image/v2/D4D22AQGG8B0UuwZBzA/feedshare-shrink_1280/B4DZVR40rjG8Ao-/0/1740835612236?e=1744243200&v=beta&t=IFNO7MiInGKGPODDkT6a_fQukxq5uCyKZQGRrMe2OCA",
      quote: "Success is not the key to happiness. Happiness is the key to success.",
      achievements: [
        "Member of various student clubs",
        "Leadership enthusiast"
      ]
    }
  ];

  const leadershipPrograms = [
    {
      title: "Katalyst India Leadership Program",
      description: "Transforming women from low-income communities into professionals through education, training, and mentorship.",
      duration: "4 years (undergraduate support)",
      format: "Hybrid",
      startDate: "June 15, 2024",
      eligibility: "Female students from low-income families pursuing STEM education",
      topics: [
        "Professional Development",
        "Personality Development",
        "Technical Skills Enhancement",
        "Industry Exposure"
      ],
      mentor: "Katalyst India Faculty",
      website: "https://www.katalystindia.org/",
      logo: "https://katalystindia.org/wp-content/uploads/2022/08/Katalyst-New-Logo.png"
    },
    {
      title: "Kiran Girls Scholarship Program",
      description: "Supporting talented girls from economically disadvantaged backgrounds to pursue higher education.",
      duration: "Entire degree duration",
      format: "Financial Support & Mentoring",
      startDate: "Applications open April 1, 2024",
      eligibility: "Girl students with excellent academic records and financial need",
      topics: [
        "Financial Support for Education",
        "Career Guidance",
        "Personal Development",
        "Leadership Training"
      ],
      mentor: "Persistance Systems Mentors",
      website: "https://www.persistentfoundation.org/work/education/kiran-girls-scholarship-and-mentoring-program/scholarship-program-details/",
      logo: "https://www.persistentfoundation.org/wp-content/uploads/2024/08/persistent-foundation-15-year-logo.svg"
    },
    {
      title: "Women in Tech Leadership Academy",
      description: "Empowering women professionals to take on leadership roles in the technology sector.",
      duration: "12 weeks",
      format: "Online with weekend workshops",
      startDate: "May 10, 2024",
      eligibility: "Women with 3+ years experience in tech industry",
      topics: [
        "Technical Leadership",
        "Strategic Decision Making",
        "Building High-Performance Teams",
        "Navigating Gender Bias in Tech"
      ],
      mentor: "Industry Leaders from Google, Microsoft, and Amazon",
      website: "https://wit-ace.com/lead-program/",
      logo: "https://women-in-tech.org/wp-content/uploads/2023/12/womenintech-logo-2024.png"
    },
    {
      title: "TechWomen Rising Stars Program",
      description: "Accelerating the careers of women in technology through skill development and mentorship.",
      duration: "6 months",
      format: "Virtual Learning & Networking",
      startDate: "July 1, 2024",
      eligibility: "Early to mid-career women in technology fields",
      topics: [
        "Technical Skill Enhancement",
        "Career Navigation Strategies",
        "Building Professional Network",
        "Public Speaking and Presentation Skills"
      ],
      mentor: "Senior Women Leaders from Tech Industry",
      website: "https://anitab.org/our-programs/",
      logo: "https://anitab.org/wp-content/uploads/2022/08/AnitaB-logo.png"
    },
    {
      title: "SHEROES Leadership Accelerator",
      description: "India's women-only community platform offering leadership development for aspiring women leaders.",
      duration: "8 weeks",
      format: "Online Cohort-based",
      startDate: "April 20, 2024",
      eligibility: "Women professionals with 2+ years of work experience",
      topics: [
        "Personal Branding",
        "Communication and Influence",
        "Financial Leadership",
        "Work-Life Integration"
      ],
      mentor: "SHEROES Community Leaders",
      website: "https://sheroes.com/",
      logo: "https://img.sheroes.in/img/uploads/sheroespage/logoes/1654152493sheroes-logo-red.png"
    },
    {
      title: "NSR Foundation Women's Leadership Fellowship",
      description: "Supporting women from underrepresented backgrounds to become future leaders through education and mentorship.",
      duration: "1 year",
      format: "Hybrid with residential components",
      startDate: "August 15, 2024",
      eligibility: "Undergraduate women students from tier-2/3 cities",
      topics: [
        "Project Management",
        "Community Leadership",
        "Social Impact Assessment",
        "Fundraising and Resource Mobilization"
      ],
      mentor: "Dr. Ranjana Kumar & NSR Foundation Team",
      website: "https://www.nsrfoundation.org/",
      logo: "https://www.nsrfoundation.org/wp-content/themes/nsr-foundation/images/logo.png"
    }
  ];

  return (
    <div className="leadership-container">
      <Navbar />
      <div className="leadership-page">
        <div className="leadership-hero">
          <h1>Women in Leadership</h1>
          <p>Inspiring the next generation of women leaders</p>
        </div>

        <div className="leadership-navigation">
          <button 
            className={`nav-btn ${activeTab === 'inspiration' ? 'active' : ''}`}
            onClick={() => setActiveTab('inspiration')}
          >
            Inspiring Leaders
          </button>
          <button 
            className={`nav-btn ${activeTab === 'programs' ? 'active' : ''}`}
            onClick={() => setActiveTab('programs')}
          >
            Leadership Programs
          </button>
        </div>

        {activeTab === 'inspiration' && (
          <section className="leader-spotlights">
            <h2>Leader Spotlights</h2>
            <div className="leaders-grid">
              {leaderSpotlights.map((leader, index) => (
                <div key={index} className="leader-card">
                  <div className="leader-image">
                    <img src={leader.image} alt={leader.name} />
                  </div>
                  <div className="leader-info">
                    <h3>{leader.name}</h3>
                    <span className="leader-role">{leader.role}</span>
                    <blockquote className="leader-quote">{leader.quote}</blockquote>
                    <div className="achievements">
                      <h4>Key Achievements</h4>
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

        {activeTab === 'programs' && (
          <section className="leadership-programs">
            <h2>Leadership Development Programs</h2>
            <p className="section-description">
              Explore these opportunities to develop your leadership skills and advance your career
            </p>
            
            <div className="programs-grid">
              {leadershipPrograms.map((program, index) => (
                <div key={index} className="program-card">
                  <div className="program-header">
                    <div className="program-logo">
                      {program.logo && (
                        <img 
                          src={program.logo} 
                          alt={`${program.title} logo`} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/logo-placeholder.png"; // Add a placeholder image to your public folder
                            e.target.style.opacity = "0.7";
                          }}
                        />
                      )}
                    </div>
                    <h3>{program.title}</h3>
                    <span className="program-format">{program.format}</span>
                  </div>
                  <div className="program-details">
                    <p className="program-description">{program.description}</p>
                    <div className="program-info">
                      <p><i className="far fa-clock"></i> {program.duration}</p>
                      <p><i className="far fa-calendar"></i> Starts {program.startDate}</p>
                      <p><i className="fas fa-user-check"></i> Eligibility: {program.eligibility}</p>
                      <p><i className="fas fa-chalkboard-teacher"></i> Mentors: {program.mentor}</p>
                    </div>
                    <div className="program-topics">
                      <h4>Key Focus Areas</h4>
                      <ul>
                        {program.topics.map((topic, i) => (
                          <li key={i}><i className="fas fa-check-circle"></i> {topic}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="program-actions">
                      <a href={program.website} target="_blank" rel="noopener noreferrer" className="visit-site-btn">
                        <i className="fas fa-external-link-alt"></i> Visit Website
                      </a>
                      <button className="enroll-btn">Apply Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="programs-note">
              <h3><i className="fas fa-lightbulb"></i> Looking for more opportunities?</h3>
              <p>These programs are updated regularly. Check back often or join our network to get notified about new leadership opportunities.</p>
            </div>
          </section>
        )}

        <section className="community-cta">
          <h2>Join Our Leadership Community</h2>
          <p>Connect with ambitious women leaders and grow together</p>
          <button className="join-btn">Join Network</button>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Leadership;