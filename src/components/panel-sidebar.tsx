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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LayoutDashboard, Palette, Globe, ChevronRight, Compass, Grid3X3 } from "lucide-react";
import { useState } from "react";

const landingVersions = [
  { label: "V1 — Bold", href: "/landings/bold" },
  { label: "V2 — Creative", href: "/landings/creative" },
];

const estrategiaItems = [
  { label: "Instagram", href: "/dashboard/estrategia/instagram" },
];

export function PanelSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [landingsOpen, setLandingsOpen] = useState(pathname.startsWith("/dashboard/landings"));
  const [estrategiaOpen, setEstrategiaOpen] = useState(pathname.startsWith("/dashboard/estrategia"));
  const closeMobile = () => setOpenMobile(false);

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
                  render={<Link href="/dashboard" onClick={closeMobile} />}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/marca"}
                  render={<Link href="/dashboard/marca" onClick={closeMobile} />}
                >
                  <Palette className="w-4 h-4" />
                  <span>Guía de marca</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Estrategia</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible open={estrategiaOpen} onOpenChange={setEstrategiaOpen}>
                <SidebarMenuItem>
                  <SidebarMenuButton render={<CollapsibleTrigger />} className="cursor-pointer">
                    <Compass className="w-4 h-4" />
                    <span>Planes</span>
                    <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {estrategiaItems.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            isActive={pathname === item.href}
                            render={<Link href={item.href} onClick={closeMobile} />}
                          >
                            {item.label}
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

        <SidebarGroup>
          <SidebarGroupLabel>Instagram</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/instagram"}
                  render={<Link href="/dashboard/instagram" onClick={closeMobile} />}
                >
                  <Grid3X3 className="w-4 h-4" />
                  <span>Grid de perfil</span>
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
                            render={<a href={v.href} target="_blank" rel="noopener noreferrer" onClick={closeMobile} />}
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
