import React, { useState } from "react";
import { BiHome, BiLogOut, BiPackage } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router"; // Added useLocation
import Button from "../Button/Button";
import { logout } from "../../../features/auth/authSlice";

const menu = [
  { label: "الصفحة الرئيسية", icon: <BiHome className="size-5" />, path: "/" },
  {
    label: "الشركات",
    icon: <BiPackage className="size-5" />,
    path: "/company",
  },
  {
    label: "إدارة المستخدمين",
    icon: <BiPackage className="size-5" />,
    path: "/users",
    subMenu: [
      { label: "إضافة مستخدم", path: "/new" },
      { label: "قائمة المستخدمين", path: "" },
    ],
  },
  {
    label: "المشروعات",
    icon: <BiPackage className="size-5" />,
    path: "/projects",
    subMenu: [
      { label: "إضافة مشروع", path: "/new" },
      { label: "قائمة المشروعات", path: "" },
    ],
  },
  // ... other items with proper paths (fixed below)
  {
    label: "الخامات",
    icon: <BiPackage className="size-5" />,
    path: "/materials",
    subMenu: [
      { label: "إضافة خام", path: "/new" },
      {
        label: "قائمة الخامات",
        path: "",
        subMenu: [
          // Nested submenu now supported!
          { label: "الكل", path: "" },
          { label: "تسكين على الشركات", path: "/company-assignment" },
          { label: "تسكين على العقود", path: "/contract-assignment" },
          { label: "خصم", path: "/deduction" },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const { profile } = useSelector((state) => state.auth);
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  // Track all open dropdowns using path-like keys to support nested levels
  const [openDropdowns, setOpenDropdowns] = useState([]);

  const toggleDropdown = (path) => {
    setOpenDropdowns((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const isDropdownOpen = (path) => openDropdowns.includes(path);

  // Helper: Render menu items recursively
  const renderMenuItem = (item, parentPath = "", depth = 0) => {
    const fullPath = `${parentPath}${item.path}`;
    const hasSubMenu = item.subMenu && item.subMenu.length > 0;
    const isOpenDropdown = isDropdownOpen(fullPath);

    return (
      <div key={fullPath}>
        {hasSubMenu ? (
          <>
            {/* Dropdown Header */}
            <button
              onClick={() => toggleDropdown(fullPath)}
              className={`
                w-full flex items-center justify-between px-4 py-3 font-medium 
                transition-all duration-200 group cursor-pointer rounded-lg
                ${depth > 0 ? "text-sm" : ""}
                hover:bg-primary-100 hover:text-primary-content-100
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-primary">{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </div>
              {isOpen && (
                <IoIosArrowDown
                  className={`size-5 transition-transform duration-300 ${
                    isOpenDropdown ? "-rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {isOpen && hasSubMenu && (
              <ul
                className={`
                  space-y-1 transition-all duration-300 overflow-hidden
                  ${
                    isOpenDropdown
                      ? "max-h-96 opacity-100 ps-8"
                      : "max-h-0 opacity-0 ps-8"
                  }
                  ${depth > 0 ? "border-s-0 ps-6" : "ps-2"}
                `}
              >
                {item.subMenu.map((subItem) =>
                  subItem.subMenu ? (
                    // Recursive rendering for nested levels
                    <li key={subItem.path}>
                      {renderMenuItem(subItem, fullPath, depth + 1)}
                    </li>
                  ) : (
                    <li key={subItem.path}>
                      <NavLink
                        to={`${fullPath === "/" ? "" : fullPath}${
                          subItem.path
                        }`}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm rounded-md transition-colors  ${
                            isActive
                              ? "bg-primary-200 text-primary-content-200 font-medium"
                              : "hover:bg-primary-100 hover:text-primary-content-100"
                          }`
                        }
                        end // Important: prevents matching parent routes
                      >
                        {subItem.label}
                      </NavLink>
                    </li>
                  )
                )}
              </ul>
            )}
          </>
        ) : (
          /* Regular Menu Item */
          <NavLink
            to={item.path}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 font-medium transition-all duration-200 rounded-lg ${
                isActive
                  ? "bg-primary-200 text-primary-content-200 shadow-md"
                  : "hover:bg-primary-100 hover:text-primary-content-100"
              }`
            }
          >
            <span className="text-primary">{item.icon}</span>
            {isOpen && <span>{item.label}</span>}
          </NavLink>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
        h-screen transition-all duration-300 overflow-hidden text-nowrap bg-base border-l border-background px-2
        ${isOpen ? "w-56" : "w-17"}
      `}
    >
      <div className="flex flex-col justify-between h-full">
        {/* Menu */}
        <div className="flex flex-col h-full overflow-y-auto py-6 space-y-1">
          {menu.map((item) => renderMenuItem(item))}
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-primary-200 py-4 px-2">
          {profile && (
            <NavLink
              to="/profile"
              className="flex items-center gap-3 rounded-lg hover:bg-primary-100 transition-colors mb-3"
            >
              <img
                src={profile?.data?.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-9 h-9 rounded-full object-cover"
              />
              {isOpen && (
                <div className="flex flex-col">
                  <span className="font-bold text-sm">
                    {profile.data.fullName}
                  </span>
                  <span className="text-xs text-gray-500">
                    {profile.data.role}
                  </span>
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
