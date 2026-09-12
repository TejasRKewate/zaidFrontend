import { useEffect, useState } from "react";
import axios from "axios";
import { FiTool, FiClock, FiTrash2, FiInbox } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import './TechnnicianNotifications.css'

const API_URL = import.meta.env.VITE_API_URL;

const TechnicianNotification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchNotifications = async () => {
    try {
      // TRY BOTH ENDPOINTS - one will work
      // change to your actual mount point: /api/notifications or /api/notification
      const res = await axios.get(`${API_URL}/notifications/`, getAuthConfig());
      console.log("NOTIFICATIONS RESPONSE:", res.data);
      setNotifications(res.data?.notifications || res.data?.data || []);
    } catch (err) {
      console.error("Notification fetch failed:", err.response?.data || err.message);
      // try second path
      try {
        const res2 = await axios.get(`${API_URL}/notification/`, getAuthConfig());
        setNotifications(res2.data?.notifications || []);
      } catch(e) {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id) => {
    await axios.patch(`${API_URL}/notifications/${id}/read`, {}, getAuthConfig());
    fetchNotifications();
  };

  if (loading) return <p>Loading notifications...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Technician Notifications ({notifications.length})</h2>
      
      {notifications.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <FiInbox size={40} />
          <p>No notifications yet. Assign a repair to test.</p>
          <button onClick={fetchNotifications}>Refresh</button>
        </div>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => {
            //   markAsRead(n._id);
            //   if (n.relatedId) navigate(`/technician/repairs/${n.relatedId}`);
            navigate("/technician-dashboard/my-repairs")
            }}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "10px",
              background: n.isRead ? "#fff" : "#eef2ff",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong><FiTool /> {n.title}</strong>
              <small><FiClock /> {new Date(n.createdAt).toLocaleString()}</small>
            </div>
            <p>{n.message}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default TechnicianNotification;