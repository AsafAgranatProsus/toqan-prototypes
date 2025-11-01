export interface Theme {
  name: 'light' | 'dark';
  colors: {
    // Backgrounds
    bgApp: string;
    bgAppLighter: string;
    bgSidebar: string;
    bgSidebarMobile: string;
    bgMain: string;
    bgInput: string;
    bgItemSelected: string;
    bgMenu: string;

    // Text
    textMain: string;
    textSecondary: string;
    textTertiary: string;
    textLight: string;
    textAccent: string;
    textLink: string;
    textSelection: string;
    selectionBg: string;

    // Buttons
    btnPrimaryBg: string;
    btnPrimaryBgHover: string;
    btnPrimaryText: string;
    btnSecondaryBg: string;
    btnSecondaryBgHover: string;
    btnSecondaryText: string;
    btnTertiaryBg: string;
    btnTertiaryBgHover: string;
    btnTertiaryText: string;
    
    // Tags
    tagBetaBg: string;
    tagBetaText: string;
    tagRecommendedBg: string;
    tagRecommendedText: string;
    tagDateBg: string;
    tagDateText: string;

    // Borders
    border: string;

    // FX / Gradients
    gradientMelange: string[];
  };
}

export const lightTheme: Theme = {
  name: 'light',
  colors: {
    // Backgrounds
    bgApp: '#F9FAFB',
    bgAppLighter: '#FFFFFF',
    bgSidebar: '#FFFFFF',
    bgSidebarMobile: 'rgba(255, 255, 255, 0.95)',
    bgMain: '#F9FAFB',
    bgInput: '#FFFFFF',
    bgItemSelected: '#F4F4F5',
    bgMenu: '#FFFFFF',

    // Text
    textMain: '#111827',
    textSecondary: '#374151',
    textTertiary: '#6B7280',
    textLight: '#FFFFFF',
    textAccent: '#4F46E5',
    textLink: '#4F46E5',
    textSelection: '#FFFFFF',
    selectionBg: '#4F46E5',

    // Buttons
    btnPrimaryBg: '#4426d9',
    btnPrimaryBgHover: '#361fad',
    btnPrimaryText: '#FFFFFF',
    btnSecondaryBg: '#e9eff7',
    btnSecondaryBgHover: '#E5E7EB',
    btnSecondaryText: '#374151',
    btnTertiaryBg: 'transparent',
    btnTertiaryBgHover: '#F3F4F6',
    btnTertiaryText: '#4B5563',
    
    // Tags
    tagBetaBg: '#E0E7FF',
    tagBetaText: '#3730A3',
    tagRecommendedBg: '#EDE9FE',
    tagRecommendedText: '#5B21B6',
    tagDateBg: 'rgba(68, 38, 217, 0.2)',
    tagDateText: 'rgb(68, 38, 217)',
    
    // Borders
    border: '#c8d8ea',

    // FX / Gradients
    gradientMelange: [
      'rgba(196, 181, 253, 0.5)',
      'rgba(165, 243, 252, 0.4)',
    ],
  },
};

export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    // Backgrounds - Contemporary dark theme with subtle depth
    bgApp: '#0A0A0B',              // Deep black base
    bgSidebar: '#141416', 
    bgAppLighter: '#000000',          // Elevated surface with slight contrast
    bgSidebarMobile: 'rgba(20, 20, 22, 0.98)', // Near-opaque for mobile
    bgMain: '#0A0A0B',              // Match app background
    bgInput: '#1E1E20',             // Input fields - subtle elevation
    bgItemSelected: '#252528',       // Selected states - clear hierarchy
    bgMenu: '#1A1A1C',                // Dropdowns - elevated surface

    // Text - High contrast for WCAG AAA accessibility
    textMain: '#F5F5F7',            // Primary text - excellent contrast
    textSecondary: '#D1D1D6',       // Secondary text - good contrast
    textTertiary: '#8E8E93',        // Tertiary text - readable
    textLight: '#FFFFFF',           // Light text for dark backgrounds
    textAccent: '#5B8FFF',          // Accent blue - vibrant but not harsh
    textLink: '#5B8FFF',            // Links match accent
    textSelection: '#FFFFFF',       // Selected text color
    selectionBg: '#3D5EFF',         // Selection highlight - good contrast

    // Buttons - Modern, accessible button styles
    btnPrimaryBg: '#3D5EFF',        // Primary blue - strong but not overwhelming
    btnPrimaryBgHover: '#5B8FFF',   // Lighter on hover
    btnPrimaryText: '#FFFFFF',      // White text for maximum contrast
    btnSecondaryBg: '#1E1E20',       // Secondary button background
    btnSecondaryBgHover: '#252528',  // Hover state
    btnSecondaryText: '#D1D1D6',     // Accessible text color
    btnTertiaryBg: 'transparent',    // Transparent background
    btnTertiaryBgHover: '#1E1E20',  // Subtle hover
    btnTertiaryText: '#D1D1D6',     // Readable text
    
    // Tags - Vibrant but accessible tag colors
    tagBetaBg: 'rgba(91, 143, 255, 0.15)',      // Subtle blue background
    tagBetaText: '#5B8FFF',                      // Blue text
    tagRecommendedBg: 'rgba(175, 82, 222, 0.15)', // Subtle purple background
    tagRecommendedText: '#AF52DE',               // Purple text
    tagDateBg: 'rgba(91, 143, 255, 0.12)',      // Date tag background
    tagDateText: '#5B8FFF',                      // Date tag text
    
    // Borders - Subtle separation
    border: '#2A2A2D',              // Border color - visible but not harsh

    // FX / Gradients - Contemporary gradient palette
    gradientMelange: [
      'rgba(91, 143, 255, 0.4)',   // Blue
      'rgba(175, 82, 222, 0.4)',   // Purple
      'rgba(255, 85, 85, 0.3)',    // Coral red
      'rgba(85, 217, 158, 0.3)',   // Mint green
    ],
  },
};


export const themes = {
  light: lightTheme,
  dark: darkTheme,
};