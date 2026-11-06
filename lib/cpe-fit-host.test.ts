import { describe, expect, it } from "vitest";
import {
  hostnameFromHostHeader,
  isCpeFitHost,
  isCpeFitHostAppPath,
  isCpeFitHostStaticPath,
  loginNextOnCpeFitHost,
} from "./cpe-fit-host";

describe("CPE Fit dedicated host", () => {
  it("matches cpe-fit.thekeyholders.org and subdomains, including port and forwarded lists", () => {
    expect(isCpeFitHost("cpe-fit.thekeyholders.org")).toBe(true);
    expect(isCpeFitHost("CPE-FIT.thekeyholders.org:443")).toBe(true);
    expect(isCpeFitHost("preview.cpe-fit.thekeyholders.org")).toBe(true);
    expect(isCpeFitHost("cpe-fit.thekeyholders.org, www.thekeyholders.org")).toBe(true);
    expect(hostnameFromHostHeader("cpe-fit.thekeyholders.org:443")).toBe("cpe-fit.thekeyholders.org");
  });

  it("matches Vercel aliases for the custom domain, not git-branch previews", () => {
    expect(isCpeFitHost("cpe-fit-thekeyholders-org.vercel.app")).toBe(true);
    expect(isCpeFitHost("cpe-fit-thekeyholders-org-cupofjavads-projects.vercel.app")).toBe(true);
    expect(
      isCpeFitHost("keyholders-site-git-cursor-cpe-fit-ec3a5c-cupofjavads-projects.vercel.app")
    ).toBe(false);
    expect(isCpeFitHost("keyholders-site.vercel.app")).toBe(false);
  });

  it("does not treat the public marketing hosts as CPE Fit", () => {
    expect(isCpeFitHost("thekeyholders.org")).toBe(false);
    expect(isCpeFitHost("www.thekeyholders.org")).toBe(false);
    expect(isCpeFitHost("www.thekeyholders.org:443")).toBe(false);
    expect(isCpeFitHost("")).toBe(false);
    expect(isCpeFitHost(undefined)).toBe(false);
  });

  it("classifies static assets and app paths for the dedicated host", () => {
    expect(isCpeFitHostStaticPath("/_next/static/chunk.js")).toBe(true);
    expect(isCpeFitHostStaticPath("/branding/v2/favicon.svg")).toBe(true);
    expect(isCpeFitHostStaticPath("/favicon.ico")).toBe(true);
    expect(isCpeFitHostStaticPath("/")).toBe(false);
    expect(isCpeFitHostStaticPath("/projects")).toBe(false);

    expect(isCpeFitHostAppPath("/advisor-tools/cpe-fit")).toBe(true);
    expect(isCpeFitHostAppPath("/advisor-tools/login")).toBe(true);
    expect(isCpeFitHostAppPath("/api/advisor-tools/auth")).toBe(true);
    expect(isCpeFitHostAppPath("/api/advisor-tools/cpe-fit/estimate")).toBe(true);
    expect(isCpeFitHostAppPath("/")).toBe(false);
    expect(isCpeFitHostAppPath("/projects")).toBe(false);
    expect(isCpeFitHostAppPath("/api/support/chat")).toBe(false);
  });

  it("sends marketing paths to / after login and keeps advisor-tools deep links", () => {
    expect(loginNextOnCpeFitHost("/")).toBe("/");
    expect(loginNextOnCpeFitHost("/projects")).toBe("/");
    expect(loginNextOnCpeFitHost("/support")).toBe("/");
    expect(loginNextOnCpeFitHost("/advisor-tools/cpe-fit/estimate")).toBe(
      "/advisor-tools/cpe-fit/estimate"
    );
  });
});
