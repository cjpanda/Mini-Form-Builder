import { Outlet, useLocation, Link } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function Layout() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-sky-50 ">
        <AppSidebar />
        <main className="flex-1 p-6 overflow-auto lg:pl-8">
          <SidebarTrigger />
          <div className="flex justify-between ">
            <Breadcrumb className="mb-4 flex ">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathnames.length > 0 && <BreadcrumbSeparator />}
              {pathnames.map((segment, i) => {
                const path = `/${pathnames.slice(0, i + 1).join("/")}`;
                return (
                  <BreadcrumbItem key={path}>
                    <BreadcrumbLink asChild>
                      <Link to={path}>
                        {segment.charAt(0).toUpperCase() + segment.slice(1)}
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                );
              })}
            </Breadcrumb>
          </div>

          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
