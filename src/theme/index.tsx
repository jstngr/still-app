import { createTheme, MantineProvider, MantineThemeOverride } from '@mantine/core';
import themeColors from './colors';
import React, { ReactNode, createContext, useContext, useMemo, useState } from 'react';

const FOOTER_PADDING = 64;

const theme: MantineThemeOverride = createTheme({
  fontFamily: 'Poppins',
  ...themeColors,

  spacing: {
    xxs: '0.25rem', // 4px
  },

  headings: {
    textWrap: 'nowrap',
    sizes: {
      h6: {
        fontSize: '.75rem',
      },
    },
  },

  components: {
    AppShell: {
      defaultProps: {
        style: {
          overflow: 'hidden',
        },
        footer: { height: 64 },
        bg: 'var(--mantine-color-background-0)',
        padding:
          'env(safe-area-inset-top, 20px) env(safe-area-inset-right, 20px) env(safe-area-inset-left, 20px) env(safe-area-inset-bottom, 20px)',
      },
    },
    AppShellFooter: {
      defaultProps: {
        bg: 'var(--mantine-color-background-0)',
      },
    },
    AppShellMain: {
      defaultProps: {
        p: 'env(safe-area-inset-top, 20px) env(safe-area-inset-left, 20px) 0 env(safe-area-inset-right, 20px)',
        h: 'calc(100dvh - var(--app-shell-footer-height) - env(safe-area-inset-bottom, 20px))',
        mih: 'calc(100dvh - var(--app-shell-footer-height) - env(safe-area-inset-bottom, 20px))',
        mah: 'calc(100dvh - var(--app-shell-footer-height) - env(safe-area-inset-bottom, 20px))',
      },
    },
    InputText: {
      defaultProps: {
        size: 'md',
      },
    },
    Switch: {
      defaultProps: {
        styles: {
          WebkitTapHighlightColor: 'transparent',
        },
      },
    },
    Drawer: {
      styles: (theme) => ({
        content: {
          borderRadius: theme.radius.md,
          paddingBottom: 64,
        },
      }),
    },
  },
});

interface IThemeContextType {
  setFooterHeight: (height: number) => void;
}

const ThemeContext = createContext<IThemeContextType | undefined>(undefined);

interface IThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<IThemeProviderProps> = ({ children }) => {
  const [footerHeight, setFooterHeight] = useState(0);

  const mantineTheme = useMemo(() => {
    const temp = theme;
    if (temp?.components?.AppShell) {
      temp.components.AppShell.defaultProps.footer.height =
        footerHeight || temp.components.AppShell.defaultProps.footer.height;
    }
    if (temp?.components?.Drawer) {
      temp.components.Drawer.styles = (theme) => ({
        content: {
          borderRadius: theme.radius.md,
          paddingBottom: Math.max(footerHeight - 64 + 8, 0),
        },
      });
    }
    return temp;
  }, [footerHeight]);

  return (
    <ThemeContext.Provider
      value={{
        setFooterHeight: (height: number) => setFooterHeight(height + FOOTER_PADDING),
      }}
    >
      <MantineProvider theme={mantineTheme}>{children}</MantineProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeContext');
  }
  return context;
};
