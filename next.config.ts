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
    images: {
        domains: [
            'avatars.githubusercontent.com',
            'lh3.googleusercontent.com',
        ]
    }
}

module.exports = nextConfig