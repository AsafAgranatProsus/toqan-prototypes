# Toqan UI Prototypes

A rapid prototyping environment for experimenting with UX patterns, UI components, features, and design ideas for Toqan. Built on a lean, token-forward design system that stays out of your way.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🎯 Purpose

This repository is a **sandbox for rapid experimentation**. Test new ideas, validate UX patterns, and prototype features before committing to production implementations.

### What Lives Here

- 🧪 **UX Experiments** - Test interaction patterns and user flows
- 🎨 **UI Explorations** - Try new visual treatments and layouts
- 🧩 **Component Prototypes** - Build and validate new components
- 🚀 **Feature Testing** - Prototype new functionality
- 💡 **Design Ideas** - Quickly visualize concepts
- 🎭 **A/B Scenarios** - Compare different approaches side-by-side

### Foundation: Lean Design System

A token-forward design system provides consistency without overhead:
- **Token-first approach** - Design decisions codified as CSS variables
- **Dual branding support** - Legacy and new designs coexist
- **Light/dark themes** - Built-in theme switching
- **Zero bloat** - Only what's needed, when it's needed

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AsafAgranatProsus/toqan-prototypes.git

# Navigate to project
cd toqan-prototypes

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
toqan-prototypes/
├── components/           # Reusable components & prototypes
│   ├── Button/          # Button component variants
│   ├── Icons/           # Icon system (Lucide)
│   ├── DesignSystemDemo/# Living design documentation
│   ├── FeatureMenu/     # Dev tools & meta-menu
│   └── ...              # Your prototype components go here
├── context/             # State management
│   ├── DesignSystemContext.tsx  # Theme & branding
│   ├── FeatureFlagContext.tsx   # Feature toggles
│   └── ScenarioContext.tsx      # A/B scenario testing
├── tokens.css           # Design tokens (source of truth)
├── pages/               # Prototype pages & experiments
├── readme/              # Documentation
│   ├── DESIGN_SYSTEM.md        # Design system guide
│   ├── QUICKSTART.md           # Getting started
│   └── README_IMPLEMENTATION.md # Technical details
└── types.ts             # TypeScript definitions
```

---

## 🧪 Prototyping Workflow

### 1. Start with an Idea

Define what you want to test:
- UX pattern validation
- Visual design exploration
- Component behavior
- Feature feasibility

### 2. Use the Design System

Leverage existing tokens and components:

```tsx
import Button from './components/Button/Button';

// Prototypes automatically adapt to theme/branding
<Button variant="primary">Test This Idea</Button>
```

### 3. Build Fast

```bash
# Create a new prototype component
components/YourPrototype/YourPrototype.tsx

# Add a route if needed
# Test immediately with hot reload
```

### 4. Test & Iterate

Use built-in tools:
- **Meta-menu** (`Alt + /`) - Toggle themes, test fonts, switch designs
- **Feature flags** - Enable/disable experiments
- **Scenario Context** - Compare before/after states

### 5. Document & Share

Share your prototype:
- Screenshot key interactions
- Document learnings in component comments
- Demo to stakeholders via dev server

---

## 🎨 Design System Foundation

### Design Tokens

All styling uses CSS custom properties:

```css
/* Colors */
var(--color-primary-default)
var(--color-ui-background)
var(--color-text-default)

/* Spacing (8px scale) */
var(--space-1) /* 4px */
var(--space-4) /* 16px */
var(--space-16) /* 64px */

/* Typography (1.333 modular scale) */
var(--font-size-heading-xl)
var(--font-size-body-md)

/* More */
var(--radius-default)
var(--shadow-md)
```

### Two-Layer System

**Design Layer** (Feature flag) + **Theme Mode** (User preference) = 4 combinations:
- OLD Design + Light
- OLD Design + Dark
- NEW Design + Light
- NEW Design + Dark

Your prototypes work in **all combinations automatically** when using tokens.

### View the Design System

```
http://localhost:5173/design-system
```

Interactive documentation with:
- Token visualization
- Copy-to-clipboard for values
- Live component examples
- Real-time theme switching

---

## 🧩 Available Components

### Button

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="icon" icon="Settings" />
<Button variant="primary" icon="Plus">With Icon</Button>
```

### Icons (Lucide)

```tsx
import { Icons } from './components/Icons/Icons';

<Icons name="Copy" />
<Icons name="Settings" />
<Icons name="ArrowRight" />
```

### More Components

Add as you build prototypes. Keep them in `components/` with clear documentation.

---

## 🎛️ Development Tools

### Meta-Menu (`Alt + /`)

A floating dev panel for rapid testing:
- **Theme Switcher** - Toggle light/dark instantly
- **Design Toggle** - Switch old/new branding
- **Typography Tester** - Test Google Fonts in real-time
- **Feature Flags** - Enable/disable experiments
- **Quick Links** - Jump to design system demo

### Feature Flags

Control experiments in `featureFlags.ts`:

```typescript
export const featureFlags = {
  newBranding: false,
  experimentalFeature: true,
  // Add your prototype flags here
};
```

Use in components:

```tsx
import { useFeatureFlags } from './context/FeatureFlagContext';

const { flags } = useFeatureFlags();
if (flags.experimentalFeature) {
  // Show prototype
}
```

### Scenario Testing

Compare before/after states:

```tsx
import { useScenarios } from './context/ScenarioContext';

const { scenarioView } = useScenarios();
return scenarioView === 'before' ? <OldVersion /> : <NewVersion />;
```

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production (if needed)
npm run preview      # Preview production build
npm run lint         # Run linter
```

### Adding a New Prototype

1. **Create component**
   ```bash
   components/MyPrototype/MyPrototype.tsx
   components/MyPrototype/MyPrototype.css
   ```

2. **Use tokens** (not hardcoded values)
   ```css
   .my-prototype {
     background: var(--color-ui-background);
     padding: var(--space-6);
     border-radius: var(--radius-default);
   }
   ```

3. **Add route** (if needed)
   ```tsx
   <Route path="/my-prototype" element={<MyPrototype />} />
   ```

4. **Test in all modes**
   - Light/Dark themes
   - Old/New branding
   - Different screen sizes

---

## 📚 Documentation

- **[Design System Architecture](readme/DESIGN_SYSTEM.md)** - Complete token system guide
- **[Quick Start](readme/QUICKSTART.md)** - Detailed getting started
- **[Implementation Details](readme/README_IMPLEMENTATION.md)** - Technical deep dive

---

## 🧑‍💻 For Engineers

### Philosophy: Stay Lean

- ✅ **Build only what you need**
- ✅ **Use tokens, not hardcoded values**
- ✅ **Prototype fast, iterate faster**
- ❌ Don't over-engineer prototypes
- ❌ Don't create unused abstractions
- ❌ Don't skip testing all 4 theme combos

### Before Committing

Test your prototype in all modes:
- [ ] OLD Design + Light Mode
- [ ] OLD Design + Dark Mode
- [ ] NEW Design + Light Mode
- [ ] NEW Design + Dark Mode

---

## 👥 For Stakeholders

This repository is where **ideas become testable prototypes**. 

- **Fast feedback loops** - See ideas working in minutes
- **Low commitment** - Prototypes aren't production code
- **Real interactions** - Actually click and use it
- **Visual consistency** - Design system ensures coherence
- **Easy comparison** - A/B scenarios built-in

Want to see a prototype? Just ask for the dev server URL and navigate to the experiment.

---

## 🔮 Roadmap

**Prototyping Infrastructure:**
- [ ] Screenshot automation for demos
- [ ] Prototype gallery/index page
- [ ] Better scenario comparison tools
- [ ] Mobile device testing setup

**Design System Enhancements:**
- [ ] Additional component variants
- [ ] Animation/transition tokens
- [ ] Accessibility audit
- [ ] Performance optimization

**Add prototypes as needed** - this is a living workspace!

---

## 🤝 Contributing

### For New Prototypes

1. Create feature branch: `prototype/your-idea-name`
2. Build your prototype using tokens
3. Test in all 4 design/theme combinations
4. Document key learnings in comments
5. Open PR with screenshots/demo

### For Design System Updates

1. Discuss token changes first (affects all prototypes)
2. Update both OLD and NEW design tokens
3. Test existing prototypes still work
4. Update documentation

---

## 📄 License

Internal use only. All rights reserved.

---

## 🙋 Support

**Questions?** Open an issue or reach out to the frontend team.

**Want to prototype something?** Clone and start building - that's what this is for!

---

**Built for rapid experimentation at Toqan** 🚀
