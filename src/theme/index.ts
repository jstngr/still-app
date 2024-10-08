import { createTheme, MantineThemeOverride } from '@mantine/core';
import themeColors from './colors';

import AppShellStyles from './AppShell.module.css';

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
      classNames: AppShellStyles,
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
        h: 'calc(100dvh - var(--app-shell-footer-height))',
        mih: 'calc(100dvh - var(--app-shell-footer-height))',
        mah: 'calc(100dvh - var(--app-shell-footer-height))',
      },
    },
    InputText: {
      defaultProps: {
        size: 'md',
      },
    },
  },
});

export default theme;
