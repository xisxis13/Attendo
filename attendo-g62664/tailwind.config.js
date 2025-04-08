export default {
    darkMode: 'selector',
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
          colors: {
            'background': '#F5F8FC',
            'box': '#F9FBFF',
            'border': '#CFE2E8',
            'text': '#3E3E3E',
            'light-text': '#9E9E9E',
            'esi-blue' : '#52A2D0',
            'light-content': '#E0E0E0',
          },
          borderRadius: {
            'header': '18px',
            'button': '10px',
          },
        },
    },
    plugins: [],
}
