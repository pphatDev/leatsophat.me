/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/index.html',
        './src/**/*.{html,js}',
        './src/pages/**/*.{html,js}',
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                body: ["'Poppins'","'Open San'","'Sofia Sans Condensed'", "sans-serif"],
            }
        },
    },
    plugins: [],
}

