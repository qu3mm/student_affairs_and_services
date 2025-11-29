"use client";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  ArrowRightLeftIcon,
  CalendarClockIcon,
  ChartNoAxesCombinedIcon,
  ChartPieIcon,
  ChartSplineIcon,
  Clock9Icon,
  HashIcon,
  SettingsIcon,
  SquareActivityIcon,
  Undo2Icon,
  UsersIcon,
} from "lucide-react";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: ChartNoAxesCombinedIcon,
    href: "dashboard",
  },
  {
    label: "Events",
    icon: ChartSplineIcon,
    href: "events",
  },
  {
    label: "Services",
    icon: UsersIcon,
    href: "students",
  },
  {
    label: "Organizations",
    icon: ChartPieIcon,
    href: "#",
  },
];

export const AdminSideBar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
