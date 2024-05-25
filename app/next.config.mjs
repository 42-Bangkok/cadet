/** @type {import('next').NextConfig} */
const nextConfig = {
  // disables webpack.cache.PackFileCacheStrategy] Serializing big strings (261kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
  webpack: (config) => {
    config.infrastructureLogging = {
      level: "error",
    };
    return config;
  },
};

export default nextConfig;
