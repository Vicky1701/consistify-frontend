import React from "react";
import Sidebar from "../dashboard/Sidebar";
import ProfileMenu from "./ProfileMenu";
import "./AppLayout.css";

const AppLayout = ({ children, title = "Consistify Dashboard" }) => {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">
        <Sidebar />
      </aside>
      <div className="app-main">
        <header className="app-topbar">
          <h2 className="app-title">{title}</h2>
          <div className="app-topbar-profile">
            <ProfileMenu
              onLogout={() => {
                window.location.href = "/";
              }}
              onChangePassword={() => {
                alert("Change Password clicked!");
              }}
            />
          </div>
        </header>
        <main className="app-content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
