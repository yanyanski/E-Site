import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        // './storage/framework/views/*.php',
        // './resources/**/*.blade.php',
        './resources/**/*.ts',
        // './resources/**/*.vue',
    ],
    
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                heading: ['Montserrat', 'sans-serif'],
            }
        },
    },

    plugins: [
        function ({ addUtilities }) {
        const newUtilities = {
            '.content-empty': { content: '""' },
        }
        addUtilities(newUtilities, ['before', 'after'])
        }
    ],
};
