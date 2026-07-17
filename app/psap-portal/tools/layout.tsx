import MarkProcessComplete from "@/components/psap-portal/MarkProcessComplete";
import ToolChrome from "@/components/psap-portal/ToolChrome";
import { Suspense } from "react";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
      <ToolChrome />
      <Suspense fallback={null}>
        <MarkProcessComplete />
      </Suspense>
      {children}
    </div>
  );
}
