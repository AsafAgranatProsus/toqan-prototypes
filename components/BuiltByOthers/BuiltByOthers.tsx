import React, { useState, useMemo } from 'react';
import Card from '../Card/Card';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import './BuiltByOthers.css';

const builtByOthersData = [
  {
    "id": "example-001",
    "title": "Proactively Monitor Key Business KPIs",
    "description": "Connects to multiple dashboards (Looker, Tableau) and alerts you in Slack when critical business metrics breach predefined thresholds.",
    "domain": "Data & Analytics",
    "builtBy": "Jane Doe (iFood)",
    "complexity": "Advanced",
    "seedData": {
      "exampleId": "example-001",
      "type": "Monitor",
      "goal": "Proactive KPI threshold alerting",
      "source": "Multiple Dashboards (Looker API, Tableau API) + Threshold Rules",
      "action": "Send Slack Alert",
      "clarityStatement": "You need to stay on top of critical business KPIs across various dashboards without constantly checking them. This agent monitors key metrics and proactively alerts you in Slack when predefined thresholds are met."
    }
  },
  {
    "id": "example-002",
    "title": "Automate A/B Test Result Analysis & Reporting",
    "description": "Pulls experiment data from your A/B testing platform, performs statistical analysis, and generates a standardized results report in Confluence.",
    "domain": "Data & Analytics",
    "builtBy": "John Smith (OLX)",
    "complexity": "Advanced",
    "seedData": {
      "exampleId": "example-002",
      "type": "Analyzer & Reporter",
      "goal": "Automate A/B test analysis and reporting",
      "source": "A/B Testing Platform API (e.g., Optimizely) + Statistical Libraries",
      "action": "Create Confluence Page",
      "clarityStatement": "You run many A/B tests and spend significant time analyzing results and creating reports. This agent automates the statistical analysis and generates consistent reports in Confluence."
    }
  },
  {
    "id": "example-003",
    "title": "Generate Personalized Customer Segmentation Insights",
    "description": "Combines CRM data with product usage analytics to identify key customer segments and surfaces actionable insights for marketing campaigns.",
    "domain": "Data & Analytics",
    "builtBy": "Maria Garcia (Takealot)",
    "complexity": "Expert",
    "seedData": {
      "exampleId": "example-003",
      "type": "Segmenter & Insight Generator",
      "goal": "Identify and describe actionable customer segments",
      "source": "CRM API (e.g., Salesforce) + Product Analytics DB (e.g., Snowflake)",
      "output": "Segmentation Report + Insights Summary",
      "clarityStatement": "You want to understand your customer base better by combining sales and product data. This agent identifies distinct customer segments and provides actionable insights for targeted campaigns."
    }
  },
  {
    "id": "example-004",
    "title": "Forecast Inventory Needs Based on Sales & Events",
    "description": "Analyzes historical sales data, promotional calendars, and external event data (holidays, weather) to predict future inventory requirements.",
    "domain": "Data & Analytics",
    "builtBy": "Chen Wei (Delivery Hero)",
    "complexity": "Expert",
    "seedData": {
      "exampleId": "example-004",
      "type": "Forecaster",
      "goal": "Predict inventory needs",
      "source": "Sales DB + Marketing Calendar API + External Event Data APIs",
      "output": "Inventory Forecast Report",
      "clarityStatement": "You need to accurately forecast inventory to avoid stockouts or overstocking. This agent analyzes sales history, upcoming promotions, and external factors to generate precise inventory predictions."
    }
  }
];

const generateRandomStyle = () => {
  const x = Math.floor(Math.random() * 100);
  const y = Math.floor(Math.random() * 100);
  const radius = Math.floor(Math.random() * 50) + 20;
  const hue = Math.floor(Math.random() * 360);
  const color = `hsl(${hue}, 100%, 85%)`;

  return {
    '--x': `${x}%`,
    '--y': `${y}%`,
    '--radius': `${radius}%`,
    '--color': color,
  } as React.CSSProperties;
};

const BuiltByOthers: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const randomStyles = useMemo(() => {
    return builtByOthersData.map(() => generateRandomStyle());
  }, []);

  const handleCardClick = (item: any) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="built-by-others">
      <h2 className="section-title">What others have built</h2>
      <div className="card-container">
        {builtByOthersData.map((item, index) => (
          <div key={item.id} onClick={() => handleCardClick(item)}>
            <Card
              title={item.title}
              description={item.description}
              style={randomStyles[index]}
            />
          </div>
        ))}
      </div>
      <Modal show={!!selectedItem} onClose={handleCloseModal}>
        {selectedItem && (
          <div className="built-by-others-modal-content">
            <div class="modal-header">
              <h2>{selectedItem.title}</h2>
              <p>{selectedItem.description}</p>
            </div>
            <div className="modal-body"></div>
            <div className="modal-buttons">
              <Button variant="secondary" onClick={handleCloseModal}>Dismiss</Button>
              <Button variant="primary" onClick={() => { }}>Create this agent</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BuiltByOthers;