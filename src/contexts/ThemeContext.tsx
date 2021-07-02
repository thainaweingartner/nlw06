import { createContext, ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import dark from '../styles/themes/dark';
import light from '../styles/themes/light';
import GlobalStyle from '../styles/global';
import usePersistedState from '../hooks/usePersistedState';

interface DefaultTheme {
  title: string;

  colors: {
    primary: string;
    secundary: string;

    background: string;
    text: string;
    inputBackground: string;
  }
}

type ThemeContextType = {
  theme: DefaultTheme;
  toggleTheme: () => void;
}

type ThemeContextProviderProps = {
  children: ReactNode;
}

export const ThemeContext = createContext({} as ThemeContextType);

export function ThemeContextProvider(props: ThemeContextProviderProps) {
  const [theme, setTheme] = usePersistedState<DefaultTheme>('theme', light);
  
  const toggleTheme = () =>{
    setTheme(theme.title === 'light' ? dark : light);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {props.children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
