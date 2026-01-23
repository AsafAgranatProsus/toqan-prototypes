/**
 * Overtime Risk Priority Flow
 * 
 * Flow for handling the "Overtime Risk Detected" priority.
 */

import type { ChatFlow } from '../../../../shared/chatSession';

export const overtimeFlow: ChatFlow = {
  id: 'priority-overtime',
  name: 'Overtime Risk Detected',
  category: 'priorities',
  initialNodeId: 'intro',
  matchPatterns: ['overtime', 'too many hours', 'over 40 hours', 'labor cost', 'mike overtime'],
  nodes: {
    'intro': {
      id: 'intro',
      content: `
        <h2>Overtime Risk Detected</h2>
        
        <p><strong>Mike T. (Line Cook)</strong> is at <strong>38 hours</strong> this week and is scheduled for an additional <strong>8-hour shift</strong> tomorrow.</p>
        
        <h3>Impact:</h3>
        <ul>
          <li><strong>Projected Total:</strong> 46 hours (6 hours overtime)</li>
          <li><strong>Overtime Cost:</strong> ~$135 extra (6h × $22.50 OT rate)</li>
          <li><strong>Weekly Labor Budget:</strong> Currently 3% over</li>
        </ul>
        
        <p>Netherlands law requires time-and-a-half for hours over 40/week.</p>
      `,
      replyButtons: [
        { id: 'options', label: 'What are my options?', nextNodeId: 'options', variant: 'primary', matchKeywords: ['options', 'what', 'can', 'do'] },
        { id: 'keep', label: 'It\'s fine, keep the schedule', nextNodeId: 'keep-schedule', matchKeywords: ['fine', 'keep', 'okay'] },
        { id: 'history', label: 'Show Mike\'s hours history', nextNodeId: 'history', matchKeywords: ['history', 'hours', 'previous'] },
      ],
    },
    
    'options': {
      id: 'options',
      content: `
        <h2>Options to Avoid Overtime</h2>
        
        <h3>Option 1: Reduce Tomorrow's Shift</h3>
        <p>Cut Mike's shift from 8h to 2h. He'd work 10:00 AM - 12:00 PM for prep only.</p>
        <p>⚠️ You'd need coverage for the remaining 6 hours.</p>
        
        <h3>Option 2: Swap with Another Employee</h3>
        <p><strong>John D. (Prep)</strong> is at 32 hours and available tomorrow.</p>
        <p>He could take Mike's shift, keeping both under 40h.</p>
        
        <h3>Option 3: Split the Shift</h3>
        <p>Mike works 4h (morning prep), John works 4h (afternoon).</p>
        <p>This keeps Mike at exactly 42h (2h overtime, ~$45 extra).</p>
      `,
      replyButtons: [
        { id: 'swap', label: 'Swap with John', nextNodeId: 'swap-john', variant: 'primary' },
        { id: 'split', label: 'Split the shift', nextNodeId: 'split-shift' },
        { id: 'reduce', label: 'Reduce Mike\'s shift', nextNodeId: 'reduce-shift' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'swap-john': {
      id: 'swap-john',
      content: `
        <h2>Swap Shift to John D.</h2>
        
        <p>Here's the proposed change:</p>
        
        <table>
          <thead>
            <tr><th>Employee</th><th>Original</th><th>New</th><th>Weekly Total</th></tr>
          </thead>
          <tbody>
            <tr><td>Mike T.</td><td>10:00 - 18:00</td><td>OFF</td><td>38h ✓</td></tr>
            <tr><td>John D.</td><td>OFF</td><td>10:00 - 18:00</td><td>40h ✓</td></tr>
          </tbody>
        </table>
        
        <h3>Notes:</h3>
        <ul>
          <li>John is trained on line cooking (can cover)</li>
          <li>Mike was already at 46h; this brings him back to 38h</li>
          <li>Labor cost savings: ~$135</li>
        </ul>
        
        <p>Should I update the schedule and notify both employees?</p>
      `,
      replyButtons: [
        { id: 'confirm', label: 'Yes, update schedule', nextNodeId: 'swap-confirmed', variant: 'primary' },
        { id: 'check', label: 'Check with employees first', nextNodeId: 'check-availability' },
        { id: 'back', label: 'See other options', nextNodeId: 'options' },
      ],
    },
    
    'swap-confirmed': {
      id: 'swap-confirmed',
      content: `
        <h2>Schedule Updated ✓</h2>
        
        <p>The shift swap has been applied:</p>
        
        <ul>
          <li><strong>Mike T.:</strong> Now OFF tomorrow (38h total)</li>
          <li><strong>John D.:</strong> Now 10:00 - 18:00 tomorrow (40h total)</li>
        </ul>
        
        <p>Both employees have been notified via SMS.</p>
        
        <h3>Impact:</h3>
        <ul>
          <li>Overtime avoided: 6 hours</li>
          <li>Labor cost saved: ~$135</li>
          <li>Weekly labor now: On budget ✓</li>
        </ul>
      `,
      replyButtons: [
        { id: 'done', label: 'Great, thanks!', nextNodeId: null, variant: 'primary' },
        { id: 'roster', label: 'View full roster', nextNodeId: 'full-roster' },
      ],
    },
    
    'split-shift': {
      id: 'split-shift',
      content: `
        <h2>Split Shift Option</h2>
        
        <p>Here's the proposed split:</p>
        
        <table>
          <thead>
            <tr><th>Employee</th><th>Time</th><th>Hours</th><th>Weekly Total</th></tr>
          </thead>
          <tbody>
            <tr><td>Mike T.</td><td>10:00 - 14:00</td><td>4h</td><td>42h (2h OT)</td></tr>
            <tr><td>John D.</td><td>14:00 - 18:00</td><td>4h</td><td>36h ✓</td></tr>
          </tbody>
        </table>
        
        <h3>Trade-offs:</h3>
        <ul>
          <li>Mike still gets some overtime ($45 extra)</li>
          <li>Ensures experienced coverage during lunch rush</li>
          <li>John handles afternoon prep</li>
        </ul>
      `,
      replyButtons: [
        { id: 'apply', label: 'Apply this split', nextNodeId: 'split-confirmed', variant: 'primary' },
        { id: 'swap', label: 'Full swap is better', nextNodeId: 'swap-john' },
        { id: 'back', label: 'See other options', nextNodeId: 'options' },
      ],
    },
    
    'split-confirmed': {
      id: 'split-confirmed',
      content: `
        <h2>Split Shift Applied ✓</h2>
        
        <p>Tomorrow's schedule has been updated:</p>
        
        <ul>
          <li><strong>Mike T.:</strong> 10:00 - 14:00 (4h, 42h total)</li>
          <li><strong>John D.:</strong> 14:00 - 18:00 (4h, 36h total)</li>
        </ul>
        
        <p>Both employees have been notified.</p>
        
        <p><strong>Remaining overtime:</strong> 2 hours (~$45)</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Done', nextNodeId: null, variant: 'primary' },
        { id: 'roster', label: 'View full roster', nextNodeId: 'full-roster' },
      ],
    },
    
    'reduce-shift': {
      id: 'reduce-shift',
      content: `
        <h2>Reduce Mike's Shift</h2>
        
        <p>Cutting Mike's shift to 2 hours would:</p>
        
        <ul>
          <li>Bring him to exactly 40h (no overtime)</li>
          <li>Leave 6 hours uncovered</li>
        </ul>
        
        <h3>Coverage Options for the 6 Hours:</h3>
        <p><strong>John D.</strong> - Available, at 32h, trained on line</p>
        <p><strong>Alex R.</strong> - Available evenings only, at 12h</p>
        
        <p>⚠️ Without coverage, you'd be short-staffed during dinner prep.</p>
      `,
      replyButtons: [
        { id: 'john', label: 'Ask John to cover', nextNodeId: 'ask-john-cover' },
        { id: 'swap', label: 'Just swap the whole shift', nextNodeId: 'swap-john', variant: 'primary' },
        { id: 'back', label: 'See other options', nextNodeId: 'options' },
      ],
    },
    
    'ask-john-cover': {
      id: 'ask-john-cover',
      content: `
        <h2>Request Coverage from John</h2>
        
        <p>I'll send John a request to cover the remaining 6 hours (12:00 - 18:00).</p>
        
        <p>His current schedule:</p>
        <ul>
          <li>Week total: 32h</li>
          <li>With this addition: 38h ✓</li>
        </ul>
        
        <p><em>In a real implementation, this would send a notification to John.</em></p>
      `,
      replyButtons: [
        { id: 'send', label: 'Send request', nextNodeId: 'coverage-requested', variant: 'primary' },
        { id: 'back', label: 'Go back', nextNodeId: 'reduce-shift' },
      ],
    },
    
    'coverage-requested': {
      id: 'coverage-requested',
      content: `
        <h2>Coverage Request Sent ✓</h2>
        
        <p>John has been asked to cover 12:00 - 18:00 tomorrow.</p>
        
        <p>I'll notify you when he responds.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Done', nextNodeId: null, variant: 'primary' },
      ],
    },
    
    'check-availability': {
      id: 'check-availability',
      content: `
        <h2>Check Employee Availability</h2>
        
        <p>I'll send both employees a message to confirm availability before making changes.</p>
        
        <p><em>In a real implementation:</em></p>
        <ul>
          <li>Mike would be asked if he's okay giving up the shift</li>
          <li>John would be asked if he can cover</li>
        </ul>
        
        <p>I'll notify you when both respond.</p>
      `,
      replyButtons: [
        { id: 'send', label: 'Send availability check', nextNodeId: 'availability-sent', variant: 'primary' },
        { id: 'just-update', label: 'Just update it directly', nextNodeId: 'swap-confirmed' },
      ],
    },
    
    'availability-sent': {
      id: 'availability-sent',
      content: `
        <h2>Availability Check Sent ✓</h2>
        
        <p>Both Mike and John have been contacted. I'll notify you when they respond.</p>
        
        <p>Typical response time: within a few hours.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Thanks!', nextNodeId: null, variant: 'primary' },
      ],
    },
    
    'keep-schedule': {
      id: 'keep-schedule',
      content: `
        <h2>Keeping Current Schedule</h2>
        
        <p>Understood. Mike will work his scheduled 8-hour shift tomorrow.</p>
        
        <h3>Reminder:</h3>
        <ul>
          <li>Total hours: 46h</li>
          <li>Overtime: 6 hours</li>
          <li>Additional cost: ~$135</li>
        </ul>
        
        <p>I'll flag this in your weekly labor report.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Okay, got it', nextNodeId: null, variant: 'primary' },
        { id: 'reconsider', label: 'Actually, show me options', nextNodeId: 'options' },
      ],
    },
    
    'history': {
      id: 'history',
      content: `
        <h2>Mike T. - Hours History</h2>
        
        <table>
          <thead>
            <tr><th>Week</th><th>Hours</th><th>Overtime</th></tr>
          </thead>
          <tbody>
            <tr><td>This Week (so far)</td><td>38h</td><td>—</td></tr>
            <tr><td>Last Week</td><td>42h</td><td>2h</td></tr>
            <tr><td>2 Weeks Ago</td><td>39h</td><td>—</td></tr>
            <tr><td>3 Weeks Ago</td><td>44h</td><td>4h</td></tr>
            <tr><td>4 Weeks Ago</td><td>40h</td><td>—</td></tr>
          </tbody>
        </table>
        
        <p><strong>Average:</strong> 40.6 hours/week</p>
        <p><strong>Note:</strong> Mike has been consistently near or over 40h. May need to hire additional help or redistribute shifts.</p>
      `,
      replyButtons: [
        { id: 'options', label: 'What are my options?', nextNodeId: 'options', variant: 'primary' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'full-roster': {
      id: 'full-roster',
      content: `
        <h2>Week 42 Labor Roster</h2>
        
        <table>
          <thead>
            <tr><th>Employee</th><th>Role</th><th>Hours</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>Sarah J.</td><td>Manager</td><td>42h</td><td>✓ Normal</td></tr>
            <tr><td>Mike T.</td><td>Line Cook</td><td>38h</td><td>✓ Adjusted</td></tr>
            <tr><td>John D.</td><td>Prep</td><td>40h</td><td>✓ Normal</td></tr>
            <tr><td>Emma W.</td><td>Server</td><td>32h</td><td>✓ Part-time</td></tr>
            <tr><td>Alex R.</td><td>Dish</td><td>20h</td><td>✓ Part-time</td></tr>
          </tbody>
        </table>
        
        <p><strong>Total Scheduled:</strong> 172h</p>
        <p><strong>Budget:</strong> 180h</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Done', nextNodeId: null, variant: 'primary' },
      ],
    },
  },
};
