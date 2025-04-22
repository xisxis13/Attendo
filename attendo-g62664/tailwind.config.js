export default {
    darkMode: 'class',
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

            'dark-background': '#1E2A34',
            'dark-box': '#25303D',
            'dark-border': '#295A6A',
            'dark-text': '#E8F0F6',
            'dark-light-text': '#A6C0C9',
            'dark-esi-blue' : '#52A2D0',
            'dark-light-content': '#404C54',
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
            'h1': ['32px', { lineHeight: '34px', fontWeight: '800' }],
            'h2': ['24px', { lineHeight: '22px', fontWeight: '800' }],
            'input-title': ['16px', { lineHeight: '20px', fontWeight: '600' }],
            'table-title': ['18px', { lineHeight: '20px', fontWeight: '600' }],
            'button': ['14px', { lineHeight: '17px', fontWeight: '500' }],
          },
        },
    },
    plugins: [],
}
