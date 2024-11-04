import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: { 
    mdxRs: true,
  },
  serverExternalPackages: ['mongoose'],
};

export default nextConfig;

 

 
 
//  import type { NextConfig } from "next";

//   const nextConfig: NextConfig = {
//     /* config options here */
//     experimental: { 
//       // serverActions: true,
//       mdxRs: true,
//     },
//     webpack(config) {
//       config.externals.push('mongoose');
//       return config;
//     },
//   };

//   export default nextConfig;
