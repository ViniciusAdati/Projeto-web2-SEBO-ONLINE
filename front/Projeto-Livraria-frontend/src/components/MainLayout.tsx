import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { ChatSidebar } from "./ChatSidebar";

export function MainLayout() {
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(false);

  const toggleChatSidebar = () => {
    setIsChatSidebarOpen((prev) => !prev);
  };

  return (
    <div className="layout-container">
      <Navbar onChatIconClick={toggleChatSidebar} />

      <main className="main-content">
        <Outlet />
      </main>

      {isChatSidebarOpen && <ChatSidebar onClose={toggleChatSidebar} />}
    </div>
  );
}
