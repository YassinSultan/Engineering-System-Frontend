import React from "react";
import { BiBuilding, BiHome, BiLogOut, BiPackage } from "react-icons/bi";
import { FaProjectDiagram } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Button from "../Button/Button";
import { logout } from "../../../features/auth/authSlice";

import SidebarNode from "./SidebarNode";

const menu = [
  {
    label: "الصفحة الرئيسية",
    icon: <BiHome className="size-5" />,
    path: "/",
  },
  {
    label: "الشركات",
    icon: <BiPackage className="size-5" />,
    path: "/companies",
    children: [
      {
        label: "إضافة شركة",
        path: "/companies/create",
        permissions: ["companies:create"],
      },
      {
        label: "قائمة الشركات",
        path: "/companies",
        permissions: ["companies:read", "companies:update", "companies:delete"],
      },
    ],
  },
  {
    label: "المشاريع",
    icon: <FaProjectDiagram className="size-5" />,
    path: "/projects",
    children: [
      {
        label: "إضافة مشروع",
        path: "/projects/create",
        permissions: ["companies:create"],
      },
      {
        label: "قائمة المشاريع",
        path: "/projects",
        permissions: ["companies:read", "companies:update", "companies:delete"],
      },
    ],
  },
  {
    label: "إدارة المستخدمين",
    icon: <BiPackage className="size-5" />,
    path: "/users",
    children: [
      {
        label: "إضافة مستخدم",
        path: "/users/create",
        permissions: ["users:create"],
      },
      {
        label: "قائمة المستخدمين",
        path: "/users",
        permissions: ["users:read", "users:update", "users:delete"],
      },
    ],
  },
  {
    label: "الوحدات التنظيمية",
    icon: <BiBuilding className="size-5" />,
    path: "/organization-units",
    permissions: ["organization-units:read"], // سوبر أدمن بس، بنخليه يظهر في الكود زي ما هو
  },
];

export default function Sidebar() {
  const { user } = useSelector((state) => state.auth);

  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  return (
    <div
      className={`
        h-screen transition-all duration-300 overflow-hidden text-nowrap bg-base border-l border-background px-2
        ${isOpen ? "w-56" : "w-16"}
      `}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Menu */}
        <div className="flex flex-col h-full overflow-y-auto py-6 space-y-1">
          {menu.map((item) => (
            <SidebarNode
              key={item.label}
              node={item}
              isOpen={isOpen}
              user={user}
            />
          ))}
        </div>
        {/* ادارة الوحدات */}
        {user?.role === "SUPER_ADMIN" && (
          <NavLink
            to="/organization-units"
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 my-2 font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? "bg-primary-200 text-primary-content-200 shadow-md"
                  : "hover:bg-primary-100 hover:text-primary-content-100"
              }`
            }
          >
            <span className="text-primary">
              <BiBuilding className="size-5" />
            </span>
            {isOpen && <span>ادارة الوحدات</span>}
          </NavLink>
        )}
        {/* User Profile & Logout */}
        <div className="border-t border-primary-200 py-4 px-2">
          {user && (
            <NavLink
              to="/profile"
              end
              className="flex items-center gap-3 rounded-lg hover:bg-primary-100 transition-colors mb-3"
            >
              <div className="border border-primary-200 p-1 rounded-full w-8 h-8">
                <img
                  src={`${user?.avatar}`}
                  alt="avatar"
                  className="object-cover"
                />
              </div>
              {isOpen && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm">
                    {user.fullNameArabic.split(" ")[0]}
                  </span>
                  <span className="text-xs text-gray-500">{user.role}</span>
                </div>
              )}
            </NavLink>
          )}

          <Button
            type="button"
            variant="danger"
            className="w-full justify-center gap-3"
            onClick={() => dispatch(logout())}
          >
            <BiLogOut className="size-5" />
            {isOpen && <span>تسجيل الخروج</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
