import React from "react";
import { Outlet } from "react-router";
import ThemeButton from "../../ui/ThemeButton/ThemeButton";
import Navbar from "../../ui/Navbar/Navbar";
import Sidebar from "../../ui/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <>
      <div className="min-h-screen flex">
        <Sidebar />
        <div className="content w-full">
          <Navbar />
          <section className="p-4">
            <Outlet />
          </section>
        </div>
      </div>
    </>
  );
}
