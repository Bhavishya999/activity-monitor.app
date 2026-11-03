import { Outlet } from "@tanstack/react-router";
import { useState, type ReactElement } from "react";
import { AppSidebar } from "./AppSidebar";
import { SampleBanner } from "./SampleBanner";
import { TopBar } from "./TopBar";

export function MainLayout(): ReactElement {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <AppSidebar isOpen={isMenuOpen} onClose={() => { setIsMenuOpen(false); }} />
      <div className="lg:pl-64">
        <SampleBanner />
        <TopBar onMenu={() => { setIsMenuOpen(true); }} />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6"><Outlet /></main>
      </div>
    </div>
  );
}
