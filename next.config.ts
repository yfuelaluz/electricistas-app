import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Explicit turbopack root to avoid workspace root inference warnings
  turbopack: {
    root: path.resolve(__dirname),
  } as any,
};

export default nextConfig;
