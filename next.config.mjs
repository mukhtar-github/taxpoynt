/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Add this to handle the PDFDownloadLink issue
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
    env: {
        MONO_API_URL: process.env.MONO_API_URL,
        MONO_API_URL_TRANSACTIONS: process.env.MONO_API_URL_TRANSACTIONS,
        // ... other environment variables ...
    },
};

export default {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Add this to handle the PDFDownloadLink issue
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
    env: {
        MONO_API_URL: process.env.MONO_API_URL,
        MONO_API_URL_TRANSACTIONS: process.env.MONO_API_URL_TRANSACTIONS,
        // ... other environment variables ...
    },
};