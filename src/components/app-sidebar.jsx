import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";

import {
    House,
    CreditCard,
    Plane,
    BadgeCheck,
    SlidersHorizontal,
    Phone,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import { useUser } from "@/context/userContext"; // adjust path to match your project structure

const menuItems = [
    {
        title: "Home",
        icon: House,
        path: "/admin",
    },
    {
        title: "Expenses",
        icon: CreditCard,
        path: "/admin/expenses",
    },
    {
        title: "Trips",
        icon: Plane,
        path: "/admin/trips",
    },
    {
        title: "Approvals",
        icon: BadgeCheck,
        path: "/admin/approvals",
    },
    {
        title: "Settings",
        icon: SlidersHorizontal,
        path: "/admin/settings",
    },

];

export function AppSidebar() {
    const { user } = useUser();

    return (
        <Sidebar className="border-none bg-white dark:bg-[#1E2126]">
            {/* Header */}
            <SidebarHeader className="bg-white px-8 pt-8 pb-6 bg-white dark:bg-[#1E2126]">
                <div className="flex flex-col items-center">

                    {/* Profile Image */}
                    <div className="h-[86px] w-[86px] overflow-hidden rounded-full border-2 border-gray-300 dark:border-[#555]">
                        <img
                            src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.username || "U"}`}
                            alt="Profile"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Name */}
                    <h2 className="mt-4 text-[17px] font-bold text-gray-900 dark:text-white">
                        {user?.username || "Loading..."}
                    </h2>
                </div>
            </SidebarHeader>

            {/* Menu */}
            <SidebarContent className="bg-white px-8 dark:bg-[#1E2126]">
                <SidebarGroup className="mt-8 p-0">
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.title}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `group flex h-[56px] w-full items-center gap-4 rounded-lg px-3 transition-all duration-200 ${isActive
                                            ? "bg-gray-100 text-[#00bfb3] dark:bg-white/5 dark:text-[#00e5d4]"
                                            : "text-gray-700 hover:bg-gray-100 hover:text-[#00bfb3] dark:text-white dark:hover:bg-[#242424] dark:hover:text-[#00e5d4]"
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <Icon
                                                size={24}
                                                strokeWidth={2}
                                                className={
                                                    isActive
                                                        ? "text-[#00bfb3] dark:text-[#00e5d4]"
                                                        : "text-gray-500 group-hover:text-[#00bfb3] dark:text-[#d9ffff] dark:group-hover:text-[#00e5d4]"
                                                }
                                            />

                                            <span className="text-[17px] font-medium">
                                                {item.title}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}