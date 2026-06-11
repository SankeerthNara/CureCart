import arcjet, { createMiddleware, detectBot, slidingWindow } from "@arcjet/next";

export const config = {
  // Only run the middleware on the API routes (specifically checkout and auth for now)
  matcher: ["/api/checkout/:path*", "/api/auth/:path*"],
};

// Initialize Arcjet
const aj = arcjet({
  // Provide a dummy key for development so the build succeeds, 
  // but it will need a real key in production.
  key: process.env.ARCJET_KEY || "ajkey_placeholder_so_it_doesnt_crash", 
  rules: [
    // Blocks automated bots but allows search engines (like Google) if we were protecting pages
    detectBot({
      mode: "LIVE", 
      allow: [], // blocks all bots
    }),
    // Rate limit: 10 requests every 60 seconds per IP address
    slidingWindow({
      mode: "LIVE",
      interval: 60,
      max: 10,
    }),
  ],
});

// Create and export the Next.js middleware
export default createMiddleware(aj);
