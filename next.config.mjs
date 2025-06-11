import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { loadEnv } from './src/lib/env.js';

loadEnv();
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }

    return config;
  },
};

export default nextConfig;
