import React from "react";
import { BiBuilding, BiHome, BiLogOut, BiPackage } from "react-icons/bi";
import { FaProjectDiagram, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Button from "../Button/Button";
import { logout } from "../../../features/auth/authSlice";

import SidebarNode from "./SidebarNode";
import { FaFileInvoiceDollar } from "react-icons/fa6";

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
        permissions: ["projects:create:project"],
      },
      {
        label: "قائمة المشاريع",
        path: "/projects",
        permissions: ["projects:read", "projects:update", "projects:delete"],
      },
    ],
  },
  {
    label: "المقايسات",
    icon: <FaFileInvoiceDollar className="size-5" />,
    path: "/billOfQuantitie",
    children: [
      {
        label: "إضافة مقايسة",
        path: "/bill-of-quantitie//create",
        permissions: ["billOfQuantitie:create"],
      },
      {
        label: "قائمة المقايسات",
        path: "/bill-of-quantitie",
        permissions: [
          "billOfQuantitie:read",
          "billOfQuantitie:update",
          "billOfQuantitie:delete",
        ],
      },
    ],
  },
  {
    label: "إدارة المستخدمين",
    icon: <FaUser className="size-5" />,
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
        {/* User Profile & Logout */}
        <div className="border-t border-primary-200 py-4 px-2">
          {user && (
            <NavLink
              to="/profile"
              end
              className="flex items-center gap-3 rounded-lg hover:bg-primary-100 transition-colors mb-3"
            >
              <div className="border  p-1 rounded-full w-8 h-8 bg-white">
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
                  <span className="text-xs opacity-70">{user.role}</span>
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
