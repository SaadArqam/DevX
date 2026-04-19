import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        newsprint: '#F9F9F7',
        ink: '#111111',
        editorial: '#CC0000',
        divider: '#E5E5E0',
        background: '#F9F9F7',
        foreground: '#111111',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Times New Roman', 'serif'],
        body: ['Lora', 'Georgia', 'serif'],
        sans: ['Inter', 'Helvetica Neue', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
