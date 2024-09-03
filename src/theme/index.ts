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
  },

  components: {
    AppShell: {
      defaultProps: {
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
      styles: {
        root: {
          border: '1px solid red',
        },
      },
      defaultProps: {},
    },
  },
});

export default theme;
