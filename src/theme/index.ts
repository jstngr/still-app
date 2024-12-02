import { createTheme, MantineThemeOverride } from '@mantine/core';
import themeColors from './colors';

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
        footer: { height: 66 },
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
  },
});

export default theme;
