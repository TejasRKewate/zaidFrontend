import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ReceptionSettings.css"; 

const ReceptionSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    deskNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // 1. Fetch current profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage({ text: "Session expired. Please log in again.", type: "error" });
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/receptionist/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.success && res.data?.data) {
          const { name, email, phone, deskNumber } = res.data.data;
          setProfile({
            name: name || "",
            email: email || "",
            phone: phone || "",
            deskNumber: deskNumber || "",
          });
        }
      } catch (err) {
        setMessage({
          text: err.response?.data?.message || "Failed to load profile.",
          type: "error",
        });
      }
    };

    fetchProfile();
  }, []);

  // 2. Submit Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "http://localhost:5000/api/receptionist/profile",
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setMessage({ text: res.data.message || "Profile updated.", type: "success" });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to update profile.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // 3. Submit Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setMessage({ text: "New passwords do not match.", type: "error" });
    }

    if (passwordData.newPassword.length < 6) {
      return setMessage({ text: "Password must be at least 6 characters.", type: "error" });
    }

    setPasswordLoading(true);
    setMessage({ text: "", type: "" });

    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "http://localhost:5000/api/receptionist/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setMessage({ text: res.data.message || "Password updated.", type: "success" });
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setMessage({
        text: err.response?.data?.message || "Failed to change password.",
        type: "error",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="tech-settings-wrapper">
      <div className="tech-settings-header">
        <h1>Receptionist Settings</h1>
        <p>Manage your contact information and login credentials.</p>
      </div>

      {message.text && (
        <div className={`tech-alert ${message.type}`}>
          <span>{message.type === "success" ? "✓" : "✕"}</span>
          <span>{message.text}</span>
        </div>
      )}

      {/* Profile Section */}
      <section className="tech-card">
        <div className="tech-card-header">
          <h2>Profile Details</h2>
        </div>
        <form onSubmit={handleProfileSubmit}>
          <div className="form-grid-2">
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                className="input-field"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                className="input-field"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="input-field"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Desk / Counter Number</label>
              <input
                type="text"
                className="input-field"
                value={profile.deskNumber}
                onChange={(e) => setProfile({ ...profile, deskNumber: e.target.value })}
                placeholder="e.g. Counter 1"
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-modern btn-modern-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      {/* Security Section */}
      <section className="tech-card">
        <div className="tech-card-header">
          <h2>Security & Credentials</h2>
        </div>
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-grid-3">
            <div className="input-group">
              <label>Current Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, currentPassword: e.target.value })
                }
                placeholder="••••••••"
                required
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, newPassword: e.target.value })
                }
                placeholder="••••••••"
                required
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                className="input-field"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn-modern btn-modern-dark"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ReceptionSettings;