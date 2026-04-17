export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-bg': '#000000',
        'dark-surface': '#1a1a1a',
        'dark-card': '#262626',
        'dark-input': '#333333',
        'dark-hover': '#404040',
        'dark-border': '#404040',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#b3b3b3',
        'dark-text-tertiary': '#808080',
        'dark-text-subtle': '#666666',
      }
    },
  },
  plugins: [],
}