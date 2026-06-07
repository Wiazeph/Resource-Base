import type { NextConfig } from "next";

/**
 * 301 redirects from the legacy VitePress URLs to the new category pages,
 * so the domain keeps its existing search ranking. Old path -> new slug.
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  "/introduction": "/",
  // resources/
  "/resources/documents": "/category/documentation",
  "/resources/videos": "/category/videos",
  "/resources/courses": "/category/courses",
  "/resources/certificate-programs": "/category/certificate-programs",
  "/resources/training-code-battles-sites": "/category/practice",
  "/resources/cheat-sheets": "/category/cheat-sheets",
  "/resources/roadmaps": "/category/roadmaps",
  "/resources/github-repositories": "/category/github-repositories",
  "/resources/resource-search": "/category/resource-search",
  // assets/
  "/assets/ui-design": "/category/ui-components",
  "/assets/libraries-plugins": "/category/libraries-plugins",
  "/assets/ready-to-use": "/category/ready-to-use",
  "/assets/templates": "/category/templates",
  "/assets/icons": "/category/icons",
  "/assets/colors": "/category/colors",
  "/assets/fonts": "/category/fonts",
  "/assets/stock-media-resources": "/category/stock-media",
  // tools/
  "/tools/css-generators": "/category/css-generators",
  "/tools/hosts": "/category/hosting",
  "/tools/api": "/category/apis",
  // extensions/
  "/extensions/browser-extensions": "/category/browser-extensions",
  "/extensions/vscode-extensions": "/category/vscode-extensions",
  // useful-sections/
  "/useful-sections/ai-tools": "/category/ai-tools",
  "/useful-sections/cv-resume-builders": "/category/resume-builders",
  "/useful-sections/code-snippets": "/category/code-snippet-images",
  "/useful-sections/mockup-generators": "/category/mockup-generators",
  "/useful-sections/github-generators": "/category/github-generators",
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/**" },
    ],
  },
  async redirects() {
    return Object.entries(LEGACY_REDIRECTS).map(([source, destination]) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
