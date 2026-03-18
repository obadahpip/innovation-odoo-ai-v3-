/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'o-bg':         '#1a1b2e',
        'o-surface':    '#252638',
        'o-surface2':   '#2e2f45',
        'o-surface3':   '#363750',
        'o-border':     'rgba(255,255,255,0.09)',
        'o-border2':    'rgba(255,255,255,0.15)',
        'o-text':       '#dcdce4',
        'o-text2':      '#9899ac',
        'o-text3':      '#6b6c7e',
        'o-teal':       '#00b5b5',
        'o-teal-light': '#00d2d2',
        'o-purple':     '#714b67',
        'o-purple2':    '#875a7b',
        'o-purple3':    '#a36897',
        'o-success':    '#2ecc71',
        'o-warning':    '#f0ad4e',
        'o-danger':     '#e74c3c',
        'o-info':       '#3498db',
      },
      fontFamily: {
        sans: ['"LGC Sans"','ui-sans-serif','system-ui','-apple-system','sans-serif'],
      },
    },
  },
  plugins: [],
}
