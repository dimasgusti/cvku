/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/my-portfolio',
                destination: '/dashboard/my-portfolio',
            },
            {
                source: '/my-cv',
                destination: '/dashboard/my-cv',
            },
        ]
    },
}

module.exports = nextConfig