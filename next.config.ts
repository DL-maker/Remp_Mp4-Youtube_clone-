import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "thispersondoesnotexist.com",
      },
      {
        protocol: "http",
        hostname: "test.com",
      }
    ],
  },
  webpack: (config) => { // Cette configuration permet de traiter les fichiers vidéo avec file-loader
    config.module.rules.push({
      test: /\.(mp4|webm)$/, // Les fichiers vidéo doivent être traités par file-loader
      use: {
        loader: 'file-loader', 
        options: {
          publicPath: '/_next/static/videos/',
          outputPath: 'static/videos/',
          name: '[name].[hash].[ext]', // Le nom du fichier doit contenir un hachage unique
        },
      },
    });
    return config;
  },
  experimental: { // Le but de cette configuration est de permettre à l'application de communiquer avec l'API
    serverActions: { 
      bodySizeLimit: '1mb', // Limite la taille des requêtes à 1 Mo
      allowedOrigins: ['*'], // Autorise les requêtes de n'importe quelle origine
    },
  }
};

export default nextConfig;