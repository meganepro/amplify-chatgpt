import * as NextImage from 'next/image';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextPage } from 'next';
import '@/styles/reset.min.css';
import '@/styles/global.scss';

export const decorators = [
  (Story: NextPage) => {
    return (
      <>
        <Story />
      </>
    );
  },
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  layout: 'fullscreen',
  nextRouter: {
    Provider: RouterContext.Provider,
  },
};

// for NextImage
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props: NextImage.ImageProps) => <OriginalNextImage {...props} unoptimized />,
});
