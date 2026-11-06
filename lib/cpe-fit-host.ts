/**
 * Dedicated CPE Fit hostname helpers (edge- and client-safe).
 * Do not import Node crypto or server-only modules from this file.
 */

export const CPE_FIT_PUBLIC_HOST = "cpe-fit.thekeyholders.org";

/** Paths that stay on this host after login (existing gated tools + CPE Fit). */
const CPE_FIT_HOST_APP_PREFIXES = [
  "/advisor-tools",
  "/api/advisor-tools",
  "/psap-allotment",
  "/api/psap-allotment",
  "/psap-portal",
  "/api/psap-portal",
  "/api/invoice-reconcile",
] as const;

export function hostnameFromHostHeader(hostHeader: string | null | undefined): string {
  if (!hostHeader) return "";
  return hostHeader.split(",")[0].trim().split(":")[0].toLowerCase();
}

/**
 * True for cpe-fit.thekeyholders.org, its subdomains, and Vercel aliases
 * generated for that custom domain — not git-branch preview URLs.
 */
export function isCpeFitHost(hostHeader: string | null | undefined): boolean {
  const host = hostnameFromHostHeader(hostHeader);
  if (!host) return false;
  if (host === CPE_FIT_PUBLIC_HOST || host.endsWith(`.${CPE_FIT_PUBLIC_HOST}`)) {
    return true;
  }
  // Vercel alias of the custom domain (dashes for dots), never keyholders-site-git-* previews.
  if (host === "cpe-fit-thekeyholders-org.vercel.app") return true;
  if (host.startsWith("cpe-fit-thekeyholders-org-") && host.endsWith(".vercel.app")) return true;
  return false;
}

export function isCpeFitHostStaticPath(pathname: string): boolean {
  if (pathname.startsWith("/_next/")) return true;
  if (pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return true;
  }
  return /\.(?:avif|css|gif|ico|jpeg|jpg|js|map|png|svg|txt|webp|woff2?)$/i.test(pathname);
}

export function isCpeFitHostAppPath(pathname: string): boolean {
  return CPE_FIT_HOST_APP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** After login, `/` is CPE Fit. Keep deep links into advisor-tools; send marketing paths home. */
export function loginNextOnCpeFitHost(pathname: string): string {
  if (isCpeFitHostAppPath(pathname)) return pathname;
  return "/";
}
