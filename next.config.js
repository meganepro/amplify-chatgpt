/** @type {import('next').NextConfig} */
const withInterceptStdout = require('next-intercept-stdout');
const path = require('path');

const nextConfig = withInterceptStdout(
  {
    reactStrictMode: true,
    swcMinify: true,
    webpack(config, options) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, './src'),
      };
      config.resolve.extensions = [
        ...config.resolve.extensions,
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        'css',
        'scss',
      ];
      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      return config;
    },
    env: {
      ...require(`./config/${process.env.APP_ENV ?? 'local'}.json`),
      ENV: process.env.APP_ENV ?? 'local',
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '*.cloudfront.net',
        },
        {
          protocol: 'http',
          hostname: 'localhost',
        },
      ],
    },
  },
  // https://tech-broccoli.life/articles/engineer/hide-duplicate-key-message-next-recoil/
  (text) => (text.includes('Duplicate atom key') ? '' : text),
);

module.exports = nextConfig;
