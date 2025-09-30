import React from 'react';
import './SemanticMessage.css';

const Message: React.FC = () => {
  return (
    <div className="message-container"><h1>🎨 <strong className="message-heading">Toqan's UI Elements Boilerplate</strong></h1>
      <p className="message-text">Here's my complete arsenal of formatting and display elements:</p>
      <h2><strong className="message-heading">Text Formatting Elements</strong></h2>
      <h3><strong className="message-heading">Basic Text Styles</strong></h3>
      <ul>
        <li className="message-text"><strong className="message-heading">Bold text</strong> for emphasis and headings</li>
        <li className="message-text"><em>Italic text</em> for subtle emphasis</li>
        <li className="message-text"><del>Strikethrough text</del> for corrections or alternatives</li>
        <li className="message-text"><code className="message-inline-code">Inline code</code> for technical terms</li>
        <li className="message-text">Regular text for standard content</li>
      </ul>
      <h3><strong className="message-heading">Code Blocks</strong></h3>
      <pre><article className="message-code-block"><header className="message-code-block-header"><p className="message-code-block-language">python</p><button className="message-code-block-copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="message-code-block-content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code className="language-python" style={{padding: "0px", whiteSpace: "pre"}}><span className="token" style={{color: "rgb(125, 139, 153)"}}># Block code for longer snippets</span><span>
</span><span></span><span className="token" style={{color: "rgb(25, 144, 184)"}}>def</span><span> </span><span className="token" style={{color: "rgb(47, 156, 10)"}}>example_function</span><span className="token" style={{color: "rgb(95, 99, 100)"}}>(</span><span className="token" style={{color: "rgb(95, 99, 100)"}}>)</span><span className="token" style={{color: "rgb(95, 99, 100)"}}>:</span><span>
</span><span>    </span><span className="token" style={{color: "rgb(25, 144, 184)"}}>return</span><span> </span><span className="token" style={{color: "rgb(47, 156, 10)"}}>"formatted code"</span><span>
</span></code></pre></div></article></pre>
      <pre><article className="message-code-block"><header className="message-code-block-header"><p className="message-code-block-language"></p><button className="message-code-block-copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="message-code-block-content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span># Plain text code blocks
</span>command --option value
</code></pre></div></article></pre>
      <h2><strong className="message-heading">List Structures</strong></h2>
      <h3><strong className="message-heading">Unordered Lists</strong></h3>
      <p className="message-text">• Primary bullet point<br />
• Secondary item with <strong className="message-heading">bold emphasis</strong><br />
• Item with <em>italic text</em><br />
• Item with <code className="message-inline-code">inline code</code><br />
• Item with :emoji: integration</p>
      <h3><strong className="message-heading">Nested Lists</strong></h3>
      <p className="message-text">• Main category<br />
• Sub-item one<br />
• Sub-item two<br />
• Deep nested item<br />
• Another main item</p>
      <h3><strong className="message-heading">Numbered Lists</strong></h3>
      <ol>
        <li className="message-text">First ordered item</li>
        <li className="message-text">Second item with <strong className="message-heading">bold text</strong></li>
        <li className="message-text">Third item with <code className="message-inline-code">code element</code></li>
        <li className="message-text">Final numbered item</li>
      </ol>
      <h2><strong className="message-heading">Quote and Callout Elements</strong></h2>
      <h3><strong className="message-heading">Blockquotes</strong></h3>
      <blockquote>
        <p className="message-text">Important information or quotes<br />
Multi-line blockquotes for emphasis<br />
Used for highlighting key concepts</p>
      </blockquote>
      <h3><strong className="message-heading">Callout Boxes</strong> (Bold + Emoji Pattern)</h3>
      <p className="message-text">🚨 <strong className="message-heading">Warning</strong>: Critical information here<br />
✅ <strong className="message-heading">Success</strong>: Positive outcomes and confirmations<br />
💡 <strong className="message-heading">Pro Tip</strong>: Helpful suggestions and insights<br />
📝 <strong className="message-heading">Note</strong>: Additional context and details<br />
🔥 <strong className="message-heading">Hot Tip</strong>: Special recommendations</p>
      <h2><strong className="message-heading">Visual Separators</strong></h2>
      <h3><strong className="message-heading">Section Dividers</strong></h3>
      <hr className="message-divider" />
      <p className="message-text"><em>Horizontal line for major section breaks</em></p>
      <h3><strong className="message-heading">Emoji Headers</strong></h3>
      <p className="message-text">🎯 <strong className="message-heading">Action Items</strong><br />
📊 <strong className="message-heading">Data Results</strong><br />
🔍 <strong className="message-heading">Analysis Summary</strong><br />
⚡ <strong className="message-heading">Quick Facts</strong></p>
      <h2><strong className="message-heading">Interactive Elements</strong></h2>
      <h3><strong className="message-heading">Links and References</strong></h3>
      <ul>
        <li className="message-text"><a target="_blank" rel="noopener noreferrer" className="message-link">Example Link<span className="sc-ivxoEo dEnMwK sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link" aria-hidden="true"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg></span></a> for external resources</li>
        <li className="message-text">Internal references to <em>previous sections</em></li>
        <li className="message-text">File references: <code className="message-inline-code">filename.xlsx</code> or <strong className="message-heading">document.pdf</strong></li>
      </ul>
      <h3><strong className="message-heading">Action-Oriented Formatting</strong></h3>
      <pre><article className="message-code-block"><header className="message-code-block-header"><p className="message-code-block-language"></p><button className="message-code-block-copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="message-code-block-content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>🚀 Ready to proceed? Choose an option:
</span>• Option A: Description here
• Option B: Alternative approach
• Option C: Different method
</code></pre></div></article></pre>
      <h2><strong className="message-heading">Data Display Patterns</strong></h2>
      <h3><strong className="message-heading">Key-Value Displays</strong></h3>
      <p className="message-text"><strong className="message-heading">Status</strong>: ✅ Complete<br />
<strong className="message-heading">Progress</strong>: 75%<br />
<strong className="message-heading">Next Step</strong>: Data analysis<br />
<strong className="message-heading">Files</strong>: 3 processed</p>
      <h3><strong className="message-heading">Multi-Column Information</strong></h3>
      <p className="message-text"><strong className="message-heading">Category</strong> | <strong className="message-heading">Details</strong> | <strong className="message-heading">Status</strong><br />
Performance metrics | High efficiency | ✅ Active<br />
Error handling | Robust system | ⚠️ Monitoring<br />
User feedback | Positive trends | 📈 Growing</p>
      <p className="message-text"><em>Note: For complex tables, I use the send_file_to_user tool instead</em></p>
      <h2><strong className="message-heading">Emoji Usage Patterns</strong></h2>
      <h3><strong className="message-heading">Status Indicators</strong></h3>
      <p className="message-text">✅ Complete | ⚠️ Warning | ❌ Error | ⏳ In Progress | 🔄 Processing</p>
      <h3><strong className="message-heading">Category Icons</strong></h3>
      <p className="message-text">📊 Data | 📝 Documents | 🎨 Creative | 🔍 Research | 💻 Technical | 🌐 Web</p>
      <h3><strong className="message-heading">Action Emojis</strong></h3>
      <p className="message-text">🚀 Launch | ⬆️ Upload | ⬇️ Download | 🔧 Configure | 🎯 Target | 💡 Idea</p>
      <h2><strong className="message-heading">Response Structure Templates</strong></h2>
      <h3><strong className="message-heading">Standard Analysis Response</strong></h3>
      <pre><article className="message-code-block"><header className="message-code-block-header"><p className="message-code-block-language"></p><button className="message-code-block-copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="message-code-block-content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>🔍 **Analysis Summary**
</span>
**Key Findings:**
• Finding one with details
• Finding two with metrics
• Finding three with implications

📊 **Results:**
- Metric 1: Value
- Metric 2: Value  
- Metric 3: Value

💡 **Recommendations:**
1. Action item one
2. Action item two
3. Follow-up step

**Next Steps:** What to do next
</code></pre></div></article></pre>
      <h3><strong className="message-heading">Error/Help Response</strong></h3>
      <pre><article className="message-code-block"><header className="message-code-block-header"><p className="message-code-block-language"></p><button className="message-code-block-copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="message-code-block-content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>⚠️ **Issue Detected**
</span>
**Problem:** Brief description

**Possible Solutions:**
• Solution option 1
• Solution option 2  
• Alternative approach

🤝 **Need Help?** Ask me to clarify any part of this process.
</code></pre></div></article></pre>
      <h3><strong className="message-heading">Success Response</strong></h3>
      <pre><article className="message-code-block"><header className="message-code-block-header"><p className="message-code-block-language"></p><button className="message-code-block-copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="message-code-block-content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>✅ **Task Completed Successfully**
</span>
**What I Did:**
1. Step one description
2. Step two description
3. Final step description

📁 **Files Created:** filename.ext
🎯 **Ready for:** Next action

**Want to proceed?** Let me know your next step!
</code></pre></div></article></pre>
      <hr className="message-divider" />
      <p className="message-text">💡 <strong className="message-heading">Usage Notes:</strong></p>
      <ul>
        <li className="message-text">I avoid <code className="message-inline-code">#</code> markdown headers in favor of <strong className="message-heading">bold headings</strong></li>
        <li className="message-text">Tables get sent as files rather than markdown</li>
        <li className="message-text">Emojis enhance readability and engagement</li>
        <li className="message-text">Structure adapts based on content type and user needs</li>
      </ul>
      <p className="message-text">🎨 <strong className="message-heading">This is my complete UI toolkit!</strong> Each element serves a specific purpose in making information clear, engaging, and actionable.</p></div>
  );
};

export default Message;
