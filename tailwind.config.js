/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F5F3FF',
          foreground: '#5B21B6',
        },
        muted: {
          DEFAULT: '#F9FAFB',
          foreground: '#6B7280',
        },
        accent: {
          DEFAULT: '#EDE9FE',
          foreground: '#5B21B6',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
        background: '#FFFFFF',
        foreground: '#1F2937',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1F2937',
        },
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#7C3AED',
        status: {
          pending: '#7C3AED',
          accepted: '#10B981',
          rejected: '#EF4444',
          delivering: '#3B82F6',
          arrived: '#10B981',
          acknowledged: '#6B7280',
        },
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      fontFamily: {
        sans: ['PlusJakartaSans'],
        heading: ['DMSans'],
      },
    },
  },
  plugins: [],
};
