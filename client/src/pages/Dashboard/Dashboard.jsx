import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const featuresScrollRef = useRef(null);
  
  const dailyThoughts = [
    { quote: "The question isn't who's going to let me; it's who is going to stop me.", author: "Ayn Rand" },
    { quote: "I have learned over the years that when one's mind is made up, this diminishes fear.", author: "Rosa Parks" },
    { quote: "We need to accept that we won't always make the right decisions, that we'll screw up royally sometimes.", author: "Arianna Huffington" },
    { quote: "Think like a queen. A queen is not afraid to fail.", author: "Oprah Winfrey" },
    { quote: "We need to reshape our own perception of how we view ourselves.", author: "Beyoncé" },
  ];

  const leadingLadies = [
    {
      "name": "Sudha Murthy",
      "role": "Author, Philanthropist & Entrepreneur",
      "image": "/Images/L1.png",
      "description": "A trailblazing social reformer, empowering women through education, philanthropy, and technology-driven initiatives."
    },
    
    {
      "name": "Shraddha Khapra",
      "role": "Co-Founder of Apna College & Educator",
      "image": "/Images/L2.png",
      "description": "Inspiring millions by making tech education accessible and empowering students to build strong careers in software development."
    }
    ,
    {
      "name": "Priyanka Chopra",
      "role": "Actress, Entrepreneur & Philanthropist",
      "image": "/Images/L3.png",
      "description": "A global icon advocating for women's rights, education, and entrepreneurship while breaking barriers in entertainment and business."
    }
    ,
    {
      "name": "Shruti Deshmukh",
      "role": "IAS Officer & Inspiration for Aspirants",
      "image": "/Images/L4.png",
      "description": "A dedicated civil servant empowering communities, advocating for women's rights, and inspiring future UPSC aspirants."
    }
    
  ];

  const sponsors = [
    {
      name: "Katalyst India",
      logo: "/Images/S1.png",
      link: "https://katalystindia.org/"
    },
    {
      name: "snehalaya",
      logo: "/Images/S5.png",
      link: "https://www.snehalaya.org/"
    },
    {
      name: "lilapoonawallafoundation",
      logo: "/Images/S3.png",
      link: "https://www.lilapoonawallafoundation.com/"
    },
    {
      name: "sewabharat",
      logo: "/Images/S4.png",
      link: "https://sewabharat.org/"
    },
    {
      name: "azadfoundation",
      logo: "/Images/S2.png",
      link: "https://www.azadfoundation.com/"
    }
  ];

  // Auto-scroll features
  useEffect(() => {
    if (featuresScrollRef.current) {
      const scrollContainer = featuresScrollRef.current;
      let scrollInterval;

      const startAutoScroll = () => {
        scrollInterval = setInterval(() => {
          scrollContainer.scrollLeft += 1;
          if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
            scrollContainer.scrollLeft = 0;
          }
        }, 30);
      };

      startAutoScroll();

      scrollContainer.addEventListener('mouseenter', () => clearInterval(scrollInterval));
      scrollContainer.addEventListener('mouseleave', startAutoScroll);

      return () => {
        clearInterval(scrollInterval);
        scrollContainer.removeEventListener('mouseenter', () => clearInterval(scrollInterval));
        scrollContainer.removeEventListener('mouseleave', startAutoScroll);
      };
    }
  }, []);

  // Rotate thoughts every 5 seconds
  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      setCurrentThoughtIndex((prevIndex) => 
        prevIndex === dailyThoughts.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(thoughtInterval);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const features = [
    { 
      title: 'Home',
      description: 'Overview of the platform & latest updates',
      icon: 'fa-home',
      color: '#e0218a',
      path: '/dashboard'
    },
    { 
      title: 'Education',
      description: 'Courses, skill-building, and workshops',
      icon: 'fa-graduation-cap',
      color: '#9b59b6',
      path: '/dashboard/education'
    },
    { 
      title: 'Community',
      description: 'Forums, networking, and mentorship',
      icon: 'fa-users',
      color: '#3498db',
      path: '/dashboard/community'
    },
    { 
      title: 'Women in Tech',
      description: 'Tech jobs, bootcamps, and opportunities',
      icon: 'fa-laptop-code',
      color: '#2ecc71',
      path: '/dashboard/tech'
    },
    { 
      title: 'Entrepreneurship',
      description: 'Startup guidance, funding, and marketplace',
      icon: 'fa-chart-line',
      color: '#f1c40f',
      path: '/dashboard/entrepreneurship'
    },
    { 
      title: 'Health & Wellness',
      description: 'Mental health, fitness, and well-being',
      icon: 'fa-heart',
      color: '#e74c3c',
      path: '/dashboard/health'
    },
    { 
      title: 'Safety & Legal',
      description: 'Emergency help, legal rights, and resources',
      icon: 'fa-shield-alt',
      color: '#27ae60',
      path: '/dashboard/Safety'
    },
    { 
      title: 'Blogs & Stories',
      description: 'Inspiring success stories and knowledge-sharing',
      icon: 'fa-book-reader',
      color: '#8e44ad',
      path: '/dashboard/blogs'
    },
    { 
      title: 'Leadership',
      description: 'Women leaders, programs, and initiatives',
      icon: 'fa-crown',
      color: '#d35400',
      path: '/dashboard/leadership'
    },
    { 
      title: 'Contact Us',
      description: 'Support, FAQs, and partnerships',
      icon: 'fa-envelope',
      color: '#16a085',
      path: '/dashboard/contact'
    }
  ];

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="main-content">
        <div className="hero-section">
          <h1>Welcome to EmpowerHer, {user.name}!</h1>
          <div className="daily-thought">
            <p className="quote">"{dailyThoughts[currentThoughtIndex].quote}"</p>
            <p className="author">- {dailyThoughts[currentThoughtIndex].author}</p>
            <div className="thought-indicators">
              {dailyThoughts.map((_, index) => (
                <span 
                  key={index} 
                  className={`indicator ${index === currentThoughtIndex ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div className="features-scroll-container">
          <div className="features-scroll" ref={featuresScrollRef}>
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                onClick={() => navigate(feature.path)}
                style={{'--hover-color': feature.color}}
              >
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`} style={{ color: feature.color }}></i>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-arrow">
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            ))}
          </div>
        </div>

        <section className="leading-ladies-section">
          <div className="section-title">
            <h2>Leading Ladies Making a Difference</h2>
            <p>Inspiring women who are breaking barriers and creating change</p>
          </div>
          <div className="leaders-grid">
            {leadingLadies.map((leader, index) => (
              <div key={index} className="leader-card">
                <div className="leader-image">
                  <img src={leader.image} alt={leader.name} />
                </div>
                <h3>{leader.name}</h3>
                <span className="leader-role">{leader.role}</span>
                <p>{leader.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sponsors-section">
          <div className="section-title">
            <h2>Our Supporting Partners</h2>
            <p>Organizations that share our vision of empowering women</p>
          </div>
          <div className="sponsors-grid">
            {sponsors.map((sponsor, index) => (
              <a 
                key={index} 
                href={sponsor.link} 
                className="sponsor-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={sponsor.logo} alt={sponsor.name} />
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;