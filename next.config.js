/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        modularizeImports: {
            "@mui/material/?(((\\w*)?/?)*)": {
                transform: "@mui/material/{{ matches.[1] }}/{{member}}",
            },
            "@mui/icons-material/?(((\\w*)?/?)*)": {
                transform: "@mui/icons-material/{{ matches.[1] }}/{{member}}",
            },
        },
    },
    async rewrites() {
        return [
            {
                source: "/",
                destination: "/dashboard",
            },
        ];
    },
};

module.exports = nextConfig;
