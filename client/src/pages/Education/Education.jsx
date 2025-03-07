import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { workshops } from '../../data/workshops';
import './Education.css';

const Education = () => {
  // State for filtering and sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popularity'); // Default sort by popularity
  const [filteredCourses, setFilteredCourses] = useState([]);

  const courses = [
    {
      title: "Web Development",
      category: "Technology",
      level: "Beginner",
      duration: "8 weeks",
      image: "https://i.ytimg.com/vi/tfciNyRnjx8/maxresdefault.jpg",
      rating: 4.8,
      enrolled: 1200,
      url: "https://www.youtube.com/watch?v=tfciNyRnjx8"
    },
    {
      title: "Digital Marketing Mastery",
      category: "Marketing",
      level: "Intermediate",
      duration: "6 weeks",
      image: "https://shehandlesit.com/wp-content/uploads/2022/08/What-Role-Women-Play-in-Digital-Marketing-1089x730.jpg",
      rating: 4.7,
      enrolled: 850,
      url: "https://shehandlesit.com/blog/what-role-do-women-play-in-digital-marketing/"
    },
    {
      title: "Financial Literacy for Women",
      category: "Finance",
      level: "Beginner",
      duration: "4 weeks",
      image: "https://i.ytimg.com/vi/bo2XTi68jLQ/maxresdefault.jpg",
      rating: 4.9,
      enrolled: 2100,
      url: "https://www.youtube.com/watch?v=bo2XTi68jLQ"
    },
    {
      title: "Leadership Communication",
      category: "Soft Skills",
      level: "All Levels",
      duration: "5 weeks",
      image: "https://i.ytimg.com/vi/-iaRROTB-Rw/maxresdefault.jpg",
      rating: 4.6,
      enrolled: 1500,
      url: "https://www.youtube.com/watch?v=-iaRROTB-Rw"
    },
    {
      title: "Python Programming",
      category: "Technology",
      level: "Beginner",
      duration: "10 weeks",
      image: "https://i.ytimg.com/vi/7p_rO_1WVH8/maxresdefault.jpg",
      rating: 4.8,
      enrolled: 3000,
      url: "https://www.youtube.com/watch?v=KrBnRcpWGEI"
    },
    {
      title: "Data Science Essentials",
      category: "Technology",
      level: "Intermediate",
      duration: "12 weeks",
      image: "https://i.ytimg.com/vi/ywoxdIw2-Ok/hqdefault.jpg",
      rating: 4.7,
      enrolled: 1800,
      url: "https://www.youtube.com/watch?v=ywoxdIw2-Ok"
    },
    {
      title: "Entrepreneurship 101",
      category: "Business",
      level: "Beginner",
      duration: "6 weeks",
      image: "http://www.ourbusinessladder.com/wp-content/uploads/2019/03/female-entrepreneurship-opportunities-and-challenges.jpg",
      rating: 4.9,
      enrolled: 2500,
      url: "https://www.youtube.com/watch?v=niOV_jSVCKs"
    },
    {
      title: "UX/UI Design Fundamentals",
      category: "Technology",
      level: "Beginner",
      duration: "8 weeks",
      image: "https://i.ytimg.com/vi/puJAFI7yaho/maxresdefault.jpg",
      rating: 4.8,
      enrolled: 1600,
      url: "https://www.youtube.com/watch?v=SRec90j6lTY"
    }
  ];

  // Get unique categories for filter buttons
  const categories = ['All', ...new Set(courses.map(course => course.category))];

  // Filter and sort courses when dependencies change
  useEffect(() => {
    let results = [...courses];
    
    // Filter by search query
    if (searchQuery) {
      results = results.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.level.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (activeCategory !== 'All') {
      results = results.filter(course => course.category === activeCategory);
    }
    
    // Sort courses
    switch (sortBy) {
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        results.sort((a, b) => b.enrolled - a.enrolled);
        break;
      case 'durationAsc':
        results.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      case 'durationDesc':
        results.sort((a, b) => parseInt(b.duration) - parseInt(a.duration));
        break;
      default:
        // Default sort by popularity
        results.sort((a, b) => b.enrolled - a.enrolled);
    }
    
    setFilteredCourses(results);
  }, [searchQuery, activeCategory, sortBy]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category filter click
  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="education-container">
      <Navbar />
      <div className="education-page">
        <div className="education-hero">
          <h1>Empower Your Future with Knowledge</h1>
          <p>Access quality education and skill-building resources designed for women</p>
        </div>

        <section className="course-filters">
          <div className="filter-row">
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="search-input"
              value={searchQuery}
              onChange={handleSearchChange} 
            />
            
            <div className="sort-container">
              <label htmlFor="sort-select">Sort by:</label>
              <select 
                id="sort-select" 
                value={sortBy} 
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="popularity">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="durationAsc">Duration (Shortest First)</option>
                <option value="durationDesc">Duration (Longest First)</option>
              </select>
            </div>
          </div>

          <div className="filter-buttons">
            {categories.map(category => (
              <button 
                key={category}
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="filter-results">
            <p>Showing {filteredCourses.length} courses</p>
            {(searchQuery || activeCategory !== 'All') && (
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
              >
                <i className="fas fa-times"></i> Clear Filters
              </button>
            )}
          </div>
        </section>

        <section className="courses-section">
          <h2>Featured Courses</h2>
          {filteredCourses.length > 0 ? (
            <div className="courses-grid">
              {filteredCourses.map((course, index) => (
                <div key={index} className="course-card">
                  <div className="course-image">
                    <img src={course.image} alt={course.title} />
                    <span className="course-level">{course.level}</span>
                  </div>
                  <div className="course-content">
                    <span className="course-category">{course.category}</span>
                    <h3>{course.title}</h3>
                    <div className="course-info">
                      <span><i className="far fa-clock"></i> {course.duration}</span>
                      <span><i className="fas fa-star"></i> {course.rating}</span>
                      <span><i className="fas fa-users"></i> {course.enrolled}</span>
                    </div>
                    <button className="enroll-btn" onClick={() => window.open(course.url, '_blank')}>
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <i className="fas fa-search"></i>
              <h3>No courses found</h3>
              <p>Try adjusting your filters or search term</p>
            </div>
          )}
        </section>

        <section className="workshops-section">
          <h2>Upcoming Workshops</h2>
          <div className="workshops-grid">
            {workshops.map((workshop, index) => (
              <div key={index} className="workshop-card">
                <div className="workshop-image">
                  <img src={workshop.image} alt={workshop.title} />
                  <span className="workshop-price">{workshop.price}</span>
                </div>
                <div className="workshop-content">
                  <h3>{workshop.title}</h3>
                  <p className="workshop-description">{workshop.description}</p>
                  <div className="workshop-info">
                    <p><i className="far fa-calendar"></i> {workshop.date}</p>
                    <p><i className="far fa-clock"></i> {workshop.time}</p>
                    <p><i className="fas fa-map-marker-alt"></i> {workshop.location}</p>
                    <p><i className="fas fa-chalkboard-teacher"></i> {workshop.instructor}</p>
                    <p><i className="fas fa-user-friends"></i> {workshop.spots} spots available</p>
                  </div>
                  <button 
                    className="register-btn" 
                    onClick={() => window.open(workshop.url, '_blank')}
                  >
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="resources-section">
          <h2>Learning Resources</h2>
          <div className="resources-grid">
            <div className="resource-card">
              <i className="fas fa-book"></i>
              <h3>E-Library</h3>
              <p>Access our collection of e-books, articles, and research papers</p>
            </div>
            <div className="resource-card">
              <i className="fas fa-video"></i>
              <h3>Video Tutorials</h3>
              <p>Watch expert-led video tutorials and workshops</p>
            </div>
            <div className="resource-card">
              <i className="fas fa-users"></i>
              <h3>Study Groups</h3>
              <p>Join peer study groups and learning communities</p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Education;