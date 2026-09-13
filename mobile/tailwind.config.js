/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            // OVERRIDE FOR ACADEMIC BRUTALISM
            // We zero out all border radii globally to enforce the strict, sharp-edged aesthetic.
            borderRadius: {
                'none': '0px',
                'sm': '0px',
                DEFAULT: '0px',
                'md': '0px',
                'lg': '0px',
                'xl': '0px',
                '2xl': '0px',
                '3xl': '0px',
                'full': '0px',
            },
            colors: {
                primary: {
                    500: '#1E3A5F', // Overriding default indigo to CampusFind Institutional Navy
                    600: '#162E4D',
                },
                slate: {
                    800: '#1E3A5F', // Overriding dark slates to Institutional Navy
                    900: '#0F172A',
                },
                emerald: {
                    500: '#A16207', // Override success strictly to Accent Amber
                    900: '#713F12',
                },
                rose: {
                    500: '#1E3A5F', // Force error screens to maintain professional navy
                    900: '#0F172A',
                }
            }
        },
    },
    plugins: [],
}
