/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: [
            's.gravatar.com', // auth profile pics
            'lh3.googleusercontent.com', // google profile pics
            'firebasestorage.googleapis.com', // paintings
        ]
    }
};

export default nextConfig;
