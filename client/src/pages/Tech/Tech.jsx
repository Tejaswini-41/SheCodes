import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Tech.css';

const Tech = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const jobListings = [
    {
      company: "Google",
      role: "Software Engineer",
      location: "Remote",
      type: "Full-time",
      experience: "3-5 years",
      skills: ["React", "Node.js", "Cloud"],
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo-2010-2013.jpg",
      category: "engineering"
    },
    {
      company: "Microsoft",
      role: "UX Designer",
      location: "Hybrid",
      type: "Full-time",
      experience: "2-4 years",
      skills: ["UI/UX", "Figma", "User Research"],
      logo: "https://logos-world.net/wp-content/uploads/2020/09/Microsoft-Logo-2012-present.jpg",
      category: "design"
    },
    {
      company: "Amazon",
      role: "Frontend Developer",
      location: "Remote",
      type: "Full-time",
      experience: "2-3 years",
      skills: ["React", "TypeScript", "CSS"],
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png",
      category: "engineering"
    },
    {
      company: "Apple",
      role: "Product Designer",
      location: "On-site",
      type: "Full-time",
      experience: "4-6 years",
      skills: ["Product Design", "Sketch", "Prototyping"],
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
      category: "design"
    },
    {
      company: "Meta",
      role: "Full Stack Developer",
      location: "Hybrid",
      type: "Full-time",
      experience: "3-5 years",
      skills: ["React", "Node.js", "MongoDB"],
      logo: "https://1000logos.net/wp-content/uploads/2021/10/Meta-Logo.png",
      category: "engineering"
    }
  ];

  const bootcamps = [
    {
      name: "Full Stack Web Development",
      duration: "12 weeks",
      mode: "Online",
      price: "$999",
      rating: 4.8,
      students: 1200,
      image: "https://www.scmgalaxy.com/tutorials/wp-content/uploads/2021/09/Full-stack-developer-1.png"
    },
    {
      name: "UI/UX Design Bootcamp",
      duration: "8 weeks",
      mode: "Hybrid",
      price: "$799",
      rating: 4.7,
      students: 800,
      image: "https://hustlersdigest.com/wp-content/uploads/2023/07/ui-ux.webp"
    },
    {
      name: "Data Science & Analytics",
      duration: "16 weeks",
      mode: "Online",
      price: "$1299",
      rating: 4.9,
      students: 950,
      image: "https://www.simplilearn.com/ice9/free_resources_article_thumb/Data-Science-vs.-Big-Data-vs.jpg"
    },
    {
      name: "Cybersecurity Fundamentals",
      duration: "10 weeks",
      mode: "Hybrid",
      price: "$1099",
      rating: 4.6,
      students: 600,
      image: "https://bismarckstate.edu/uploads/248/Cybersecurity%20fundamentals%20copy.jpg"
    }
  ];

  const resources = [
    {
      title: "Women Who Code",
      description: "Global community empowering women in tech",
      link: "https://www.womenwhocode.com/",
      icon: "fas fa-code",
      image: "https://admin.womenwhocode.dev/wp-content/uploads/2024/04/Header-Equal-Pay-Day-1-1-1536x864.png"
    },
    {
      title: "Tech Ladies",
      description: "Job board and community for women in tech",
      link: "https://www.hiretechladies.com/",
      icon: "fas fa-laptop-code",
      image: "https://cdn.prod.website-files.com/639957584cdf482e6bd1e96e/67a052b7248ec737007d1638_Mask%20group%20(10).png"
    },
    {
      title: "Girls Who Code",
      description: "Building the world's largest pipeline of future female engineers",
      link: "https://girlswhocode.com/",
      icon: "fas fa-users",
      image: "https://girlswhocode.com/assets/images/craft-prod/images/_2400x1467_crop_center-center_82_line/GROUP-CROP.jpg.webp"
    },
    {
      title: "She Can Code",
      description: "Supporting women in technology through education and mentorship",
      link: "https://shecancode.io/",
      icon: "fas fa-graduation-cap",
      image: "https://shecancode.io/wp-content/uploads/2025/03/International-Womens-Day-Collage-1024x640.jpg"
    }
  ];

  return (
    <div className="tech-container">
      <Navbar />
      <div className="tech-page">
        <div className="tech-hero">
          <h1>Tech Opportunities Hub</h1>
          <p>Discover jobs, bootcamps, and resources to advance your tech career</p>
        </div>

        <section className="jobs-section">
          <h2>Featured Tech Jobs</h2>
          <div className="job-filters">
            <button 
              className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Roles
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'engineering' ? 'active' : ''}`}
              onClick={() => setActiveCategory('engineering')}
            >
              Engineering
            </button>
            <button 
              className={`filter-btn ${activeCategory === 'design' ? 'active' : ''}`}
              onClick={() => setActiveCategory('design')}
            >
              Design
            </button>
          </div>

          <div className="jobs-grid">
            {jobListings.map((job, index) => (
              <div key={index} className="job-card">
                <div className="job-header">
                  <img src={job.logo} alt={job.company} className="company-logo" />
                  <span className="job-type">{job.type}</span>
                </div>
                <div className="job-content">
                  <h3>{job.role}</h3>
                  <p className="company-name">{job.company}</p>
                  <div className="job-details">
                    <span><i className="fas fa-map-marker-alt"></i> {job.location}</span>
                    <span><i className="fas fa-briefcase"></i> {job.experience}</span>
                  </div>
                  <div className="skills-list">
                    {job.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                  <button className="apply-btn">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bootcamps-section">
          <h2>Tech Bootcamps</h2>
          <div className="bootcamps-grid">
            {bootcamps.map((bootcamp, index) => (
              <div key={index} className="bootcamp-card">
                <div className="bootcamp-image">
                  <img src={bootcamp.image} alt={bootcamp.name} />
                </div>
                <div className="bootcamp-content">
                  <h3>{bootcamp.name}</h3>
                  <div className="bootcamp-details">
                    <span><i className="far fa-clock"></i> {bootcamp.duration}</span>
                    <span><i className="fas fa-laptop-house"></i> {bootcamp.mode}</span>
                    <span><i className="fas fa-tag"></i> {bootcamp.price}</span>
                  </div>
                  <div className="bootcamp-stats">
                    <span><i className="fas fa-star"></i> {bootcamp.rating}</span>
                    <span><i className="fas fa-users"></i> {bootcamp.students} enrolled</span>
                  </div>
                  <button className="enroll-btn">Learn More</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="resources-section">
          <h2>Tech Resources</h2>
          <div className="resources-grid">
            {resources.map((resource, index) => (
              <a 
                key={index} 
                href={resource.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="resource-card"
              >
                <div className="resource-image">
                  <img src={resource.image} alt={resource.title} />
                </div>
                <div className="resource-content">
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <span className="resource-link">Learn More <i className="fas fa-arrow-right"></i></span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Tech;
