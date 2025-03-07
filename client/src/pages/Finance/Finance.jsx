import React, { useState } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Finance.css';

const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const financeVideos = [
  {
    title: "Investment Basics for Beginners",
    author: "Finance Expert Sarah",
    videoUrl: "https://youtu.be/tHxwyWnNu0c?si=J3dGWWoNcktIxusA",
    description: "Learn the fundamentals of investing"
  },
  {
    title: "Understanding Mutual Funds",
    author: "Financial Advisor Mike",
    videoUrl: "https://youtu.be/watch?v=WEDIj9JBTC8",
    description: "Complete guide to mutual funds"
    },
    {
        title: "Understanding Mutual Funds",
        author: "Financial Advisor Mike",
        videoUrl: "https://youtu.be/qIw-yFC-HNU?si=VKheUJqwuTQHdzOK",
        description: "Complete guide to mutual funds"
      }
];

const successStories = [
  {
    name: "Priya Sharma",
    title: "From Savings to Investment",
    story: "Started with ₹1000 monthly SIP, now manages a diverse portfolio",
    image: "http://www.daviscos.com/wp-content/uploads/2017/08/accounting-and-finance-woman-e1504025803384.jpg"
  },
  {
    name: "Kimberly Dixit",
    title: "Digital Banking Success",
    story: "Transformed her small business through digital payments",
    image: "https://www.womanthology.co.uk/wp-content/uploads/2015/11/Women-in-finance.jpg"
  },
  {
    name: "Meera Patel",
    title: "Stock Market Maven",
    story: "Built a strong retirement fund through strategic stock investments",
    image: "https://mh-llp.com/wp-content/uploads/2022/05/Meera-1050x722.jpg"
  }
];

const Finance = () => {
  const [activeSection, setActiveSection] = useState('basics');
  const [budgetData, setBudgetData] = useState({
    monthlyIncome: '',
    essentialExpenses: '',
    savingsDebt: '',
    personalSpending: ''
  });

  const [budgetResults, setBudgetResults] = useState(null);

  const handleBudgetInput = (e) => {
    const { name, value } = e.target;
    setBudgetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateBudget = () => {
    const income = parseFloat(budgetData.monthlyIncome) || 0;
    
    // Calculate recommended amounts based on 50/30/20 rule
    const recommendedEssentials = income * 0.5;
    const recommendedSavings = income * 0.3;
    const recommendedPersonal = income * 0.2;
    
    // Get actual amounts
    const actualEssentials = parseFloat(budgetData.essentialExpenses) || 0;
    const actualSavings = parseFloat(budgetData.savingsDebt) || 0;
    const actualPersonal = parseFloat(budgetData.personalSpending) || 0;
    
    setBudgetResults({
      recommended: {
        essentials: recommendedEssentials,
        savings: recommendedSavings,
        personal: recommendedPersonal
      },
      actual: {
        essentials: actualEssentials,
        savings: actualSavings,
        personal: actualPersonal
      },
      difference: {
        essentials: recommendedEssentials - actualEssentials,
        savings: recommendedSavings - actualSavings,
        personal: recommendedPersonal - actualPersonal
      }
    });
  };

  const financialBasics = [
    {
      title: "Budgeting Essentials",
      content: "Track income and expenses, create emergency fund, follow 50/30/20 rule",
      icon: "fas fa-wallet"
    },
    {
      title: "Savings Goals",
      content: "Set specific targets, automate savings, track progress regularly",
      icon: "fas fa-piggy-bank"
    },
    {
      title: "Debt Management",
      content: "Prioritize high-interest debt, create repayment plan, avoid unnecessary debt",
      icon: "fas fa-credit-card"
    }
  ];

  const investmentTips = [
    {
      category: "Stocks",
      tips: [
        "Start with blue-chip companies",
        "Diversify your portfolio",
        "Invest for the long term",
        "Research before investing"
      ],
      icon: "fas fa-chart-line"
    },
    {
      category: "Mutual Funds",
      tips: [
        "Understand fund objectives",
        "Check expense ratios",
        "Review historical performance",
        "Consider SIP options"
      ],
      icon: "fas fa-funnel-dollar"
    },
    {
      category: "Fixed Deposits",
      tips: [
        "Compare interest rates",
        "Ladder your deposits",
        "Consider tax implications",
        "Check bank ratings"
      ],
      icon: "fas fa-landmark"
    }
  ];

  const bankingGuide = [
    {
      title: "Account Types",
      options: [
        "Savings Account",
        "Current Account",
        "Fixed Deposit",
        "Recurring Deposit"
      ],
      icon: "fas fa-university"
    },
    {
      title: "Digital Banking",
      options: [
        "Mobile Banking",
        "Net Banking",
        "UPI Payments",
        "Digital Wallets"
      ],
      icon: "fas fa-mobile-alt"
    },
    {
      title: "Security Tips",
      options: [
        "Use strong passwords",
        "Enable 2FA",
        "Never share OTP",
        "Monitor transactions"
      ],
      icon: "fas fa-shield-alt"
    }
  ];

  return (
    <div className="finance-container">
      <Navbar />
      <div className="finance-page">
        <div className="finance-hero">
          <h1>Financial Empowerment</h1>
          <p>Take control of your financial future</p>
        </div>

        <div className="finance-navigation">
          <button 
            className={`nav-btn ${activeSection === 'basics' ? 'active' : ''}`}
            onClick={() => setActiveSection('basics')}
          >
            Financial Basics
          </button>
          <button 
            className={`nav-btn ${activeSection === 'investment' ? 'active' : ''}`}
            onClick={() => setActiveSection('investment')}
          >
            Investment Tips
          </button>
          <button 
            className={`nav-btn ${activeSection === 'banking' ? 'active' : ''}`}
            onClick={() => setActiveSection('banking')}
          >
            Banking Guide
          </button>
        </div>

        {activeSection === 'basics' && (
          <section className="basics-section">
            <h2>Financial Fundamentals</h2>
            <div className="basics-grid">
              {financialBasics.map((basic, index) => (
                <div key={index} className="basic-card">
                  <div className="basic-icon">
                    <i className={basic.icon}></i>
                  </div>
                  <h3>{basic.title}</h3>
                  <p>{basic.content}</p>
                </div>
              ))}
            </div>
            
            <div className="success-stories">
              <h3>Success Stories</h3>
              <div className="stories-grid">
                {successStories.map((story, index) => (
                  <div key={index} className="story-card">
                    <img src={story.image} alt={story.name} />
                    <div className="story-content">
                      <h4>{story.title}</h4>
                      <p className="story-author">{story.name}</p>
                      <p>{story.story}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="calculator-section">
              <h3>Budget Calculator</h3>
              <div className="calculator-grid">
                <div className="calc-input">
                  <label>Monthly Income</label>
                  <input 
                    type="number" 
                    name="monthlyIncome" 
                    value={budgetData.monthlyIncome} 
                    onChange={handleBudgetInput} 
                    placeholder="Enter your monthly income" 
                  />
                </div>
                <div className="calc-input">
                  <label>Essential Expenses (50%)</label>
                  <input 
                    type="number" 
                    name="essentialExpenses" 
                    value={budgetData.essentialExpenses} 
                    onChange={handleBudgetInput} 
                    placeholder="Rent, utilities, groceries..." 
                  />
                </div>
                <div className="calc-input">
                  <label>Savings & Debt (30%)</label>
                  <input 
                    type="number" 
                    name="savingsDebt" 
                    value={budgetData.savingsDebt} 
                    onChange={handleBudgetInput} 
                    placeholder="Savings, debt payments..." 
                  />
                </div>
                <div className="calc-input">
                  <label>Personal Spending (20%)</label>
                  <input 
                    type="number" 
                    name="personalSpending" 
                    value={budgetData.personalSpending} 
                    onChange={handleBudgetInput} 
                    placeholder="Entertainment, shopping..." 
                  />
                </div>
              </div>
              <button onClick={calculateBudget}>Calculate</button>
              {budgetResults && (
                <div className="budget-results">
                  <h4>Recommended Budget</h4>
                  <p>Essentials: {budgetResults.recommended.essentials}</p>
                  <p>Savings: {budgetResults.recommended.savings}</p>
                  <p>Personal: {budgetResults.recommended.personal}</p>
                  <h4>Actual Budget</h4>
                  <p>Essentials: {budgetResults.actual.essentials}</p>
                  <p>Savings: {budgetResults.actual.savings}</p>
                  <p>Personal: {budgetResults.actual.personal}</p>
                  <h4>Difference</h4>
                  <p>Essentials: {budgetResults.difference.essentials}</p>
                  <p>Savings: {budgetResults.difference.savings}</p>
                  <p>Personal: {budgetResults.difference.personal}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {activeSection === 'investment' && (
          <section className="investment-section">
            <h2>Smart Investment Strategies</h2>
            <div className="investment-videos">
              {financeVideos.map((video, index) => (
                <div key={index} className="video-card">
                  <div className="video-player">
                    <iframe
                      width="100%"
                      height="215"
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.videoUrl)}`}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="video-info">
                    <h3>{video.title}</h3>
                    <p>{video.author}</p>
                    <span>{video.description}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="investment-grid">
              {investmentTips.map((category, index) => (
                <div key={index} className="investment-card">
                  <div className="investment-icon">
                    <i className={category.icon}></i>
                  </div>
                  <h3>{category.category}</h3>
                  <ul className="investment-tips">
                    {category.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'banking' && (
          <section className="banking-section">
            <h2>Banking Essentials</h2>
            <div className="banking-grid">
              {bankingGuide.map((guide, index) => (
                <div key={index} className="banking-card">
                  <div className="banking-icon">
                    <i className={guide.icon}></i>
                  </div>
                  <h3>{guide.title}</h3>
                  <ul className="banking-options">
                    {guide.options.map((option, i) => (
                      <li key={i}>{option}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Finance;