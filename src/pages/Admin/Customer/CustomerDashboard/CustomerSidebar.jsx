import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import './CustomerSidebar.css'
import {
  FaFolder,
  FaUser,
  FaChevronRight,
  FaPowerOff,
  FaCreditCard,
  FaHeart,
} from "react-icons/fa";

const API = import.meta.env.VITE_API_URL;
const SERVER_URL = API ? API.replace("/api", "") : "";

const CustomerSidebar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    fullName: "Customer",
    role: "Customer",
    profileImage: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!token) return;

        const res = await axios.get(`${API}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data?.data || res.data?.user || res.data || {};

        setUser({
          fullName:
            userData.fullName ||
            `${userData.firstName || ""} ${userData.lastName || ""}`.trim() ||
            "Customer",
          role: userData.role || "Customer",
          profileImage: userData.profileImage || "",
        });
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    fetchUserData();
  }, [token]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside className="fk-sidebar">
      {/* Profile Header Card */}
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

      {/* Navigation Card */}
      <div className="fk-card fk-nav-card">
        {/* MY ORDERS */}
        <NavLink
          to="orders"
          className={({ isActive }) =>
            `fk-nav-header linkable ${isActive ? "active-header" : ""}`
          }
        >
          <div className="fk-nav-title">
            <FaFolder className="fk-icon fk-icon-blue" />
            <span>MY ORDERS</span>
          </div>
          <FaChevronRight className="fk-arrow-icon" />
        </NavLink>

        <div className="fk-nav-divider" />

        {/* ACCOUNT SETTINGS */}
        <div className="fk-nav-section">
          <div className="fk-nav-header">
            <div className="fk-nav-title">
              <FaUser className="fk-icon fk-icon-blue" />
              <span>ACCOUNT SETTINGS</span>
            </div>
          </div>
          <ul className="fk-subnav-list">
            <li>
              <NavLink
                to="profile"
                className={({ isActive }) =>
                  `fk-subnav-item ${isActive ? "active" : ""}`
                }
              >
                Profile Information
              </NavLink>
            </li>
            <li>
              <NavLink
                to="address"
                className={({ isActive }) =>
                  `fk-subnav-item ${isActive ? "active" : ""}`
                }
              >
                Manage Addresses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="password"
                className={({ isActive }) =>
                  `fk-subnav-item ${isActive ? "active" : ""}`
                }
              >
                Change Password
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="fk-nav-divider" />

        {/* PAYMENTS */}
        <div className="fk-nav-section">
          <div className="fk-nav-header">
            <div className="fk-nav-title">
              <FaCreditCard className="fk-icon fk-icon-blue" />
              <span>PAYMENTS</span>
            </div>
          </div>
          <ul className="fk-subnav-list">
            <li>
              <NavLink
                to="gift-cards"
                className={({ isActive }) =>
                  `fk-subnav-item fk-flex-between ${isActive ? "active" : ""}`
                }
              >
                <span>Gift Cards</span>
                <span className="fk-green-text">₹0</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="saved-upi"
                className={({ isActive }) =>
                  `fk-subnav-item ${isActive ? "active" : ""}`
                }
              >
                Saved UPI
              </NavLink>
            </li>
            <li>
              <NavLink
                to="saved-cards"
                className={({ isActive }) =>
                  `fk-subnav-item ${isActive ? "active" : ""}`
                }
              >
                Saved Cards
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="fk-nav-divider" />

        {/* MY STUFF */}
        <div className="fk-nav-section">
          <div className="fk-nav-header">
            <div className="fk-nav-title">
              <FaFolder className="fk-icon fk-icon-blue" />
              <span>MY STUFF</span>
            </div>
          </div>
          <ul className="fk-subnav-list">
            <li>
              <NavLink
                to="wishlist"
                className={({ isActive }) =>
                  `fk-subnav-item ${isActive ? "active" : ""}`
                }
              >
                My Wishlist
              </NavLink>
            </li>
            <li>
              <NavLink
                to="cart"
                className={({ isActive }) =>
                  `fk-subnav-item ${isActive ? "active" : ""}`
                }
              >
                My Cart
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="fk-nav-divider" />

        {/* LOGOUT */}
        <div className="fk-nav-header linkable fk-logout-row" onClick={handleLogout}>
          <div className="fk-nav-title">
            <FaPowerOff className="fk-icon fk-icon-blue" />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CustomerSidebar;