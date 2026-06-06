/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Default 3Wi neutral palette (used as fallback)
        app: '#F8FAFC',
        ink: '#0F172A',
        accent: '#0EA5A4',
        // Tenant override consumes CSS vars
        brand: {
          primary: 'var(--brand-primary, #0F172A)',
          secondary: 'var(--brand-secondary, #0EA5A4)',
          accent: 'var(--brand-accent, #F59E0B)',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    },
  },
  plugins: [],
};
