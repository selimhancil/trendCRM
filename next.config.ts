import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Turbopack'i tamamen devre dışı bırak (Türkçe karakter sorunu için)
  // Next.js 16'da Turbopack varsayılan olarak açık, bu yüzden webpack kullanacağız
};

export default nextConfig;
