import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */  images: {
    domains: [
      "lh3.googleusercontent.com", // Google profile pictures
      "avatars.githubusercontent.com", // GitHub avatars (if you use GitHub login)
      "cdn.discordapp.com", // Discord avatars (optional)
      "your-supabase-project.supabase.co", // replace with your actual Supabase project domain
    ],
  },
};

export default nextConfig;

// added by create cloudflare to enable calling `getCloudflareContext()` in `next dev`
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();






