/** @type {import('tailwindcss').Config} */
const config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        serif: ['var(--font-cormorant-garamond)', 'Georgia', 'serif'],
        display: ['var(--font-cormorant-garamond)', 'Georgia', 'serif'],
      },
      typography: {
        DEFAULT: {
          css: [
            {
              '--tw-prose-body': 'var(--text)',
              '--tw-prose-headings': 'var(--text)',
              h1: {
                fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
                fontWeight: 'normal',
                marginBottom: '0.25em',
              },
              h2: {
                fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
              },
              h3: {
                fontFamily: 'var(--font-cormorant-garamond), Georgia, serif',
              },
            },
          ],
        },
        base: {
          css: [
            {
              h1: {
                fontSize: '2.5rem',
              },
              h2: {
                fontSize: '1.25rem',
                fontWeight: 600,
              },
            },
          ],
        },
        md: {
          css: [
            {
              h1: {
                fontSize: '3.5rem',
              },
              h2: {
                fontSize: '1.5rem',
              },
            },
          ],
        },
      },
    },
  },
}

export default config
