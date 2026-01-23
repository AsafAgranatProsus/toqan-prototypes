/**
 * Late Delivery Priority Flow
 * 
 * Flow for handling the "Late Delivery Alert" priority.
 */

import type { ChatFlow } from '../../../../shared/chatSession';

export const deliveryFlow: ChatFlow = {
  id: 'priority-delivery',
  name: 'Late Delivery Alert',
  category: 'priorities',
  initialNodeId: 'intro',
  matchPatterns: ['delivery late', 'sysco delay', 'truck delayed', 'supplies late', 'delivery eta'],
  nodes: {
    'intro': {
      id: 'intro',
      content: `
        <h2>Late Delivery Alert: Sysco</h2>
        
        <p>Your Sysco delivery truck is <strong>delayed by 2 hours</strong>.</p>
        
        <h3>Details:</h3>
        <ul>
          <li><strong>Original ETA:</strong> 9:00 AM</li>
          <li><strong>New ETA:</strong> 11:00 AM</li>
          <li><strong>Reason:</strong> Traffic delay on I-405</li>
        </ul>
        
        <h3>Items on This Delivery:</h3>
        <ul>
          <li>Atlantic Salmon - 8kg</li>
          <li>Ribeye Steaks - 35 units</li>
          <li>Heavy Cream - 8 quarts</li>
          <li>Produce items (lemons, asparagus)</li>
        </ul>
      `,
      replyButtons: [
        { id: 'impact', label: 'What\'s the impact?', nextNodeId: 'impact', variant: 'primary', matchKeywords: ['impact', 'affect', 'problem'] },
        { id: 'track', label: 'Track the truck', nextNodeId: 'track', matchKeywords: ['track', 'where', 'location'] },
        { id: 'alternatives', label: 'Any alternatives?', nextNodeId: 'alternatives', matchKeywords: ['alternative', 'backup', 'else'] },
      ],
    },
    
    'impact': {
      id: 'impact',
      content: `
        <h2>Delivery Delay Impact</h2>
        
        <h3>Lunch Service (11:30 AM - 2:00 PM)</h3>
        <p>⚠️ <strong>At Risk</strong> - The salmon and ribeye are needed for lunch prep, which normally starts at 9:30 AM.</p>
        
        <h3>Affected Menu Items:</h3>
        <ul>
          <li><strong>Pan-Seared Salmon</strong> - Cannot prep until delivery</li>
          <li><strong>Ribeye Steak</strong> - Cannot portion until delivery</li>
          <li><strong>Asparagus sides</strong> - Limited current stock</li>
        </ul>
        
        <h3>Current Inventory:</h3>
        <ul>
          <li>Salmon: 2kg remaining (4-5 portions)</li>
          <li>Ribeye: 5 units remaining</li>
          <li>Asparagus: 2 bunches</li>
        </ul>
        
        <p>With 11 AM arrival, prep can start by 11:30. First orders would be delayed ~15-20 minutes.</p>
      `,
      replyButtons: [
        { id: 'mitigate', label: 'How do we mitigate?', nextNodeId: 'mitigate', variant: 'primary' },
        { id: 'notify', label: 'Notify the kitchen', nextNodeId: 'notify-kitchen' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'mitigate': {
      id: 'mitigate',
      content: `
        <h2>Mitigation Options</h2>
        
        <h3>Option 1: Adjust Prep Schedule</h3>
        <p>Have the team focus on non-affected items until delivery arrives. Salmon and ribeye prep can be expedited.</p>
        
        <h3>Option 2: Update Specials Board</h3>
        <p>Push non-affected dishes as today's specials to reduce pressure on salmon/ribeye during early lunch.</p>
        
        <h3>Option 3: Quick Stock Run</h3>
        <p>Send someone to a local supplier (Restaurant Depot is 15 min away) for emergency salmon/ribeye if needed.</p>
        
        <h3>My Recommendation:</h3>
        <p>Adjust prep schedule and push the <strong>Truffle Pasta</strong> as the lunch special. It's high-margin and doesn't depend on this delivery.</p>
      `,
      replyButtons: [
        { id: 'adjust', label: 'Adjust prep schedule', nextNodeId: 'prep-adjusted', variant: 'primary' },
        { id: 'special', label: 'Update specials board', nextNodeId: 'special-updated' },
        { id: 'stock-run', label: 'Plan emergency stock run', nextNodeId: 'stock-run' },
        { id: 'back', label: 'Go back', nextNodeId: 'impact' },
      ],
    },
    
    'prep-adjusted': {
      id: 'prep-adjusted',
      content: `
        <h2>Prep Schedule Adjusted ✓</h2>
        
        <p>I've updated the kitchen prep priorities:</p>
        
        <h3>New Priority Order (9:30 - 11:00 AM):</h3>
        <ol>
          <li>Sauce preparations</li>
          <li>Vegetable prep (non-delivery items)</li>
          <li>Dessert plating prep</li>
          <li>Station setup</li>
        </ol>
        
        <h3>Post-Delivery (11:00+ AM):</h3>
        <ol>
          <li>Salmon portioning (expedited)</li>
          <li>Ribeye prep</li>
          <li>Asparagus blanching</li>
        </ol>
        
        <p>The kitchen team has been notified.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Great, thanks!', nextNodeId: null, variant: 'primary' },
        { id: 'notify', label: 'Also notify front of house', nextNodeId: 'foh-notified' },
      ],
    },
    
    'special-updated': {
      id: 'special-updated',
      content: `
        <h2>Specials Board Updated ✓</h2>
        
        <p>Today's lunch special has been changed to:</p>
        
        <h3>Truffle Mushroom Pasta - $24</h3>
        <p><em>House-made pappardelle, wild mushroom medley, truffle cream, parmesan crisp</em></p>
        
        <p>This dish:</p>
        <ul>
          <li>Uses ingredients already in stock</li>
          <li>Has $14 margin (58%)</li>
          <li>Is a "Puzzle" item we've been trying to promote</li>
        </ul>
        
        <p>Front of house has been notified to push the special.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Perfect!', nextNodeId: null, variant: 'primary' },
        { id: 'also-adjust', label: 'Also adjust prep schedule', nextNodeId: 'prep-adjusted' },
      ],
    },
    
    'stock-run': {
      id: 'stock-run',
      content: `
        <h2>Emergency Stock Run</h2>
        
        <p>If you need items before the Sysco truck arrives:</p>
        
        <h3>Restaurant Depot (15 min away)</h3>
        <ul>
          <li>Salmon: ~$22/kg (vs $18.50 Sysco)</li>
          <li>Ribeye 12oz: ~$16/ea (vs $14.50 Sysco)</li>
        </ul>
        
        <h3>Estimated Extra Cost:</h3>
        <p>If you buy 4kg salmon + 15 ribeyes to bridge the gap: ~$65 extra</p>
        
        <h3>Time Needed:</h3>
        <p>30-40 minutes round trip + shopping</p>
        
        <p>⚠️ This might not be necessary if the truck arrives by 11 AM as currently estimated.</p>
      `,
      replyButtons: [
        { id: 'wait', label: 'Let\'s wait for the truck', nextNodeId: 'wait-confirmed', variant: 'primary' },
        { id: 'send', label: 'Send someone now', nextNodeId: 'stock-run-dispatched' },
        { id: 'back', label: 'See other options', nextNodeId: 'mitigate' },
      ],
    },
    
    'wait-confirmed': {
      id: 'wait-confirmed',
      content: `
        <h2>Waiting for Sysco Delivery</h2>
        
        <p>Good call. The truck is still on track for 11 AM.</p>
        
        <p>I'll monitor the ETA and alert you if anything changes.</p>
        
        <h3>Backup Plan:</h3>
        <p>If the truck isn't here by 10:30 AM, I'll recommend the stock run option.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Sounds good', nextNodeId: null, variant: 'primary' },
        { id: 'track', label: 'Track the truck', nextNodeId: 'track' },
      ],
    },
    
    'stock-run-dispatched': {
      id: 'stock-run-dispatched',
      content: `
        <h2>Stock Run Initiated</h2>
        
        <p>Shopping list sent to John D. (available this morning).</p>
        
        <h3>Items to Pick Up:</h3>
        <ul>
          <li>Atlantic Salmon - 4kg</li>
          <li>Ribeye Steaks 12oz - 15 units</li>
        </ul>
        
        <h3>Estimated:</h3>
        <ul>
          <li>Departure: Now</li>
          <li>Return: ~9:45 AM</li>
          <li>Extra cost: ~$65</li>
        </ul>
        
        <p>This ensures lunch prep can start on time.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Great, thanks!', nextNodeId: null, variant: 'primary' },
      ],
    },
    
    'notify-kitchen': {
      id: 'notify-kitchen',
      content: `
        <h2>Kitchen Notified ✓</h2>
        
        <p>The kitchen team has been alerted about the delivery delay.</p>
        
        <h3>Message Sent:</h3>
        <blockquote>
          "Sysco delivery delayed to 11 AM (was 9 AM). Salmon, ribeye, cream, and produce affected. Please adjust prep priorities - focus on non-delivery items first."
        </blockquote>
        
        <p>Sarah J. (Manager on duty) has acknowledged.</p>
      `,
      replyButtons: [
        { id: 'done', label: 'Done', nextNodeId: null, variant: 'primary' },
        { id: 'mitigate', label: 'What else can we do?', nextNodeId: 'mitigate' },
      ],
    },
    
    'foh-notified': {
      id: 'foh-notified',
      content: `
        <h2>Front of House Notified ✓</h2>
        
        <p>The FOH team has been alerted:</p>
        
        <blockquote>
          "Heads up: Some lunch items may have slightly delayed availability (salmon, ribeye) due to a delivery delay. Push the Truffle Pasta special and other non-affected items for early orders."
        </blockquote>
      `,
      replyButtons: [
        { id: 'done', label: 'All set!', nextNodeId: null, variant: 'primary' },
      ],
    },
    
    'track': {
      id: 'track',
      content: `
        <h2>Delivery Tracking</h2>
        
        <p><strong>Sysco Truck #4421</strong></p>
        
        <h3>Current Status:</h3>
        <ul>
          <li><strong>Location:</strong> I-405 near Culver City</li>
          <li><strong>Distance:</strong> ~8 miles out</li>
          <li><strong>Current ETA:</strong> 11:02 AM</li>
        </ul>
        
        <h3>Delivery Stops:</h3>
        <ol>
          <li>✓ Completed - Marina del Rey Bistro</li>
          <li>● In Transit - Your Restaurant (next stop)</li>
          <li>○ Pending - Santa Monica Grill</li>
        </ol>
        
        <p><em>Last updated: 1 minute ago</em></p>
      `,
      replyButtons: [
        { id: 'refresh', label: 'Refresh tracking', nextNodeId: 'track' },
        { id: 'impact', label: 'What\'s the impact?', nextNodeId: 'impact', variant: 'primary' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
    
    'alternatives': {
      id: 'alternatives',
      content: `
        <h2>Alternative Options</h2>
        
        <h3>Option 1: Wait for Sysco (Recommended)</h3>
        <p>11 AM arrival still gives time for lunch prep with some adjustments.</p>
        
        <h3>Option 2: Emergency Stock Run</h3>
        <p>Restaurant Depot is 15 min away. Higher prices but immediate availability.</p>
        
        <h3>Option 3: Call Another Supplier</h3>
        <p>US Foods might have same-day delivery available, but unlikely on short notice.</p>
        
        <h3>Option 4: Menu Adjustment</h3>
        <p>86 the salmon and ribeye for early lunch; push other dishes as specials.</p>
      `,
      replyButtons: [
        { id: 'wait', label: 'Wait for Sysco', nextNodeId: 'wait-confirmed', variant: 'primary' },
        { id: 'stock-run', label: 'Plan stock run', nextNodeId: 'stock-run' },
        { id: 'menu', label: 'Adjust the menu', nextNodeId: 'special-updated' },
        { id: 'back', label: 'Go back', nextNodeId: 'intro' },
      ],
    },
  },
};
