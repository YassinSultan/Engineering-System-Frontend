import React from "react";
import { Outlet } from "react-router";
import ThemeButton from "../../ui/ThemeButton/ThemeButton";
import Navbar from "../../ui/Navbar/Navbar";
import Sidebar from "../../ui/Sidebar/Sidebar";

export default function MainLayout() {
  return (
    <>
      <div className="h-screen flex overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />

          <section className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </section>
        </div>
      </div>
    </>
  );
}
