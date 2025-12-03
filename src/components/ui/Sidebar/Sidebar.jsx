import React, { useState } from "react";
import { BiHome, BiPackage } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { NavLink } from "react-router";

const menu = [
  {
    label: "الصفحة الرئيسية",
    icon: <BiHome className="size-5" />,
    path: "/",
  },
  {
    label: "الشركات",
    icon: <BiPackage className="size-5" />,
    path: "/company",
  },
  {
    label: "المشروعات",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
    subMenu: [
      {
        label: "إضافة مشروع",
        path: "/asd",
      },
      {
        label: "قائمة المشروعات",
        path: "/",
      },
    ],
  },
  {
    label: "المقايسات",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
    subMenu: [
      {
        label: "إضافة مقايسة",
        path: "/asd",
      },
      {
        label: "قائمة المقايسات",
        path: "/",
      },
    ],
  },
  {
    label: "العقود",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
    subMenu: [
      {
        label: "إضافة عقد",
        path: "/asd",
      },
      {
        label: "قائمة العقود",
        path: "/",
      },
    ],
  },
  {
    label: "المستخلصات",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
    subMenu: [
      {
        label: "إضافة مستخلص",
        path: "/asd",
      },
      {
        label: "قائمة المستخلصات",
        path: "/",
      },
    ],
  },
  {
    label: "أوامر التوريد",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
    subMenu: [
      {
        label: "إضافة امر توريد",
        path: "/asd",
      },
      {
        label: "قائمة أوامر التوريد",
        path: "/",
      },
    ],
  },
  {
    label: "الخامات",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
    subMenu: [
      {
        label: "إضافة خام",
        path: "/asd",
      },
      {
        label: "قائمة الخامات",
        path: "/",
      },
    ],
  },
  {
    label: "اللجان",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
    subMenu: [
      {
        label: "إضافة لجنة",
        path: "/asd",
      },
      {
        label: "قائمة اللجان",
        path: "/",
      },
    ],
  },
  {
    label: "الكل",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
  },
  {
    label: "تسكين علي الشركات",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
  },
  {
    label: "تسكين علي العقود",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
  },
  {
    label: "خصم",
    icon: <BiPackage className="size-5" />,
    path: "/yassin",
  },
];
export default function Sidebar() {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [openDropdowns, setOpenDropdowns] = useState([]);

  const toggleDropdown = (index) => {
    setOpenDropdowns((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const isDropdownOpen = (index) => openDropdowns.includes(index);

  return (
    <div
      className={`static inset-y-0 right-0 z-50 w-64 bg-base-200 transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? "static" : "hidden"}
        lg:translate-x-0 lg:static lg:inset-auto overflow-auto h-screen`}
    >
      <div className="flex flex-col h-full overflow-y-auto py-6 px-0 space-y-1">
        {menu.map((item, index) => (
          <div key={index}>
            {item.subMenu ? (
              <>
                {/* Dropdown Header */}
                <button
                  onClick={() => toggleDropdown(index)}
                  className="w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg  transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-primary">{item.icon}</span>
                    <span className="text-right">{item.label}</span>
                  </div>
                  <IoIosArrowDown
                    className={`size-5 transition-transform duration-300 ${
                      isDropdownOpen(index) ? "-rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Items */}
                <ul
                  className={`mr-6 space-y-1 transition-all duration-300 ease-in-out overflow-hidden ${
                    isDropdownOpen(index)
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  } border-s-2 ps-2`}
                >
                  {item.subMenu.map((subItem, subIndex) => (
                    <li key={subIndex}>
                      <NavLink
                        to={`${item.path}${subItem.path}`}
                        className={({ isActive }) =>
                          `block px-4 py-2.5 text-sm rounded-md transition-colors ${
                            isActive
                              ? "bg-primary-200 text-primary-content-200 font-medium"
                              : "hover:bg-primary-100 hover:text-primary-content-100"
                          }`
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              /* Regular Menu Item */
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary-200 text-primary-content-200 font-medium shadow-md"
                      : "hover:bg-primary-100 hover:text-primary-content-100"
                  }`
                }
              >
                <span className="text-primary">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
