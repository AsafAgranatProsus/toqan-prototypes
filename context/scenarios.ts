export interface Scenario {
  title: string;
  prompt: string;
  outputBefore: string;
  outputAfter: string;
}

export const scenarios: Scenario[] = [
  {
    title: "chat with math",
    prompt: "explain the difference between sigmoid activation function and relu and swish",
    outputBefore: `<h1>Activation Functions Comparison: Sigmoid vs ReLU vs Swish</h1>
<h2><strong class='sc-eOzmre DpLZr'>Sigmoid Activation Function</strong></h2>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Mathematical Formula:</strong> <code class='sc-bdbhkv hqnoCs'>f(x) = 1 / (1 + e^(-x))</code></p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Key Characteristics:</strong><br>
• <strong class='sc-eOzmre DpLZr'>Range:</strong> (0, 1) - outputs are bounded between 0 and 1<br>
• <strong class='sc-eOzmre DpLZr'>Shape:</strong> S-shaped curve that's smooth and differentiable everywhere<br>
• <strong class='sc-eOzmre DpLZr'>Derivative:</strong> <code class='sc-bdbhkv hqnoCs'>f'(x) = f(x) * (1 - f(x))</code></p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Advantages:</strong><br>
• Smooth gradient transitions<br>
• Output can be interpreted as probabilities<br>
• Historically well-understood and widely used<br>
• Good for binary classification output layers</p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Disadvantages:</strong><br>
• <strong class='sc-eOzmre DpLZr'>Vanishing gradient problem</strong> - gradients become very small for large |x| values<br>
• <strong class='sc-eOzmre DpLZr'>Not zero-centered</strong> - outputs are always positive, which can slow convergence<br>
• <strong class='sc-eOzmre DpLZr'>Computationally expensive</strong> due to exponential calculation<br>
• <strong class='sc-eOzmre DpLZr'>Saturation</strong> - neurons can get "stuck" in saturation regions</p>
<hr class='sc-eauhAA kmiXGo'>
<h2><strong class='sc-eOzmre DpLZr'>ReLU (Rectified Linear Unit)</strong></h2>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Mathematical Formula:</strong> <code class='sc-bdbhkv hqnoCs'>f(x) = max(0, x)</code></p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Key Characteristics:</strong><br>
• <strong class='sc-eOzmre DpLZr'>Range:</strong> [0, ∞) - outputs zero for negative inputs, linear for positive<br>
• <strong class='sc-eOzmre DpLZr'>Shape:</strong> Piecewise linear function with a sharp corner at x=0<br>
• <strong class='sc-eOzmre DpLZr'>Derivative:</strong> 0 for x < 0, 1 for x > 0 (undefined at x=0)</p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Advantages:</strong><br>
• <strong class='sc-eOzmre DpLZr'>Computationally efficient</strong> - simple max operation<br>
• <strong class='sc-eOzmre DpLZr'>Mitigates vanishing gradient problem</strong> for positive values<br>
• <strong class='sc-eOzmre DpLZr'>Sparse activation</strong> - many neurons output zero, creating sparse representations<br>
• <strong class='sc-eOzmre DpLZr'>Faster convergence</strong> compared to sigmoid/tanh<br>
• <strong class='sc-eOzmre DpLZr'>Unbounded above</strong> - no saturation for positive values</p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Disadvantages:</strong><br>
• <strong class='sc-eOzmre DpLZr'>Dying ReLU problem</strong> - neurons can permanently output zero<br>
• <strong class='sc-eOzmre DpLZr'>Not differentiable at zero</strong> (though this rarely causes practical issues)<br>
• <strong class='sc-eOzmre DpLZr'>Not zero-centered</strong><br>
• <strong class='sc-eOzmre DpLZr'>Can be brittle</strong> during training with high learning rates</p>
<hr class='sc-eauhAA kmiXGo'>
<h2><strong class='sc-eOzmre DpLZr'>Swish Activation Function</strong></h2>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Mathematical Formula:</strong> <code class='sc-bdbhkv hqnoCs'>f(x) = x * sigmoid(x) = x / (1 + e^(-x))</code></p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Key Characteristics:</strong><br>
• <strong class='sc-eOzmre DpLZr'>Range:</strong> (-∞, ∞) - unbounded but approaches limits asymptotically<br>
• <strong class='sc-eOzmre DpLZr'>Shape:</strong> Smooth, non-monotonic curve that dips below zero for negative x<br>
• <strong class='sc-eOzmre DpLZr'>Derivative:</strong> <code class='sc-bdbhkv hqnoCs'>f'(x) = f(x) + sigmoid(x) * (1 - f(x))</code></p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Advantages:</strong><br>
• <strong class='sc-eOzmre DpLZr'>Smooth and differentiable everywhere</strong> - no sharp corners like ReLU<br>
• <strong class='sc-eOzmre DpLZr'>Self-gating property</strong> - uses its own value to gate the input<br>
• <strong class='sc-eOzmre DpLZr'>Better empirical performance</strong> than ReLU in many deep networks<br>
• <strong class='sc-eOzmre DpLZr'>Bounded below, unbounded above</strong> - combines benefits of both sigmoid and ReLU<br>
• <strong class='sc-eOzmre DpLZr'>Non-monotonic</strong> - can have negative outputs for negative inputs</p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Disadvantages:</strong><br>
• <strong class='sc-eOzmre DpLZr'>More computationally expensive</strong> than ReLU due to sigmoid calculation<br>
• <strong class='sc-eOzmre DpLZr'>Less interpretable</strong> than simpler functions<br>
• <strong class='sc-eOzmre DpLZr'>Relatively newer</strong> - less extensively studied than ReLU/sigmoid<br>
• <strong class='sc-eOzmre DpLZr'>Can still suffer from vanishing gradients</strong> for very negative inputs</p>
<hr class='sc-eauhAA kmiXGo'>
<h2><strong class='sc-eOzmre DpLZr'>Comparative Summary</strong></h2>
<div class='sc-ovuCP ddbxRX table-wrapper' style="overflow-x: auto;
    overscroll-behavior-x: contain;"><table node='[object Object]'><thead><tr><th><strong class='sc-eOzmre DpLZr'>Aspect</strong></th><th><strong class='sc-eOzmre DpLZr'>Sigmoid</strong></th><th><strong class='sc-eOzmre DpLZr'>ReLU</strong></th><th><strong class='sc-eOzmre DpLZr'>Swish</strong></th></tr></thead><tbody><tr><td><strong class='sc-eOzmre DpLZr'>Computational Cost</strong></td><td>High</td><td>Low</td><td>Medium</td></tr><tr><td><strong class='sc-eOzmre DpLZr'>Vanishing Gradient</strong></td><td>High risk</td><td>Low risk (positive)</td><td>Medium risk</td></tr><tr><td><strong class='sc-eOzmre DpLZr'>Smoothness</strong></td><td>✅ Smooth</td><td>❌ Sharp corner</td><td>✅ Smooth</td></tr><tr><td><strong class='sc-eOzmre DpLZr'>Zero-Centered</strong></td><td>❌ No</td><td>❌ No</td><td>✅ Approximately</td></tr><tr><td><strong class='sc-eOzmre DpLZr'>Common Usage</strong></td><td>Output layers</td><td>Hidden layers</td><td>Modern deep networks</td></tr></tbody></table></div>
<h2><strong class='sc-eOzmre DpLZr'>When to Use Each</strong></h2>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Sigmoid:</strong><br>
• Binary classification output layers<br>
• When you need probabilistic outputs<br>
• Gates in LSTM/GRU cells</p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>ReLU:</strong><br>
• Default choice for hidden layers in deep networks<br>
• When computational efficiency is critical<br>
• Convolutional neural networks</p>
<p class='sc-blHHSb djcjxz'><strong class='sc-eOzmre DpLZr'>Swish:</strong><br>
• State-of-the-art deep networks where performance is prioritized<br>
• When you want smooth gradients without ReLU's limitations<br>
• Modern transformer architectures and advanced CNNs</p>`,
    outputAfter: `<div><h1>Activation Functions Comparison: Sigmoid vs ReLU vs Swish</h1>
<hr>
<h2>Sigmoid Activation Function</h2>
<div><h3>Mathematical Formula</h3>
<formula-block>f(x) = \\frac{1}{1 + e^{-x}}</formula-block>
</div>
<h3>Key Characteristics:</h3>
<ul>
<li><strong>Range:</strong> <formula>(0, 1)</formula> - outputs are bounded between 0 and 1.</li>
<li><strong>Shape:</strong> S-shaped curve that's smooth and differentiable everywhere.</li>
<li><strong>Derivative:</strong> <formula>f'(x) = f(x) * (1 - f(x))</formula></li>
</ul>
<h3>Advantages:</h3>
<ul>
<li>Smooth gradient transitions.</li>
<li>Output can be interpreted as probabilities.</li>
<li>Historically well-understood and widely used.</li>
<li>Good for <strong>binary classification output layers</strong>.</li>
</ul>
<h3>Disadvantages:</h3>
<ul>
<li><strong>Vanishing gradient problem</strong> - gradients become very small for large <formula>|x|</formula> values.</li>
<li><strong>Not zero-centered</strong> - outputs are always positive, which can slow convergence.</li>
<li><strong>Computationally expensive</strong> due to exponential calculation.</li>
<li><strong>Saturation</strong> - neurons can get "stuck" in saturation regions.</li>
</ul>
<hr>
<h2>ReLU (Rectified Linear Unit)</h2>
<div><h3>Mathematical Formula</h3>
<formula-block>f(x) = \max(0, x)</formula-block>
</div>
<h3>Key Characteristics:</h3>
<ul>
<li><strong>Range:</strong> <formula>[0, \infty)</formula> - outputs zero for negative inputs, linear for positive.</li>
<li><strong>Shape:</strong> Piecewise linear function with a sharp corner at <formula>x=0</formula>.</li>
<li><strong>Derivative:</strong> <formula>0</formula> for <formula>x < 0</formula>, <formula>1</formula> for <formula>x > 0</formula> (undefined at <formula>x=0</formula>).</li>
</ul>
<h3>Advantages:</h3>
<ul>
<li><strong>Computationally efficient</strong> - simple max operation.</li>
<li><strong>Mitigates vanishing gradient problem</strong> for positive values.</li>
<li><strong>Sparse activation</strong> - many neurons output zero, creating sparse representations.</li>
<li><strong>Faster convergence</strong> compared to sigmoid/tanh.</li>
<li><strong>Unbounded above</strong> - no saturation for positive values.</li>
</ul>
<h3>Disadvantages:</h3>
<ul>
<li><strong>Dying ReLU problem</strong> - neurons can permanently output zero.</li>
<li><strong>Not differentiable at zero</strong> (though this rarely causes practical issues).</li>
<li><strong>Not zero-centered</strong>.</li>
<li>Can be brittle during training with high learning rates.</li>
</ul>
<hr>
<h2>Swish Activation Function</h2>
<div><h3>Mathematical Formula</h3>
<formula-block>f(x) = x \cdot \text{sigmoid}(x) = \\frac{x}{1 + e^{-x}}</formula-block>
</div>
<h3>Key Characteristics:</h3>
<ul>
<li><strong>Range:</strong> <formula>(-\infty, \infty)</formula> - unbounded but approaches limits asymptotically.</li>
<li><strong>Shape:</strong> Smooth, <strong>non-monotonic</strong> curve that dips below zero for negative <formula>x</formula>.</li>
<li><strong>Derivative:</strong> <formula>f'(x) = f(x) + \text{sigmoid}(x) \cdot (1 - f(x))</formula></li>
</ul>
<h3>Advantages:</h3>
<ul>
<li><strong>Smooth and differentiable everywhere</strong> - no sharp corners like ReLU.</li>
<li><strong>Self-gating property</strong> - uses its own value to gate the input.</li>
<li><strong>Better empirical performance</strong> than ReLU in many deep networks.</li>
<li>Bounded below, unbounded above - combines benefits of both sigmoid and ReLU.</li>
<li>Non-monotonic - can have negative outputs for negative inputs.</li>
</ul>
<h3>Disadvantages:</h3>
<ul>
<li><strong>More computationally expensive</strong> than ReLU due to sigmoid calculation.</li>
<li><strong>Less interpretable</strong> than simpler functions.</li>
<li>Relatively newer - less extensively studied than ReLU/sigmoid.</li>
<li>Can still suffer from vanishing gradients for very negative inputs.</li>
</ul>
<hr>
<h2>Comparative Summary</h2>
<table>
<thead>
<tr>
<th align="left">Aspect</th>
<th align="left">Sigmoid</th>
<th align="left">ReLU</th>
<th align="left">Swish</th>
</tr>
</thead>
<tbody><tr>
<td align="left"><strong>Computational Cost</strong></td>
<td align="left">High</td>
<td align="left">Low</td>
<td align="left">Medium</td>
</tr>
<tr>
<td align="left"><strong>Vanishing Gradient</strong></td>
<td align="left">High risk</td>
<td align="left">Low risk (positive)</td>
<td align="left">Medium risk</td>
</tr>
<tr>
<td align="left"><strong>Smoothness</strong></td>
<td align="left">✅ Smooth</td>
<td align="left">❌ Sharp corner</td>
<td align="left">✅ Smooth</td>
</tr>
<tr>
<td align="left"><strong>Zero-Centered</strong></td>
<td align="left">❌ No</td>
<td align="left">❌ No</td>
<td align="left">✅ Approximately</td>
</tr>
<tr>
<td align="left"><strong>Common Usage</strong></td>
<td align="left">Output layers</td>
<td align="left">Hidden layers</td>
<td align="left">Modern deep networks</td>
</tr>
</tbody></table>
<hr>
<h2>When to Use Each</h2>
<h3>Sigmoid:</h3>
<ul>
<li>Binary classification output layers.</li>
<li>When you need probabilistic outputs.</li>
<li>Gates in LSTM/GRU cells.</li>
</ul>
<h3>ReLU:</h3>
<ul>
<li>Default choice for <strong>hidden layers</strong> in deep networks.</li>
<li>When computational efficiency is critical.</li>
<li>Convolutional neural networks.</li>
</ul>
<h3>Swish:</h3>
<ul>
<li>State-of-the-art deep networks where performance is prioritized.</li>
<li>When you want smooth gradients without ReLU's limitations.</li>
<li>Modern transformer architectures and advanced CNNs.</li>
</ul>
</div>`,
  },
  
];