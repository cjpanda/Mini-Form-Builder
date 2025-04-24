import { Link } from "react-router-dom";

import "./icon.css";
import {
  FileText,
  ChartLine,
  Brain,
  MessageCircleQuestion,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Menu items.
const items = [
  {
    title: "My Forms",
    url: "/forms",
    icon: FileText,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: ChartLine,
  },
  {
    title: "Knowledge Base",
    url: "/knowledge",
    icon: Brain,
  },
  {
    title: "Help & Support",
    url: "/help",
    icon: MessageCircleQuestion,
  },
];

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-slate-800 text-white  pt-5 ">
        <SidebarGroup>
          <SidebarGroupLabel className="mt-2 mb-10 flex items-center gap-2 font-semibold text-xl tracking-wide px-3 py-10 text-muted-foreground">
            <FileText className="text-sky-500 icons" />
            <span className="text-white text-3xl">Form Builder</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-5 ">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon className="icons-bar" />
                      <span className="text-lg">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-slate-800 text-white hover:bg-transparent hover:border-none pb-5">
        <SidebarMenu>
          <SidebarMenuItem className="bg-transparent">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <DropdownMenuLabel />{" "}
                  <span className="text-lg cursor-pointer ">My Profile</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className=" w-80 my-2  hover:bg-transparent hover:text-white"
              >
                <DropdownMenuItem>
                  <span className="text-lg  cursor-pointer">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
