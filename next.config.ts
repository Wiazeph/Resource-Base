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

/**
 * Content Security Policy. Whitelists exactly the origins the app talks to:
 *  - scripts: self + Google Analytics (@next/third-parties) + Vercel Analytics.
 *    Next.js injects inline hydration scripts, so 'unsafe-inline' is required
 *    here (nonce-based CSP needs per-request middleware wiring — out of scope).
 *  - styles: self + 'unsafe-inline' (Tailwind/Next inject inline styles) + Google Fonts.
 *  - images: self + https + data: (favicons via google s2, avatars).
 *  - connect: self + Supabase + Sanity + analytics endpoints.
 * Wildcards keep it portable across preview/prod and provider subdomains.
 */
// React's dev build uses eval() for debugging; production never does. So we
// only relax script-src with 'unsafe-eval' in development.
const scriptSrc =
  process.env.NODE_ENV === "development"
    ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com"
    : "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://va.vercel-scripts.com";

const csp = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' https: data:",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://*.sanity.io https://www.google-analytics.com https://*.vercel-scripts.com https://vitals.vercel-insights.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/**" },
    ],
  },
  async headers() {
    // Apply to everything except the Sanity Studio, which needs a looser CSP
    // (it loads its own scripts/iframes/eval and manages its own security).
    return [
      {
        source: "/((?!studio).*)",
        headers: securityHeaders,
      },
    ];
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
