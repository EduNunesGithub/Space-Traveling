/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["images.prismic.io"]
	},
	reactStrictMode: true,
	swcMinify: true,
}

module.exports = nextConfig