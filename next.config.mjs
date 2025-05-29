import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import { loadEnv } from './src/lib/env.js';

loadEnv();
setupDevPlatform().catch(console.error);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['3000-niezleziolk-cs50xfinalp-o94qh5888cu.ws-eu119.gitpod.io']
};

export default nextConfig;