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
import {
  LayoutDashboard,
  Palette,
  ChevronRight,
  Compass,
  Grid3X3,
  Images,
  LayoutTemplate,
  Plus,
} from "lucide-react";
import { useState } from "react";

const estrategiaItems = [
  { label: "Instagram", href: "/dashboard/estrategia/instagram" },
];

export function PanelSidebar() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  const [estrategiaOpen, setEstrategiaOpen] = useState(
    pathname.startsWith("/dashboard/estrategia")
  );
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
                  asChild
                >
                  <Link href="/dashboard" onClick={closeMobile}>
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Contenido</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname.startsWith("/dashboard/piezas") && pathname !== "/dashboard/piezas/nueva"}
                  asChild
                >
                  <Link href="/dashboard/piezas" onClick={closeMobile}>
                    <Images className="w-4 h-4" />
                    <span>Piezas</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/piezas/nueva"}
                  asChild
                >
                  <Link href="/dashboard/piezas/nueva" onClick={closeMobile}>
                    <Plus className="w-4 h-4" />
                    <span>Nueva pieza</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/templates"}
                  asChild
                >
                  <Link href="/dashboard/templates" onClick={closeMobile}>
                    <LayoutTemplate className="w-4 h-4" />
                    <span>Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                  asChild
                >
                  <Link href="/dashboard/instagram" onClick={closeMobile}>
                    <Grid3X3 className="w-4 h-4" />
                    <span>Feed</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Estrategia</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <Collapsible
                open={estrategiaOpen}
                onOpenChange={setEstrategiaOpen}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <Compass className="w-4 h-4" />
                      <span>Planes</span>
                      <ChevronRight className="ml-auto w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {estrategiaItems.map((item) => (
                        <SidebarMenuSubItem key={item.href}>
                          <SidebarMenuSubButton
                            isActive={pathname === item.href}
                            asChild
                          >
                            <Link href={item.href} onClick={closeMobile}>
                              {item.label}
                            </Link>
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
          <SidebarGroupLabel>Marca</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={pathname === "/dashboard/marca"}
                  asChild
                >
                  <Link href="/dashboard/marca" onClick={closeMobile}>
                    <Palette className="w-4 h-4" />
                    <span>Guía de marca</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
