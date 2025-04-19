/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode:"class",
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		extend: {
            colors: {
				bg1:"var(--color-bg1)",
				bg2:"var(--color-bg2)",
				bg3:"var(--color-bg3)",
            },
            backgroundColor:{
                "light":"#FEF1C9"
            },
			spacing:{
				"25":"6.25rem",
			},
			boxShadow:{
				"orange":"var(--shadow-orange)",
			},
			fontSize:{
				"md":"var(--text-md)",
			},
			fontFamily:{
				jura:"var(--font-jura)",
				raleway:"var(--font-raleway)",
			},
			borderRadius:{
				"5":"var(--radius-5)",
			}
		},
	},
	plugins: [],
}

