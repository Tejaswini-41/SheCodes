import React, { useState } from 'react';
import './Discussions.css';

const Discussions = () => {
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  
  // Add static discussions to the initial state
  const [discussions, setDiscussions] = useState([
    {
      title: "Transitioning from Academia to Tech Industry",
      tags: ["career-change", "tech-industry", "academia"],
      content: "After spending 5 years in academic research, I'm looking to transition into the tech industry as a data scientist. Would love to hear from others who've made similar career changes. What challenges did you face and how did you overcome them?",
      author: "Dr. Sophia Chen",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      replies: 24,
      views: 156,
      time: "2 days ago"
    },
    {
      title: "Resources for Learning Cloud Architecture",
      tags: ["cloud", "aws", "learning-resources"],
      content: "I'm looking to expand my skills in cloud architecture. Can anyone recommend good resources for learning AWS and Azure? Preferably something hands-on rather than just theory.",
      author: "Maya Johnson",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      replies: 18,
      views: 97,
      time: "5 days ago"
    },
    {
      title: "How to Handle Imposter Syndrome as a Junior Developer",
      tags: ["imposter-syndrome", "mental-health", "junior-dev"],
      content: "I just started my first job as a junior developer and I'm constantly feeling like I don't belong. Does anyone else experience this? How do you deal with imposter syndrome in tech?",
      author: "Zara Williams",
      avatar: "https://randomuser.me/api/portraits/women/45.jpg",
      replies: 42,
      views: 230,
      time: "1 week ago"
    },
    {
      title: "Preparing for Technical Interviews - Tips & Tricks",
      tags: ["interviews", "career", "algorithms"],
      content: "I have a few technical interviews coming up next month and I'm looking for advice on how to prepare. What resources do you recommend for algorithm practice? Any tips for system design interviews?",
      author: "Priya Sharma",
      avatar: "https://randomuser.me/api/portraits/women/26.jpg",
      replies: 31,
      views: 189,
      time: "3 days ago"
    }
  ]);
  
  const [discussionForm, setDiscussionForm] = useState({
    title: '',
    tags: '',
    content: '',
    author: 'Current User',
    avatar: '/Images/avatars/default.jpg',
    imageFile: null
  });

  const handleDiscussionInputChange = (e) => {
    const { name, value } = e.target;
    setDiscussionForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDiscussionForm(prev => ({ ...prev, imageFile: file, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscussionSubmit = (e) => {
    e.preventDefault();
    
    const tagsArray = discussionForm.tags
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    
    const newDiscussion = {
      ...discussionForm,
      tags: tagsArray,
      replies: 0,
      views: 1,
      time: 'Just now'
    };
    
    // Add new discussion to the beginning of the array, not the end
    setDiscussions([newDiscussion, ...discussions]);
    setDiscussionForm({
      title: '',
      tags: '',
      content: '',
      author: 'Current User',
      avatar: '/Images/avatars/default.jpg',
      imageFile: null
    });
    setShowDiscussionForm(false);
  };

  return (
    <section className="discussions-section">
      <div className="section-header">
        <h2>Recent Discussions</h2>
        <button 
          className="create-post-btn" 
          onClick={() => setShowDiscussionForm(true)}
        >
          Start Discussion
        </button>
      </div>
      
      {showDiscussionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Start a New Discussion</h2>
            <form onSubmit={handleDiscussionSubmit} className="discussion-form">
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  name="title" 
                  value={discussionForm.title} 
                  onChange={handleDiscussionInputChange}
                  placeholder="What would you like to discuss?"
                  required
                />
              </div>
              <div className="form-group">
                <label>Tags (comma separated)</label>
                <input 
                  type="text" 
                  name="tags" 
                  value={discussionForm.tags} 
                  onChange={handleDiscussionInputChange}
                  placeholder="e.g. career, tech, advice"
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea 
                  name="content" 
                  value={discussionForm.content} 
                  onChange={handleDiscussionInputChange}
                  rows="5"
                  placeholder="Share your thoughts or questions..."
                  required
                />
              </div>
              <div className="form-group">
                <label>Add Image</label>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                {discussionForm.avatar && (
                  <img 
                    src={discussionForm.avatar} 
                    alt="Preview" 
                    style={{ width: '100px', marginTop: '10px' }} 
                  />
                )}
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowDiscussionForm(false)}>
                  Cancel
                </button>
                <button type="submit">Post Discussion</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <div className="discussions-list">
        {discussions.map((discussion, index) => (
          <div key={index} className="discussion-card">
            <div className="discussion-avatar">
              <img 
                src={discussion.avatar} 
                alt={discussion.author} 
                onError={(e) => e.target.src = '/Images/avatars/default.jpg'}
              />
            </div>
            <div className="discussion-content">
              <h3>{discussion.title}</h3>
              <div className="discussion-meta">
                <span>By {discussion.author}</span>
                <span>{discussion.time}</span>
                <span>{discussion.replies} replies</span>
                <span>{discussion.views} views</span>
              </div>
              <div className="discussion-tags">
                {discussion.tags.map((tag, i) => (
                  <span key={i} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Discussions;
