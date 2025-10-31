import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    * {
        font-family: "Kanit", serif;
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html, body {
        background-color: #141414;
    }
`;

export default GlobalStyle;
