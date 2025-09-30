export interface Theme {
  name: 'light' | 'dark';
  colors: {
    // Backgrounds
    bgApp: string;
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
    border: '#E5E7EB',

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
    // Backgrounds
    bgApp: '#111010',
    bgSidebar: '#1C1C1E',
    bgSidebarMobile: 'rgba(28, 28, 30, 0.95)',
    bgMain: '#111010',
    bgInput: '#2C2C2E',
    bgItemSelected: '#3A3A3C',
    bgMenu: '#1C1C1E',

    // Text
    textMain: '#F2F2F7',
    textSecondary: '#E5E5EA',
    textTertiary: '#98989D',
    textLight: '#FFFFFF',
    textAccent: '#0A84FF',
    textLink: '#0A84FF',
    textSelection: '#FFFFFF',
    selectionBg: '#0A84FF',

    // Buttons
    btnPrimaryBg: '#0A84FF',
    btnPrimaryBgHover: '#007AFF',
    btnPrimaryText: '#FFFFFF',
    btnSecondaryBg: '#3A3A3C',
    btnSecondaryBgHover: '#48484A',
    btnSecondaryText: '#F2F2F7',
    btnTertiaryBg: 'transparent',
    btnTertiaryBgHover: '#3A3A3C',
    btnTertiaryText: '#F2F2F7',
    
    // Tags
    tagBetaBg: 'rgba(10, 132, 255, 0.2)',
    tagBetaText: '#0A84FF',
    tagRecommendedBg: 'rgba(175, 82, 222, 0.2)',
    tagRecommendedText: '#AF52DE',
    tagDateBg: 'rgba(10, 132, 255, 0.2)',
    tagDateText: '#0A84FF',
    
    // Borders
    border: '#3A3A3C',

    // FX / Gradients
    gradientMelange: [
      'rgba(10, 132, 255, 0.5)', // blue
      'rgba(175, 82, 222, 0.5)', // purple
      'rgba(255, 59, 48, 0.5)',  // red
      'rgba(52, 199, 89, 0.5)',  // green
    ],
  },
};


export const themes = {
  light: lightTheme,
  dark: darkTheme,
};