import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AdvisorFab, AdvisorDrawer } from "./Advisor";

export default function Layout({ children }) {
  return (
    <div className="flex bg-surface-page min-h-screen">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar />
        <main className="flex-1 page-fade">{children}</main>
      </div>
      <AdvisorFab />
      <AdvisorDrawer />
    </div>
  );
}
