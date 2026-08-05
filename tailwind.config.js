/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
        './src/components/**/*.{js,jsx,ts,tsx}',
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

                // Role colors
                owner: '#16a34a',
                'owner-light': '#dcfce7',
                'owner-dark': '#15803d',

                provider: '#2563eb',
                'provider-light': '#dbeafe',
                'provider-dark': '#1d4ed8',

                supplier: '#f97316',
                'supplier-light': '#ffedd5',
                'supplier-dark': '#ea580c',
            },
        },
    },
    plugins: [],
};
