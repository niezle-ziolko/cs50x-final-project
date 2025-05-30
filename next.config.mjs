import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import { loadEnv } from './src/lib/env.js';

loadEnv();
setupDevPlatform().catch(console.error);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['3000-niezleziolk-cs50xfinalp-xabq8ooqbda.ws-eu120.gitpod.io']
};

export default nextConfig;