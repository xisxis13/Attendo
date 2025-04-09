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
            'header': '22px',
            'button': '10px',
          },
          fontFamily: {
            'sans': ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
            'montserrat': ['Montserrat', 'sans-serif'],
          },
          fontSize: {
            'logo': ['32px', { lineHeight: '22px', fontWeight: '800' }],
            'button': ['14px', { lineHeight: '20px', fontWeight: '500' }],
          },
        },
    },
    plugins: [],
}
