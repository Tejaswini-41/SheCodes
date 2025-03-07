import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [submitting, setSubmitting] = useState(false);

  const supportCategories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'partnership', label: 'Partnership Opportunities' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'emergency', label: 'Emergency Support' }
  ];

  const officeLocations = [
    {
      city: "Pune",
      address: "123 Business Hub, Andheri East",
      phone: "+91 22 1234 5678",
      email: "empowerher_pune@gmail.com"
    },
    {
      city: "Delhi",
      address: "456 Tech Park, Gurugram",
      phone: "+91 11 8765 4321",
      email: "empowerher_delhi@gmail.com"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Add your form submission logic here
    setTimeout(() => {
      setSubmitting(false);
      alert('Message sent successfully!');
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="contact-container">
      <Navbar />
      <div className="contact-page">
        <div className="contact-hero">
          <h1>Contact Us</h1>
          <p>We're here to help and answer any questions you might have</p>
        </div>

        <div className="contact-grid">
          <section className="contact-form-section">
            <h2>Send us a Message</h2>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="category">How can we help?</label>
                <select 
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {supportCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </section>

          <section className="contact-info-section">
            <div className="quick-contact">
              <h3>Quick Support</h3>
              <div className="contact-cards">
                <div className="contact-card">
                  <i className="fas fa-phone-alt"></i>
                  <h4>Emergency Helpline</h4>
                  <p>91874789003</p>
                  <span>Available 24/7</span>
                </div>

                <div className="contact-card">
                  <i className="fas fa-envelope"></i>
                  <h4>Email Support</h4>
                  <p>support@gmail.com</p>
                  <span>Response within 24 hours</span>
                </div>

                <div className="contact-card">
                  <i className="fas fa-comments"></i>
                  <h4>Live Chat</h4>
                  <p>Chat with our team</p>
                  <button className="chat-btn">Start Chat</button>
                </div>
              </div>
            </div>

            <div className="office-locations">
              <h3>Our Offices</h3>
              <div className="locations-grid">
                {officeLocations.map((office, index) => (
                  <div key={index} className="location-card">
                    <h4>{office.city}</h4>
                    <p><i className="fas fa-map-marker-alt"></i> {office.address}</p>
                    <p><i className="fas fa-phone"></i> {office.phone}</p>
                    <p><i className="fas fa-envelope"></i> {office.email}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="faq-section">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-card">
              <h4>How can I join the community?</h4>
              <p>Sign up through our registration page and complete your profile to join our community.</p>
            </div>
            <div className="faq-card">
              <h4>How do I access the courses?</h4>
              <p>After logging in, visit the Education section to browse and enroll in available courses.</p>
            </div>
            {/* Add more FAQ items */}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
