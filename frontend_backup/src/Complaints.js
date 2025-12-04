import React, { useState, useEffect } from "react";

function Complaints() {
  const [form, setForm] = useState({
    name: "",
    flatNumber: "",
    complaintText: ""
  });

  const [complaints, setComplaints] = useState([]);

  // Fetch complaints from backend
  const fetchComplaints = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/complaints");
      const data = await response.json();

      if (data.success) {
        setComplaints(data.complaints);
      }
    } catch (err) {
      console.log("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        alert("Complaint submitted");
        setForm({ name: "", flatNumber: "", complaintText: "" });
        fetchComplaints();
      }

    } catch (err) {
      console.log("Error submitting complaint:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Submit Complaint</h2>

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

        <textarea
          name="complaintText"
          placeholder="Complaint Details"
          value={form.complaintText}
          onChange={handleChange}
          required
        /><br /><br />

        <button>Submit Complaint</button>
      </form>

      <h3>All Complaints</h3>

      {Array.isArray(complaints) && complaints.length > 0 ? (
        complaints.map((c) => (
          <div
            key={c._id}
            style={{
              padding: "15px",
              border: "1px solid #ccc",
              marginBottom: "10px",
              background: "#f9f9f9"
            }}
          >
            <h4>{c.name} — Flat {c.flatNumber}</h4>
            <p>{c.complaintText}</p>
            <small>Status: {c.status}</small><br />
            <small>{new Date(c.date).toLocaleString()}</small>
          </div>
        ))
      ) : (
        <p>No complaints found.</p>
      )}
    </div>
  );
}

export default Complaints;
