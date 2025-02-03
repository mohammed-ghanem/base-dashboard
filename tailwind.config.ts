import type { Config } from "tailwindcss";


const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/components/(dropdown|menu|divider|popover|button|ripple|spinner).js",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        'regal-blue': '#424C61',
        customGold: '#9F854E',
        customGray: '#f3f3f32e',
      },
      width: {
        '95%': '95%',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
          //"border-pattern": "url('/assets/images/card.png')",
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'], // Add this line
      },
    }
  },
};
export default config;
