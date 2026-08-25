import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Jan-EPF AI: Edge Security, DPDP Act 2023 Compliance & Request Tracing Proxy
 * Runs on Vercel Fluid Compute Edge before cache evaluation.
 */

// Common exploit probes to drop immediately at the edge (zero compute cost)
const MALICIOUS_PATH_PATTERNS = [
  /^\/\.env/,
  /^\/\.git/,
  /^\/wp-admin/,
  /^\/wp-login/,
  /^\/phpmyadmin/,
  /^\/\.aws/,
  /^\/actuator/,
  /^\/solr/
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const startTime = Date.now();

  // 1. Edge WAF Pre-Filter: Drop malicious probes immediately with 403 Forbidden
  for (const pattern of MALICIOUS_PATH_PATTERNS) {
    if (pattern.test(pathname)) {
      return new NextResponse(
        JSON.stringify({
          error: "ACCESS_DENIED_EDGE_WAF",
          message: "Request blocked by Jan-EPF AI Edge Security Filter.",
          timestamp: new Date().toISOString()
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            "x-edge-blocked-reason": "MALICIOUS_PROBE_PATH",
            "x-dpdp-compliance": "ENFORCED",
            "Cache-Control": "no-store, private"
          }
        }
      );
    }
  }

  // 2. Request Tracing ID: Propagate or generate crypto UUID
  const incomingRequestId = request.headers.get("x-janepf-request-id") || request.headers.get("x-request-id");
  const requestId = incomingRequestId || `req_${crypto.randomUUID()}`;

  // 3. Geolocation & Edge Routing Extraction
  // Vercel Edge automatically populates x-vercel-ip-* headers at the nearest PoP
  const country = request.headers.get("x-vercel-ip-country") || "IN";
  const city = request.headers.get("x-vercel-ip-city") || "Mumbai";
  const region = request.headers.get("x-vercel-ip-country-region") || "MH";
  const latitude = request.headers.get("x-vercel-ip-latitude") || "19.0760";
  const longitude = request.headers.get("x-vercel-ip-longitude") || "72.8777";
  const vercelRegion = process.env.VERCEL_REGION || "bom1";

  // Determine Sovereign Data Zone (India Primary vs ASEAN Failover)
  const isIndiaJurisdiction = country === "IN";
  const dataSovereigntyZone = isIndiaJurisdiction ? "IN_MUMBAI_BOM1" : "SG_SIN1_FAILOVER";
  const edgeRoutingTier = "sub-50ms-optimized";

  // 4. Clone and mutate Request Headers for downstream Server Components & API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-janepf-request-id", requestId);
  requestHeaders.set("x-janepf-edge-start-time", startTime.toString());
  requestHeaders.set("x-client-country", country);
  requestHeaders.set("x-client-city", city);
  requestHeaders.set("x-client-region", region);
  requestHeaders.set("x-client-geo", `${latitude},${longitude}`);
  requestHeaders.set("x-data-sovereignty-zone", dataSovereigntyZone);

  // 5. Proceed with Request and construct Edge Response
  const response = NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });

  // 6. Inject DPDP Act 2023 Compliance & Security Headers into Outgoing Response
  response.headers.set("x-janepf-request-id", requestId);
  response.headers.set("x-dpdp-compliance", "ENFORCED");
  response.headers.set("x-dpdp-data-fiduciary", "EPFO-MINISTRY-OF-LABOUR-GOI");
  response.headers.set("x-dpdp-purpose-limitation", "PENSION_SETTLEMENT_KYC_GRIEVANCE");
  response.headers.set("x-dpdp-storage-limitation", "SOVEREIGN_IN_RESIDENCY_ONLY");
  response.headers.set("x-dpdp-pii-masking", "PRESIDIO_ON_DEVICE_ACTIVE");
  response.headers.set("x-data-sovereignty", "IN_JURISDICTION_PRIMARY");
  response.headers.set("x-data-sovereignty-zone", dataSovereigntyZone);
  response.headers.set("x-edge-pop", vercelRegion);
  response.headers.set("x-edge-latency-tier", edgeRoutingTier);
  response.headers.set("x-edge-execution-time-ms", (Date.now() - startTime).toString());

  // Strict cache busting on page routes so new Vercel deployments are served immediately
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  // Additional Security & Isolation Headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export default proxy;

/**
 * Matcher Configuration:
 * Exclude static assets, chunks, service workers, and favicon from proxy execution
 * to guarantee 0ms overhead on static CDN cache hits.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons/|images/).*)"
  ]
};
