/**
 * Cash Flow Priority Flow
 * 
 * Flow for handling the "Low Cash Flow Warning" priority.
 */

import type { ChatFlow } from '../../../../shared/chatSession';

export const cashFlowFlow: ChatFlow = {
  id: 'priority-cash-flow',
  name: 'Low Cash Flow Warning',
  category: 'priorities',
  initialNodeId: 'intro',
  matchPatterns: ['cash flow', 'low cash', 'account balance', 'payroll', 'not enough money'],
  nodes: {
    'intro': {
      id: 'intro',
      content: `
        <h2>Low Cash Flow Warning</h2>
        <p>Your account is projected to dip below <strong>$1,000</strong> on <strong>February 12th</strong>.</p>
        
        <h3>Upcoming Obligations:</h3>
        <ul>
          <li><strong>Payroll (Feb 12):</strong> $4,200</li>
          <li><strong>Rent (Feb 15):</strong> $2,800</li>
          <li><strong>Sysco Invoice (Feb 14):</strong> $1,240</li>
        </ul>
        
        <p>Current Balance: <strong>$6,850</strong></p>
        <p>Projected Balance after payroll: <strong>$2,650</strong></p>
        <p>Projected Balance after rent: <strong>-$150</strong> ⚠️</p>
      `,
      replyButtons: [
        { id: 'projection', label: 'Show detailed projection', nextNodeId: 'projection', variant: 'primary', matchKeywords: ['projection', 'detailed', 'forecast', 'show'] },
        { id: 'options', label: 'What are my options?', nextNodeId: 'options', matchKeywords: ['options', 'what', 'can', 'do'] },
        { id: 'defer', label: 'Can I defer a payment?', nextNodeId: 'defer-options', matchKeywords: ['defer', 'delay', 'postpone', 'payment'] },
        { id: 'more', label: 'Tell me more', nextNodeId: 'details', matchKeywords: ['more', 'details', 'explain'] },
      ],
    },
    
    'projection': {
      id: 'projection',
      content: `
        <h2>7-Day Cash Flow Projection</h2>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction</th>
              <th>Amount</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Feb 9</td><td>Starting Balance</td><td>—</td><td>$6,850</td></tr>
            <tr><td>Feb 10</td><td>Daily Sales (Est.)</td><td>+$2,200</td><td>$9,050</td></tr>
            <tr><td>Feb 11</td><td>Daily Sales (Est.)</td><td>+$2,400</td><td>$11,450</td></tr>
            <tr><td>Feb 12</td><td>Payroll</td><td>-$4,200</td><td style="color: var(--color-warning-default);">$7,250</td></tr>
            <tr><td>Feb 12</td><td>Daily Sales (Est.)</td><td>+$2,100</td><td>$9,350</td></tr>
            <tr><td>Feb 14</td><td>Sysco Invoice</td><td>-$1,240</td><td>$8,110</td></tr>
            <tr><td>Feb 15</td><td>Rent</td><td>-$2,800</td><td>$5,310</td></tr>
          </tbody>
        </table>
        
        <p><strong>Note:</strong> Sales estimates based on last 4 weeks' average. Valentine's weekend (Feb 14-15) typically sees +30% increase.</p>
      `,
      replyButtons: [
        { id: 'improve', label: 'How can I improve this?', nextNodeId: 'options', variant: 'primary' },
        { id: 'assumptions', label: 'What assumptions are used?', nextNodeId: 'assumptions' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'options': {
      id: 'options',
      content: `
        <h2>Options to Improve Cash Flow</h2>
        
        <h3>1. Defer Payments</h3>
        <p>Contact suppliers to push back payment dates. Sysco has historically allowed 7-day deferrals.</p>
        
        <h3>2. Accelerate Receivables</h3>
        <p>You have $1,200 in pending catering deposits. Consider sending payment reminders.</p>
        
        <h3>3. Reduce Upcoming Order</h3>
        <p>Your draft Sysco order (#442) is $1,240. Consider reducing non-essential items by ~20%.</p>
        
        <h3>4. Short-term Financing</h3>
        <p>Your business line of credit has $5,000 available. Interest: 12% APR.</p>
      `,
      replyButtons: [
        { id: 'defer', label: 'Help me defer Sysco', nextNodeId: 'defer-sysco', variant: 'primary' },
        { id: 'collect', label: 'Send deposit reminders', nextNodeId: 'collect-deposits' },
        { id: 'reduce', label: 'Review Sysco order', nextNodeId: 'reduce-order' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'defer-options': {
      id: 'defer-options',
      content: `
        <h2>Payment Deferral Options</h2>
        
        <p>Based on your vendor relationships, here are your options:</p>
        
        <h3>Sysco Invoice ($1,240) - Feb 14</h3>
        <p>✅ <strong>Likely deferrable</strong> - You've deferred twice before with no issues. They typically allow 7-14 days.</p>
        
        <h3>Rent ($2,800) - Feb 15</h3>
        <p>⚠️ <strong>Not recommended</strong> - Your lease has a $150 late fee after 5 days.</p>
        
        <h3>Payroll ($4,200) - Feb 12</h3>
        <p>❌ <strong>Not deferrable</strong> - Employee payments should not be delayed.</p>
      `,
      replyButtons: [
        { id: 'defer-sysco', label: 'Defer Sysco payment', nextNodeId: 'defer-sysco', variant: 'primary' },
        { id: 'other-options', label: 'Show other options', nextNodeId: 'options' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'defer-sysco': {
      id: 'defer-sysco',
      content: `
        <h2>Defer Sysco Payment</h2>
        
        <p>I can help you request a deferral for Sysco Invoice #442 ($1,240).</p>
        
        <h3>Recommended Request:</h3>
        <ul>
          <li><strong>New Due Date:</strong> February 21 (7-day deferral)</li>
          <li><strong>Impact:</strong> Improves Feb 15 balance from $5,310 to $6,550</li>
        </ul>
        
        <h3>Draft Message:</h3>
        <blockquote>
          "Hi, I'd like to request a 7-day extension on Invoice #442 (currently due Feb 14). 
          Would Feb 21 work? We have a large catering event that weekend and expect strong cash flow. Thank you!"
        </blockquote>
        
        <p><em>In a real implementation, I could send this request for you.</em></p>
      `,
      replyButtons: [
        { id: 'send', label: 'Send this request', nextNodeId: 'defer-sent', variant: 'primary' },
        { id: 'edit', label: 'Let me edit first', nextNodeId: 'defer-edit' },
        { id: 'back', label: 'Go back', nextNodeId: 'defer-options' },
      ],
    },
    
    'defer-sent': {
      id: 'defer-sent',
      content: `
        <h2>Request Sent ✓</h2>
        
        <p>Your deferral request has been sent to Sysco.</p>
        
        <h3>What happens next:</h3>
        <ul>
          <li>Sysco typically responds within 1 business day</li>
          <li>I'll notify you when they respond</li>
          <li>Your projection will update automatically once confirmed</li>
        </ul>
        
        <p><strong>Updated Projection:</strong> Assuming approval, your Feb 15 balance improves to $6,550.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Great, thanks!', nextNodeId: null, variant: 'primary' },
        { id: 'more', label: 'Anything else I should do?', nextNodeId: 'options' },
      ],
    },
    
    'defer-edit': {
      id: 'defer-edit',
      content: `
        <h2>Edit Deferral Request</h2>
        
        <p>You can customize the message before sending:</p>
        
        <p><em>In a real implementation, there would be an editable text area here.</em></p>
        
        <p>For now, let's proceed with the draft message.</p>
      `,
      replyButtons: [
        { id: 'send', label: 'Send the request', nextNodeId: 'defer-sent', variant: 'primary' },
        { id: 'back', label: 'Go back', nextNodeId: 'defer-sysco' },
      ],
    },
    
    'collect-deposits': {
      id: 'collect-deposits',
      content: `
        <h2>Collect Pending Deposits</h2>
        
        <p>You have <strong>2 pending catering deposits</strong> totaling <strong>$1,200</strong>:</p>
        
        <table>
          <thead>
            <tr><th>Client</th><th>Event Date</th><th>Deposit Due</th><th>Amount</th></tr>
          </thead>
          <tbody>
            <tr><td>Johnson Wedding</td><td>Feb 22</td><td>Feb 8 (overdue)</td><td>$750</td></tr>
            <tr><td>Corp Lunch - Acme</td><td>Feb 18</td><td>Feb 11</td><td>$450</td></tr>
          </tbody>
        </table>
        
        <p>Would you like me to send payment reminders?</p>
      `,
      replyButtons: [
        { id: 'send-all', label: 'Send reminders to both', nextNodeId: 'reminders-sent', variant: 'primary' },
        { id: 'johnson-only', label: 'Just the overdue one', nextNodeId: 'reminders-sent' },
        { id: 'back', label: 'Go back', nextNodeId: 'options' },
      ],
    },
    
    'reminders-sent': {
      id: 'reminders-sent',
      content: `
        <h2>Reminders Sent ✓</h2>
        
        <p>Payment reminders have been sent. If collected, this would add up to $1,200 to your balance.</p>
        
        <p><em>I'll notify you when payments are received.</em></p>
      `,
      replyButtons: [
        { id: 'done', label: 'Done', nextNodeId: null, variant: 'primary' },
        { id: 'more', label: 'What else can I do?', nextNodeId: 'options' },
      ],
    },
    
    'reduce-order': {
      id: 'reduce-order',
      content: `
        <h2>Review Sysco Order #442</h2>
        
        <p>Current order total: <strong>$1,240.50</strong></p>
        
        <h3>Suggested Reductions:</h3>
        <ul>
          <li><strong>Atlantic Salmon:</strong> 8kg → 6kg (saves $37)</li>
          <li><strong>Asparagus:</strong> 18 bunches → 12 bunches (saves $27)</li>
          <li><strong>Ribeye:</strong> 35 units → 28 units (saves $102)</li>
        </ul>
        
        <p><strong>Potential Savings:</strong> $166 (13% reduction)</p>
        <p><strong>New Order Total:</strong> $1,074.50</p>
        
        <p>⚠️ Note: These reductions may impact Saturday service if Valentine's traffic is higher than expected.</p>
      `,
      replyButtons: [
        { id: 'apply', label: 'Apply these reductions', nextNodeId: 'order-updated', variant: 'primary' },
        { id: 'keep', label: 'Keep original order', nextNodeId: 'options' },
        { id: 'back', label: 'Go back', nextNodeId: 'options' },
      ],
    },
    
    'order-updated': {
      id: 'order-updated',
      content: `
        <h2>Order Updated ✓</h2>
        
        <p>Sysco Order #442 has been updated with the suggested reductions.</p>
        
        <ul>
          <li><strong>New Total:</strong> $1,074.50 (was $1,240.50)</li>
          <li><strong>Savings:</strong> $166</li>
        </ul>
        
        <p>Your cash flow projection has been updated accordingly.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Done', nextNodeId: null, variant: 'primary' },
        { id: 'more', label: 'Anything else?', nextNodeId: 'options' },
      ],
    },
    
    'details': {
      id: 'details',
      content: `
        <h2>Understanding Your Cash Position</h2>
        
        <p>Here's a breakdown of how I calculated this warning:</p>
        
        <h3>Current State (Feb 9)</h3>
        <ul>
          <li>Checking Balance: $6,850</li>
          <li>Accounts Receivable: $1,200 (catering deposits)</li>
          <li>Available Credit: $5,000</li>
        </ul>
        
        <h3>Why This Matters</h3>
        <p>Falling below $1,000 could cause:</p>
        <ul>
          <li>Declined supplier payments</li>
          <li>Payroll processing delays</li>
          <li>Damage to vendor relationships</li>
        </ul>
        
        <h3>Historical Context</h3>
        <p>This happened once before (October 2024). You deferred a supplier payment and recovered within 5 days.</p>
      `,
      replyButtons: [
        { id: 'options', label: 'What can I do?', nextNodeId: 'options', variant: 'primary' },
        { id: 'projection', label: 'Show projection', nextNodeId: 'projection' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'assumptions': {
      id: 'assumptions',
      content: `
        <h2>Projection Assumptions</h2>
        
        <h3>Sales Estimates</h3>
        <p>Based on your average daily sales over the past 4 weeks:</p>
        <ul>
          <li>Weekdays: $2,100 - $2,400</li>
          <li>Weekends: $3,200 - $3,800</li>
        </ul>
        
        <h3>Seasonal Adjustment</h3>
        <p>Valentine's weekend typically sees a 30% boost. This is factored into Feb 14-15 estimates.</p>
        
        <h3>Fixed Costs</h3>
        <p>Payroll and rent are based on your actual scheduled amounts.</p>
        
        <h3>Variable Costs</h3>
        <p>Supplier invoices reflect your current outstanding balances.</p>
      `,
      replyButtons: [
        { id: 'projection', label: 'Back to projection', nextNodeId: 'projection' },
        { id: 'options', label: 'What are my options?', nextNodeId: 'options' },
      ],
    },
  },
};
