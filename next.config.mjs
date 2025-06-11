import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { loadEnv } from './src/lib/env.js';
import withPreact from '@preact/next';

loadEnv();
initOpenNextCloudflareForDev();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withPreact(nextConfig);