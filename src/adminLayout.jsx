import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-white dark:bg-[#1E2126]">
                <AppSidebar />

                <main className="flex min-h-screen flex-1 flex-col">
                    {/* Sidebar Trigger */}
                    <div className="flex h-14 items-center px-4 bg-white text-black dark:bg-[#1E2126] dark:text-white">
                        <SidebarTrigger className="dark:text-white dark:bg-black hover:bg-[#292929] hover:text-[#00E5D4]" />
                    </div>

                    {/* Page Content */}
                    <div className="flex-1">
                        <Outlet />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}