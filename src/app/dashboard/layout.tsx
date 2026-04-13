import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { PanelSidebar } from "@/components/panel-sidebar";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <PanelSidebar />
      <main className="flex-1">
        <div className="flex items-center gap-2 border-b px-4 py-2">
          <SidebarTrigger />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
