/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './src/**/*.html',
        './src/**/*.ts',
    ],
    theme: {
        extend: {
            colors: {
                'text-color': 'var(--text-color)',
                'text-color-secondary': 'var(--text-color-secondary)',
                'primary-color': 'var(--primary-color)',
                'primary-color-text': 'var(--primary-color-text)',
                'surface-a': 'var(--surface-a)',
                'surface-b': 'var(--surface-b)',
                'surface-c': 'var(--surface-c)',
                'surface-d': 'var(--surface-d)',
                'surface-e': 'var(--surface-e)',
                'surface-f': 'var(--surface-f)',
                'surface-ground': 'var(--surface-ground)',
                'surface-section': 'var(--surface-section)',
                'surface-card': 'var(--surface-card)',
                'surface-overlay': 'var(--surface-overlay)',
                'surface-border': 'var(--surface-border)',
                'surface-hover': 'var(--surface-hover)',
                'surface-0': 'var(--surface-0)',
                'surface-50': 'var(--surface-50)',
                'surface-100': 'var(--surface-100)',
                'surface-200': 'var(--surface-200)',
                'surface-300': 'var(--surface-300)',
                'surface-400': 'var(--surface-400)',
                'surface-500': 'var(--surface-500)',
                'surface-600': 'var(--surface-600)',
                'surface-700': 'var(--surface-700)',
                'surface-800': 'var(--surface-800)',
                'surface-900': 'var(--surface-900)',
                'gray-50': 'var(--gray-50)',
                'gray-100': 'var(--gray-100)',
                'gray-200': 'var(--gray-200)',
                'gray-300': 'var(--gray-300)',
                'gray-400': 'var(--gray-400)',
                'gray-500': 'var(--gray-500)',
                'gray-600': 'var(--gray-600)',
                'gray-700': 'var(--gray-700)',
                'gray-800': 'var(--gray-800)',
                'gray-900': 'var(--gray-900)',
            },
            borderRadius: {
                DEFAULT: 'var(--border-radius)',
            },
            fontFamily: {
                brand: ['Orbitron', 'sans-serif'],
            },
            screens: {
                '3xl': '1900px',
                '4xl': '2220px',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}
