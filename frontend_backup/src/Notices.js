import React, { useState, useEffect } from "react";

function Notices() {
  const [form, setForm] = useState({ title: "", message: "" });
  const [notices, setNotices] = useState([]);

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/notices");
      const data = await res.json();
      if (data.success) setNotices(data.notices);
    } catch (err) {
      console.log("Error fetching notices:", err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("Notice posted");
        setForm({ title: "", message: "" });
        fetchNotices();
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Notice</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Notice Title"
          value={form.title}
          onChange={handleChange}
          required
        /><br /><br />

        <textarea
          name="message"
          placeholder="Notice Message"
          value={form.message}
          onChange={handleChange}
          required
        /><br /><br />

        <button>Add Notice</button>
      </form>

      <h3>Notice Board</h3>

      {notices.map((n) => (
        <div key={n._id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h4>{n.title}</h4>
          <p>{n.message}</p>
          <small>{new Date(n.date).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}

export default Notices;
