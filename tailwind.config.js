/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                syne: ['Syne', 'sans-serif'],
                dmsans: ['DM Sans', 'sans-serif'],
                climate: ['"Climate Crisis"', 'sans-serif'],
            },
            colors: {
                amber: '#E8820C',
                'amber-dark': '#B85A00',
                slate: '#1A1D23',
            },
        },
    },
    plugins: [],
};
