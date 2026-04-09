"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OnMindLogo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LayoutDashboard, Palette, Globe, ChevronRight } from "lucide-react";
import { useState } from "react";

const landingVersions = [
  { label: "V1 — Bold", href: "/landings/bold" },
  { label: "V2 — Creative", href: "/landings/creative" },
];

export function PanelSidebar() {
  const pathname = usePathname();
  const [landingsOpen, setLandingsOpen] = useState(pathname.startsWith("/dashboard/landings"));

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <OnMindLogo className="h-8" color="#007056" />
        </Link>
        <span className="text-xs text-muted-foreground mt-1">Marketing</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard"}
                  render={<Link href="/dashboard" />}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/marca"}
                  render={<Link href="/dashboard/marca" />}
                >
                  <Palette className="w-4 h-4" />
                  <span>Guía de marca</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Contenido</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={landingsOpen} onOpenChange={setLandingsOpen}>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<CollapsibleTrigger />} className="cursor-pointer">
                      <Globe className="w-4 h-4" />
                      <span>Landings</span>
                      <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {landingVersions.map((v) => (
                        <SidebarMenuSubItem key={v.href}>
                          <SidebarMenuSubButton
                            render={<a href={v.href} target="_blank" rel="noopener noreferrer" />}
                          >
                            {v.label}
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
