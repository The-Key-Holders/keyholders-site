import ToolChrome from "@/components/psap-portal/ToolChrome";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
      <ToolChrome />
      {children}
    </div>
  );
}
