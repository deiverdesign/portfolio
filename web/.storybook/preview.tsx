import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  initialGlobals: {
    backgrounds: { value: 'gray' },
  },
  parameters: {
    backgrounds: {
      options: {
        gray: { name: 'gray', value: '#bab7b2' },
        light: { name: 'light', value: '#f8f7f7' },
        dark: { name: 'dark', value: '#0b2825' },
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;