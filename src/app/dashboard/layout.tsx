import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { PanelSidebar } from "@/components/panel-sidebar";
import { auth } from "@/lib/auth";
import { countPendingForOwner } from "@/services/lead-followup-service";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const pendingFollowUps = session?.user?.id
    ? await countPendingForOwner(session.user.id)
    : 0;

  return (
    <SidebarProvider className="h-svh overflow-hidden">
      <PanelSidebar pendingFollowUps={pendingFollowUps} />
      <SidebarInset className="overflow-hidden">
        <div className="flex items-center gap-2 border-b px-4 py-2 shrink-0">
          <SidebarTrigger />
        </div>
        <div className="flex-1 overflow-y-auto p-6 min-w-0 flex flex-col">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
