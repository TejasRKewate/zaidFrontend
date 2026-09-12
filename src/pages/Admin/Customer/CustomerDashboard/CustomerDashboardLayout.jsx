import React from "react";
import { Outlet } from "react-router-dom";
import CustomerSidebar from "./CustomerSidebar";
import "./CustomerDashboardLayout.css";

const CustomerDashboardLayout = () => {
  return (
    <div className="fk-dashboard-bg">
      <div className="fk-dashboard-container">
        <CustomerSidebar />
        <main className="fk-main-content">
          <div className="fk-card fk-content-card">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout;