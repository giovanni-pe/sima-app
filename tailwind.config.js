/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🎨 Paleta institucional SIMA-UNAS
        skySoft: '#EAF6FF',
        borderGlow: '#D0EFFF',
        gradientStart: '#2563EB', // azul vivo
        gradientEnd: '#06B6D4',   // cyan moderno
        labelPurple: '#A855F7',
        textStrong: '#0F172A',
        unas: {
          blue: "#00A3F0",  // Cielo UNAS
          dark: "#2D3E50",  // Acero UNAS
          green: "#008755",  // Selva
          yellow: "#FFCC00",  // Engranaje solar
          iris: "#B453FF",  // Disco óptico
          light: "#F5F9FF",  // Fondo claro
        },

        // Gradientes definidos como tokens CSS (puedes sobrescribir luego con variables)
        primaryStart: 'var(--tw-gradient-from)',   // e.g. from-unas-blue
        primaryEnd: 'var(--tw-gradient-to)',     // e.g. to-unas-green
        accentStart: 'var(--tw-gradient-from)',   // e.g. from-unas-iris
        accentEnd: 'var(--tw-gradient-to)',     // e.g. to-unas-yellow
      },

      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },

      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 3s ease-in-out infinite',
      },

      boxShadow: {
        soft: '0 4px 20px -4px rgba(45,62,80,0.15)', // más en línea con #2D3E50
        mid: '0 12px 40px -12px rgba(0,163,240,0.3)', // azul institucional
        glam: '0 20px 60px -12px rgba(0,0,0,0.1), 0 8px 30px -8px rgba(0,163,240,0.25)',
      },

      backdropBlur: {
        xs: '2xl',
      },
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
  ],
};
