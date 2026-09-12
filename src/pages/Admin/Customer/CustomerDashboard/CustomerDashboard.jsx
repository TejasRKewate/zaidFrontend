import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFolder,
  FaUser,
  FaChevronRight,
  FaPowerOff,
  FaCreditCard,
  FaHeart,
  FaBell,
  FaCommentDots,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";

import MyProfile from "../MyProfile";
import Wishlist from "../../../Shop/Wishlist/Wishlist";
import Cart from "../../../Shop/Cart/Cart";
import MyAddress from "../../../Profile/MyAddress/MyAddress";
import MyOrders from "../../../Shop/MyOrders/MyOrders";
import ChangePassword from "../ChangePassword";

const API = import.meta.env.VITE_API_URL;
const SERVER_URL = API ? API.replace("/api", "") : "";

const CustomerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeMenu, setActiveMenu] = useState(
    location.state?.activeMenu || "profile"
  );

  const [user, setUser] = useState({
    fullName: "Customer",
    role: "Customer",
    profileImage: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      if (!token) return;

      const res = await axios.get(`${API}/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = res.data?.data || res.data?.user || res.data || {};

      setUser({
        fullName:
          userData.fullName ||
          `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
          "Tejas Kewate",
        role: userData.role || "Customer",
        profileImage: userData.profileImage || "",
      });
    } catch (error) {
      console.error("Failed to load user profile in dashboard:", error);
    }
  };

  const getAvatarUrl = () => {
    if (user.profileImage) {
      return user.profileImage.startsWith("http")
        ? user.profileImage
        : `${SERVER_URL}${user.profileImage}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.fullName
    )}&background=2874f0&color=fff&bold=true`;
  };

  useEffect(() => {
    if (location.state?.activeMenu) {
      setActiveMenu(location.state.activeMenu);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const renderPage = () => {
    switch (activeMenu) {
      case "profile":
        return <MyProfile />;
      case "orders":
        return <MyOrders />;
      case "wishlist":
        return <Wishlist />;
      case "cart":
        return <Cart />;
      case "address":
        return <MyAddress />;
      case "password":
        return <ChangePassword />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="fk-dashboard-bg">
      <div className="fk-dashboard-container">
        {/* Left Sidebar */}
        <aside className="fk-sidebar">
          {/* User Profile Card */}
          <div className="fk-card fk-user-card">
            <img
              src={getAvatarUrl()}
              alt={user.fullName}
              className="fk-user-avatar"
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.fullName
                )}&background=2874f0&color=fff&bold=true`;
              }}
            />
            <div className="fk-user-info">
              <span className="fk-greeting">Hello,</span>
              <h4 className="fk-username">{user.fullName}</h4>
            </div>
          </div>

          {/* Navigation Links Card */}
          <div className="fk-card fk-nav-card">
            {/* MY ORDERS SECTION */}
            <div
              className={`fk-nav-header linkable ${
                activeMenu === "orders" ? "active-header" : ""
              }`}
              onClick={() => setActiveMenu("orders")}
            >
              <div className="fk-nav-title">
                <FaFolder className="fk-icon fk-icon-blue" />
                <span>MY ORDERS</span>
              </div>
              <FaChevronRight className="fk-arrow-icon" />
            </div>

            <div className="fk-nav-divider" />

            {/* ACCOUNT SETTINGS SECTION */}
            <div className="fk-nav-section">
              <div className="fk-nav-header">
                <div className="fk-nav-title">
                  <FaUser className="fk-icon fk-icon-blue" />
                  <span>ACCOUNT SETTINGS</span>
                </div>
              </div>

              <ul className="fk-subnav-list">
                <li
                  className={`fk-subnav-item ${
                    activeMenu === "profile" ? "active" : ""
                  }`}
                  onClick={() => setActiveMenu("profile")}
                >
                  Profile Information
                </li>
                <li
                  className={`fk-subnav-item ${
                    activeMenu === "address" ? "active" : ""
                  }`}
                  onClick={() => setActiveMenu("address")}
                >
                  Manage Addresses
                </li>
                <li
                  className={`fk-subnav-item ${
                    activeMenu === "password" ? "active" : ""
                  }`}
                  onClick={() => setActiveMenu("password")}
                >
                  Change Password
                </li>
              </ul>
            </div>

            <div className="fk-nav-divider" />

            {/* PAYMENTS SECTION */}
            <div className="fk-nav-section">
              <div className="fk-nav-header">
                <div className="fk-nav-title">
                  <FaCreditCard className="fk-icon fk-icon-blue" />
                  <span>PAYMENTS</span>
                </div>
              </div>

              <ul className="fk-subnav-list">
                <li className="fk-subnav-item fk-flex-between">
                  <span>Gift Cards</span>
                  <span className="fk-green-text">₹0</span>
                </li>
                <li className="fk-subnav-item">Saved UPI</li>
                <li className="fk-subnav-item">Saved Cards</li>
              </ul>
            </div>

            <div className="fk-nav-divider" />

            {/* MY STUFF SECTION */}
            <div className="fk-nav-section">
              <div className="fk-nav-header">
                <div className="fk-nav-title">
                  <FaFolder className="fk-icon fk-icon-blue" />
                  <span>MY STUFF</span>
                </div>
              </div>

              <ul className="fk-subnav-list">
                <li className="fk-subnav-item">My Coupons</li>
                <li className="fk-subnav-item">My Reviews & Ratings</li>
                <li className="fk-subnav-item">All Notifications</li>
                <li
                  className={`fk-subnav-item ${
                    activeMenu === "wishlist" ? "active" : ""
                  }`}
                  onClick={() => setActiveMenu("wishlist")}
                >
                  My Wishlist
                </li>
              </ul>
            </div>

            <div className="fk-nav-divider" />

            {/* LOGOUT */}
            <div
              className="fk-nav-header linkable fk-logout-row"
              onClick={handleLogout}
            >
              <div className="fk-nav-title">
                <FaPowerOff className="fk-icon fk-icon-blue" />
                <span>Logout</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="fk-main-content">
          <div className="fk-card fk-content-card">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;