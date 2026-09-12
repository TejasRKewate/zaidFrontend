import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import "./ChangePassword.css";

const API = import.meta.env.VITE_API_URL;

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    // Client-side validations
    if (formData.newPassword !== formData.confirmPassword) {
      return setStatus({
        type: "error",
        message: "New password and confirmation do not match.",
      });
    }

    if (formData.newPassword.length < 6) {
      return setStatus({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
    }

    if (formData.oldPassword === formData.newPassword) {
      return setStatus({
        type: "error",
        message: "New password must be different from current password.",
      });
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return setStatus({
        type: "error",
        message: "User session expired. Please log in again.",
      });
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${API}/users/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus({
        type: "success",
        message: res.data?.message || "Password changed successfully!",
      });

      // Clear fields
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.response?.data?.message || "Failed to update password. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-card">
      <div className="card-header">
        <div className="icon-badge">
          <FaKey />
        </div>
        <div>
          <h3>Change Password</h3>
          <p>Protect your account by setting a strong, unique password.</p>
        </div>
      </div>

      {status.message && (
        <div className={`status-banner ${status.type}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="password-form">
        {/* Current Password */}
        <div className="input-group">
          <label htmlFor="oldPassword">Current Password</label>
          <div className="input-wrapper">
            <input
              id="oldPassword"
              type={showPassword.old ? "text" : "password"}
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() => toggleVisibility("old")}
            >
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="input-group">
          <label htmlFor="newPassword">New Password</label>
          <div className="input-wrapper">
            <input
              id="newPassword"
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter at least 6 characters"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() => toggleVisibility("new")}
            >
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className="input-wrapper">
            <input
              id="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              className="toggle-eye"
              onClick={() => toggleVisibility("confirm")}
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;