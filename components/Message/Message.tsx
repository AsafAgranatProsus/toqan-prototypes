import React from 'react';
import './Message.css';

const Message: React.FC = () => {
  return (
    <div className="message-container modular-scale vertical-rhythm"><h1>🎨 <strong className="text-strong">Toqan's UI Elements Boilerplate</strong></h1>
      <p className="body-text">Here's my complete arsenal of formatting and display elements:</p>
      <h2><strong className="text-strong">Text Formatting Elements</strong></h2>
      <h3><strong className="text-strong">Basic Text Styles</strong></h3>
      <ul>
        <li className="body-text"><strong className="text-strong">Bold text</strong> for emphasis and headings</li>
        <li className="body-text"><em>Italic text</em> for subtle emphasis</li>
        <li className="body-text"><del>Strikethrough text</del> for corrections or alternatives</li>
        <li className="body-text"><code className="inline-code">Inline code</code> for technical terms</li>
        <li className="body-text">Regular text for standard content</li>
      </ul>
      <h3><strong className="text-strong">Code Blocks</strong></h3>
      <pre><article className="code-block"><header className="code-block__header"><p className="code-block__language">python</p><button className="code-block__copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="code-block__content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code className="language-python" style={{padding: "0px", whiteSpace: "pre"}}><span className="token" style={{color: "rgb(125, 139, 153)"}}># Block code for longer snippets</span><span>
</span><span></span><span className="token" style={{color: "rgb(25, 144, 184)"}}>def</span><span> </span><span className="token" style={{color: "rgb(47, 156, 10)"}}>example_function</span><span className="token" style={{color: "rgb(95, 99, 100)"}}>(</span><span className="token" style={{color: "rgb(95, 99, 100)"}}>)</span><span className="token" style={{color: "rgb(95, 99, 100)"}}>:</span><span>
</span><span>    </span><span className="token" style={{color: "rgb(25, 144, 184)"}}>return</span><span> </span><span className="token" style={{color: "rgb(47, 156, 10)"}}>"formatted code"</span><span>
</span></code></pre></div></article></pre>
      <pre><article className="code-block"><header className="code-block__header"><p className="code-block__language"></p><button className="code-block__copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="code-block__content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span># Plain text code blocks
</span>command --option value
</code></pre></div></article></pre>
      <h2><strong className="text-strong">List Structures</strong></h2>
      <h3><strong className="text-strong">Unordered Lists</strong></h3>
      <p className="body-text">• Primary bullet point<br />
• Secondary item with <strong className="text-strong">bold emphasis</strong><br />
• Item with <em>italic text</em><br />
• Item with <code className="inline-code">inline code</code><br />
• Item with :emoji: integration</p>
      <h3><strong className="text-strong">Nested Lists</strong></h3>
      <p className="body-text">• Main category<br />
• Sub-item one<br />
• Sub-item two<br />
• Deep nested item<br />
• Another main item</p>
      <h3><strong className="text-strong">Numbered Lists</strong></h3>
      <ol>
        <li className="body-text">First ordered item</li>
        <li className="body-text">Second item with <strong className="text-strong">bold text</strong></li>
        <li className="body-text">Third item with <code className="inline-code">code element</code></li>
        <li className="body-text">Final numbered item</li>
      </ol>
      <h2><strong className="text-strong">Quote and Callout Elements</strong></h2>
      <h3><strong className="text-strong">Blockquotes</strong></h3>
      <blockquote>
        <p className="body-text">Important information or quotes<br />
Multi-line blockquotes for emphasis<br />
Used for highlighting key concepts</p>
      </blockquote>
      <h3><strong className="text-strong">Callout Boxes</strong> (Bold + Emoji Pattern)</h3>
      <p className="body-text">🚨 <strong className="text-strong">Warning</strong>: Critical information here<br />
✅ <strong className="text-strong">Success</strong>: Positive outcomes and confirmations<br />
💡 <strong className="text-strong">Pro Tip</strong>: Helpful suggestions and insights<br />
📝 <strong className="text-strong">Note</strong>: Additional context and details<br />
🔥 <strong className="text-strong">Hot Tip</strong>: Special recommendations</p>
      <h2><strong className="text-strong">Visual Separators</strong></h2>
      <h3><strong className="text-strong">Section Dividers</strong></h3>
      <hr className="horizontal-divider" />
      <p className="body-text"><em>Horizontal line for major section breaks</em></p>
      <h3><strong className="text-strong">Emoji Headers</strong></h3>
      <p className="body-text">🎯 <strong className="text-strong">Action Items</strong><br />
📊 <strong className="text-strong">Data Results</strong><br />
🔍 <strong className="text-strong">Analysis Summary</strong><br />
⚡ <strong className="text-strong">Quick Facts</strong></p>
      <h2><strong className="text-strong">Interactive Elements</strong></h2>
      <h3><strong className="text-strong">Links and References</strong></h3>
      <ul>
        <li className="body-text"><a target="_blank" rel="noopener noreferrer" className="external-link">Example Link<span className="icon icon__external-link"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link" aria-hidden="true"><path d="M15 3h6v6"></path><path d="M10 14 21 3"></path><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path></svg></span></a> for external resources</li>
        <li className="body-text">Internal references to <em>previous sections</em></li>
        <li className="body-text">File references: <code className="inline-code">filename.xlsx</code> or <strong className="text-strong">document.pdf</strong></li>
      </ul>
      <h3><strong className="text-strong">Action-Oriented Formatting</strong></h3>
      <pre><article className="code-block"><header className="code-block__header"><p className="code-block__language"></p><button className="code-block__copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="code-block__content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>🚀 Ready to proceed? Choose an option:
</span>• Option A: Description here
• Option B: Alternative approach
• Option C: Different method
</code></pre></div></article></pre>
      <h2><strong className="text-strong">Data Display Patterns</strong></h2>
      <h3><strong className="text-strong">Key-Value Displays</strong></h3>
      <p className="body-text"><strong className="text-strong">Status</strong>: ✅ Complete<br />
<strong className="text-strong">Progress</strong>: 75%<br />
<strong className="text-strong">Next Step</strong>: Data analysis<br />
<strong className="text-strong">Files</strong>: 3 processed</p>
      <h3><strong className="text-strong">Multi-Column Information</strong></h3>
      <p className="body-text"><strong className="text-strong">Category</strong> | <strong className="text-strong">Details</strong> | <strong className="text-strong">Status</strong><br />
Performance metrics | High efficiency | ✅ Active<br />
Error handling | Robust system | ⚠️ Monitoring<br />
User feedback | Positive trends | 📈 Growing</p>
      <p className="body-text"><em>Note: For complex tables, I use the send_file_to_user tool instead</em></p>
      <h2><strong className="text-strong">Emoji Usage Patterns</strong></h2>
      <h3><strong className="text-strong">Status Indicators</strong></h3>
      <p className="body-text">✅ Complete | ⚠️ Warning | ❌ Error | ⏳ In Progress | 🔄 Processing</p>
      <h3><strong className="text-strong">Category Icons</strong></h3>
      <p className="body-text">📊 Data | 📝 Documents | 🎨 Creative | 🔍 Research | 💻 Technical | 🌐 Web</p>
      <h3><strong className="text-strong">Action Emojis</strong></h3>
      <p className="body-text">🚀 Launch | ⬆️ Upload | ⬇️ Download | 🔧 Configure | 🎯 Target | 💡 Idea</p>
      <h2><strong className="text-strong">Response Structure Templates</strong></h2>
      <h3><strong className="text-strong">Standard Analysis Response</strong></h3>
      <pre><article className="code-block"><header className="code-block__header"><p className="code-block__language"></p><button className="code-block__copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="code-block__content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>🔍 **Analysis Summary**
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
      <h3><strong className="text-strong">Error/Help Response</strong></h3>
      <pre><article className="code-block"><header className="code-block__header"><p className="code-block__language"></p><button className="code-block__copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="code-block__content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>⚠️ **Issue Detected**
</span>
**Problem:** Brief description

**Possible Solutions:**
• Solution option 1
• Solution option 2  
• Alternative approach

🤝 **Need Help?** Ask me to clarify any part of this process.
</code></pre></div></article></pre>
      <h3><strong className="text-strong">Success Response</strong></h3>
      <pre><article className="code-block"><header className="code-block__header"><p className="code-block__language"></p><button className="code-block__copy-button"><span className="sc-ixGGxD cmjCdk"><span className="sc-ivxoEo geJwQq sc-ghWlax jchMWq"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></span></span></button></header><div className="code-block__content"><pre style={{overflow: "auto", backgroundColor: "rgb(255, 255, 255)", position: "static"}}><code style={{padding: "0px", whiteSpace: "pre"}}><span>✅ **Task Completed Successfully**
</span>
**What I Did:**
1. Step one description
2. Step two description
3. Final step description

📁 **Files Created:** filename.ext
🎯 **Ready for:** Next action

**Want to proceed?** Let me know your next step!
</code></pre></div></article></pre>
      <hr className="horizontal-divider" />
      <p className="body-text">💡 <strong className="text-strong">Usage Notes:</strong></p>
      <ul>
        <li className="body-text">I avoid <code className="inline-code">#</code> markdown headers in favor of <strong className="text-strong">bold headings</strong></li>
        <li className="body-text">Tables get sent as files rather than markdown</li>
        <li className="body-text">Emojis enhance readability and engagement</li>
        <li className="body-text">Structure adapts based on content type and user needs</li>
      </ul>
      <p className="body-text">🎨 <strong className="text-strong">This is my complete UI toolkit!</strong> Each element serves a specific purpose in making information clear, engaging, and actionable.</p></div>
  );
};

export default Message;