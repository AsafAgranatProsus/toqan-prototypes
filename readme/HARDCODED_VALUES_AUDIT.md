# Hardcoded Values Audit - Component CSS Files

## Audit Date
December 2, 2025

## Methodology
- Scanned all component CSS files for hardcoded values
- Categorized by type: colors, spacing, shadows, radius
- Classified as: **Should Tokenize** vs **Intentional Design**
- Prioritized: High (visible/common) vs Low (edge cases)

---

## Summary

**Total Files Scanned**: 29 CSS files
**Files with Hardcoded Values**: 11 files
**Total Hardcoded Instances**: ~142

### Breakdown by Type:
- **Colors (hex/rgb)**: ~142 instances across 11 files
- **Spacing (px/rem)**: Already mostly tokenized ✅
- **Border Radius**: Already mostly tokenized ✅
- **Shadows**: Mixed (some tokenized, some hardcoded)

---

## Audit Results by File

### 1. ✅ `components/CustomizationPanel/*.css` (4 files)
**Status**: Intentionally Agnostic - DO NOT TOKENIZE

**Files**:
- `CustomizationPanel.css` (~51 hardcoded colors)
- `ColorPicker.css` (~1 hardcoded color)
- `TokenControl.css` (~11 hardcoded colors)
- `TypographySystemControl.css` (~18 hardcoded colors)

**Reason**: These components are deliberately theme-agnostic (meta-UI). They should NOT respond to theme changes as they control the themes themselves.

**Action**: ✅ None needed - Intentional design

---

### 2. ⚠️ `components/FlowDiagram/FlowDiagram.css`
**Status**: Mixed - Needs Review

**Hardcoded Values Found**:
```css
/* Colors */
background: #f0f0f0;  /* Should this adapt to theme? */
border: 1px solid #ddd;
color: #333;
```

**Priority**: Low
**Recommendation**: Review with designer - if diagrams should adapt to theme, tokenize

**Action**: 🔍 Needs designer input

---

### 3. ⚠️ `components/FeatureMenu/FeatureMenu.css`
**Status**: Has Hardcoded Colors

**Hardcoded Values Found** (~10 instances):
```css
color: #666;
background: rgba(0, 0, 0, 0.05);
border: 1px solid #e0e0e0;
```

**Priority**: Medium
**Recommendation**: Should use `--color-text-tertiary`, `--color-ui-active`, `--color-ui-border`

**Action**: 📝 Should tokenize for theme support

---

### 4. ✅ `components/Dropdown/Dropdown.css`
**Status**: Has Hardcoded Shadow

**Hardcoded Values Found**:
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
```

**Priority**: Low
**Current**: Uses `--theme-bg-menu`, `--theme-border` for colors ✅
**Recommendation**: Replace shadow with `--shadow-md`

**Action**: ✅ Minor - Can tokenize shadow

---

### 5. ✅ `components/Plays/Plays.css`
**Status**: Has Hardcoded Comments

**Hardcoded Values Found**: Only in commented-out code
```css
/* background-image: linear-gradient(45deg, black, transparent); */
```

**Priority**: None
**Action**: ✅ No action needed - code is commented out

---

### 6. ⚠️ `components/Toggle/Toggle.css`
**Status**: Has Hardcoded Colors

**Hardcoded Values Found** (~5 instances):
```css
background: #ccc;
background: #2196F3;
box-shadow: 0 2px 4px rgba(0,0,0,0.2);
```

**Priority**: High (Toggle is a core UI component)
**Recommendation**: 
- Use `--color-ui-border` for inactive
- Use `--color-primary-default` for active
- Use `--shadow-sm` for shadow

**Action**: 📝 Should tokenize - common component

---

### 7. ⚠️ `components/Message/Message.css` 
**Status**: Has Hardcoded Colors

**Hardcoded Values Found** (~8 instances):
```css
border-left: 4px solid #4F46E5;
background: rgba(79, 70, 229, 0.05);
color: #DC2626;
```

**Priority**: Medium
**Recommendation**: 
- Use `--color-primary-default` for primary borders
- Use `--color-primary-background` for backgrounds
- Use `--color-error-default`, `--color-success-default` etc.

**Action**: 📝 Should tokenize for theme support

---

### 8. ⚠️ `components/SemanticMessage/SemanticMessage.css`
**Status**: Has Hardcoded Colors (Similar to Message)

**Hardcoded Values Found** (~9 instances):
```css
border: 1px solid #E5E7EB;
background: #F9FAFB;
color: #374151;
```

**Priority**: Medium
**Recommendation**: Use corresponding `--color-*` tokens

**Action**: 📝 Should tokenize for consistency

---

### 9. ⚠️ `components/ChatInput/ChatInput.css`
**Status**: Has Hardcoded Shadow

**Hardcoded Values Found**:
```css
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
box-shadow: 0px 0.125rem 0.25rem 0px rgba(0, 0, 0, 0.1);
```

**Priority**: Low
**Current**: Uses tokens for colors ✅
**Recommendation**: Replace with `--shadow-md`

**Action**: ✅ Minor - Can tokenize shadows

---

### 10. ✅ `components/Card/Card.css`
**Status**: Intentional Design Elements

**Hardcoded Values Found**:
```css
--card-shadow-corner-top-left: -36px -8px 0 -35px #ddd, ...;
filter: blur(10px);
opacity: 0.5;
```

**Priority**: None
**Reason**: Special effects, grain textures, decorative elements

**Action**: ✅ Intentional - Keep as-is

---

### 11. ✅ `components/Modal/Modal.css`
**Status**: Check Needed

**Files**: Uses tokens ✅
**Action**: ✅ Already tokenized

---

## Priority Matrix

### 🔴 High Priority (Should Fix)
1. **Toggle.css** - Core UI component, needs theme support
   - Impact: High (used everywhere)
   - Effort: Low (5 values)
   
### 🟡 Medium Priority (Should Consider)
2. **FeatureMenu.css** - Navigation component
   - Impact: Medium (always visible)
   - Effort: Low (10 values)

3. **Message.css** - Content display
   - Impact: Medium (common in conversations)
   - Effort: Low (8 values)

4. **SemanticMessage.css** - Content display
   - Impact: Medium (common in conversations)
   - Effort: Low (9 values)

### 🟢 Low Priority (Nice to Have)
5. **Dropdown.css** - Shadow only
   - Impact: Low (minor visual)
   - Effort: Trivial (1 value)

6. **ChatInput.css** - Shadow only
   - Impact: Low (minor visual)
   - Effort: Trivial (2 values)

7. **FlowDiagram.css** - Needs designer input
   - Impact: Unknown
   - Effort: Unknown (needs review)

### ✅ No Action Needed
- **CustomizationPanel/*.css** - Intentionally agnostic
- **Card.css** - Intentional design effects
- **Plays.css** - Values only in comments
- **Modal.css** - Already tokenized

---

## Recommendations

### Immediate Actions (High ROI)
1. ✅ **Tokenize Toggle.css** (5 mins)
2. ✅ **Tokenize FeatureMenu.css** (10 mins)
3. ✅ **Tokenize Message.css** (10 mins)
4. ✅ **Tokenize SemanticMessage.css** (10 mins)

**Total Time**: ~35 minutes
**Impact**: All core UI components respond to theme customization

### Optional Actions (Low Priority)
5. Replace shadows in Dropdown, ChatInput
6. Review FlowDiagram with designer

### No Action
- CustomizationPanel components (by design)
- Card decorative effects (by design)

---

## Testing Plan

For each fixed file:
1. Test in light mode (Default OLD)
2. Test in dark mode (Default OLD)
3. Test in light mode (Default NEW)
4. Test in dark mode (Default NEW)
5. Test with customization panel changes
6. Visual regression check

---

## Conclusion

**Current State**: Majority of the codebase is well-tokenized ✅

**Key Findings**:
- Most layout/spacing already uses tokens ✅
- CustomizationPanel correctly isolated ✅
- 4 medium-priority files need tokenization
- 2 low-priority files have minor issues
- 1 file needs designer review

**Recommendation**: Proceed with fixing the 4 high/medium priority files (~35 minutes of work) to achieve full theme support across all user-facing components.

