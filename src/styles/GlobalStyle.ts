import { createGlobalStyle } from 'styled-components';
import { THEME_COLORS } from '../constants';
import type { ThemeType } from '../types';

export const GlobalStyle = createGlobalStyle<{ themeMode: ThemeType }>`
  :root {
    ${({ themeMode }) => {
      const colors = THEME_COLORS[themeMode];
      return `
        --bg-color: ${colors.bg};
        --container-bg: ${colors.containerBg};
        --text-color: ${colors.text};
        --border-color: ${colors.border};
        --input-bg: ${colors.inputBg};
        --primary-solid: ${colors.primary};
        --secondary-solid: ${colors.secondary};
        --danger-color: ${colors.danger};
        --warning-color: ${colors.warning};
      `;
    }}
  }

  body {
    margin: 0;
    display: flex;
    place-items: center;
    min-width: 320px;
    min-height: 100vh;
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    transition: background-color 0.3s, color 0.3s;
  }

  #root {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }
`;
