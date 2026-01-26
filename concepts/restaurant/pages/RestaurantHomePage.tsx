import React from 'react';
import './RestaurantHomePage.css';

/**
 * Restaurant Concept - Home Page
 * 
 * This is the main entry point for the restaurant concept.
 * Displays personalized greeting, contextual insights, and quick actions.
 */

// TODO: These would come from user context/API
const userName = 'Asaf';
const greeting = getGreeting();
const insight = 'Everything looks stable. Cash flow is tight next week.';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export const RestaurantHomePage: React.FC = () => {
  return (
    <div className="restaurant-home">
      <header className="restaurant-home__header">
        <h1 className="restaurant-home__title">
          {greeting}, {userName}.
        </h1>
        <p className="restaurant-home__subtitle">
          {insight}
        </p>
      </header>

      <main className="restaurant-home__content">
        <section className="restaurant-home__welcome">
          <div className="restaurant-home__welcome-card">
            <h2>Welcome to the Restaurant Concept</h2>
            <p>
              This is an isolated prototype space for exploring Toqan adapted 
              for restaurant owners and SMBs. You can freely experiment here 
              without affecting the core Toqan prototype.
            </p>
            
            <div className="restaurant-home__features">
              <h3>Potential Features to Explore:</h3>
              <ul>
                <li>📋 Order management dashboard</li>
                <li>🍔 Menu item assistance</li>
                <li>💬 Customer inquiry handling</li>
                <li>📊 Business analytics</li>
                <li>👥 Staff scheduling help</li>
                <li>📱 Multi-location support</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="restaurant-home__quick-actions">
          <h3>Quick Actions</h3>
          <div className="restaurant-home__actions-grid">
            <button className="restaurant-home__action-btn">
              <span className="restaurant-home__action-icon">📝</span>
              <span>New Order</span>
            </button>
            <button className="restaurant-home__action-btn">
              <span className="restaurant-home__action-icon">🍽️</span>
              <span>Update Menu</span>
            </button>
            <button className="restaurant-home__action-btn">
              <span className="restaurant-home__action-icon">💬</span>
              <span>Ask Toqan</span>
            </button>
            <button className="restaurant-home__action-btn">
              <span className="restaurant-home__action-icon">📊</span>
              <span>View Reports</span>
            </button>
          </div>
        </section>
      </main>

      <footer className="restaurant-home__footer">
        <p className="restaurant-home__concept-badge">
          🧪 Restaurant Concept Prototype
        </p>
      </footer>
    </div>
  );
};

export default RestaurantHomePage;
