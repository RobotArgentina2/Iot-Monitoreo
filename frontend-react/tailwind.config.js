/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: "#0f172a",
                card: "rgba(30, 41, 59, 0.7)",
                primary: "#38bdf8",
                secondary: "#f43f5e",
            }
        },
    },
    plugins: [],
}
