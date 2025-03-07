import React, { useState } from 'react';

const Discussions = () => {
  const [showDiscussionForm, setShowDiscussionForm] = useState(false);
  const [discussions, setDiscussions] = useState([]);
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
    
    setDiscussions([...discussions, newDiscussion]);
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
              <img src={discussion.avatar} alt={discussion.author} />
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
