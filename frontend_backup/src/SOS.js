import React, { useState, useEffect } from "react";

function SOS() {
  const [form, setForm] = useState({
    name: "",
    flatNumber: "",
    emergencyType: "",
    message: "",
  });

  const [alerts, setAlerts] = useState([]);

  // Fetch all SOS alerts
  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/sos");   // FIXED
      const data = await res.json();
      if (data.success) {
        setAlerts(data.sos);
      }
    } catch (err) {
      console.log("Error fetching SOS alerts:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/sos", {   // FIXED
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("SOS alert sent!");
        fetchAlerts();
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>SOS Emergency Alert</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br /><br />

        <input
          type="text"
          name="flatNumber"
          placeholder="Flat Number"
          value={form.flatNumber}
          onChange={handleChange}
          required
        /><br /><br />

        <select
          name="emergencyType"
          value={form.emergencyType}
          onChange={handleChange}
          required
        >
          <option value="">Select Emergency Type</option>
          <option value="Medical">Medical</option>
          <option value="Security">Security</option>
          <option value="Fire">Fire</option>
        </select><br /><br />

        <textarea
          name="message"
          placeholder="Emergency Details"
          value={form.message}
          onChange={handleChange}
          required
        /><br /><br />

        <button>Send SOS</button>
      </form>

      <h3>All SOS Alerts</h3>

      {alerts.map((s) => (
        <div
          key={s._id}
          style={{
            padding: "15px",
            border: "1px solid #ff4444",
            marginBottom: "10px",
            background: "#ffe5e5",
          }}
        >
          <h4>{s.name} — Flat {s.flatNumber}</h4>
          <p><strong>Type:</strong> {s.emergencyType}</p>
          <p>{s.message}</p>
          <small>Status: {s.status}</small><br />
          <small>{new Date(s.date).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default SOS;
