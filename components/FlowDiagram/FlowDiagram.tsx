import React from 'react';
import parse from 'html-react-parser';
import './FlowDiagram.css';

interface FlowStep {
  step: string;
  tool: string;
}

interface FlowDiagramProps {
  trigger?: string;
  steps?: FlowStep[];
  output?: string;
}

const defaultSteps: FlowStep[] = [
  { step: 'Get Data:', tool: 'Google Analytics' },
  { step: 'Analyze:', tool: 'Code Executor' },
  { step: 'Track:', tool: 'Google Sheets' }
];

const defaultTrigger = '"Which campaigns had the highest conversion rates?"';

const defaultOutput = `🎯 Top Campaign Conversion Rates<br />
🥇 Email Newsletter: 13.0%<br />
🥈 Shopping Google: 6.0%<br />
🥉 Holiday Google: 6.0%<br />
📊 Average: 5.8%<br />
🚀 Insight: Email performing 2x above average<br />
⚡ Action: Scale email budget, review display ads
<br />
`;

const FlowDiagram: React.FC<FlowDiagramProps> = ({ 
  trigger = defaultTrigger,
  steps = defaultSteps,
  output = defaultOutput
}) => {
  return (
    <div className="Flow-diagram">
      {/* Trigger */}
      <div className="diagram-box trigger">
        <div className="diagram-title-trigger">Trigger</div>
        <div className="diagram-text">{trigger}</div>
      </div>

      {/* Arrow */}
      <div className="diagram-arrow"><span>↜</span></div>

      {/* Steps & Tools Used */}
      <div className="diagram-box steps">
        <div className="diagram-title-steps">Steps & Tools</div>
        <ul className="diagram-list">
          {steps.map((item, index) => (
            <li key={index}>
              <span className="diagram-list-item-title">{item.step}</span>
              {/* <br /> */}
              <span className="diagram-tool">{item.tool}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Arrow */}
      <div className="diagram-arrow"><span>↜</span></div>

      {/* Output */}
      <div className="diagram-box output">
        <div className="diagram-title-output">Result</div>
        <div className="diagram-text">
          {parse(output)}
        </div>
      </div>
    </div>
  );
};

export default FlowDiagram;

