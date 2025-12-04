import React, { useState, useEffect } from "react";

function Visitors() {
  const [form, setForm] = useState({
    name: "",
    flatNumber: "",
    purpose: "",
  });

  const [visitors, setVisitors] = useState([]);

  // Fetch visitors from backend
  const fetchVisitors = async () => {
    try {
     const res = await fetch("/api/visitors");   // ✅ FIXED — no localhost:5000
      const data = await res.json();
      if (data.success) {
        setVisitors(data.visitors);
      }
    } catch (err) {
      console.log("Error fetching visitors:", err);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit visitor form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/visitors", {   // ✅ FIXED — no localhost:5000
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        alert("Visitor added");
        fetchVisitors(); // reload list
      }
    } catch (err) {
      console.log("Error:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Visitor</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Visitor Name"
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

        <input
          type="text"
          name="purpose"
          placeholder="Purpose"
          value={form.purpose}
          onChange={handleChange}
          required
        /><br /><br />

        <button>Add Visitor</button>
      </form>

      <h3>Visitor List</h3>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Flat</th>
            <th>Purpose</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {visitors.map((v) => (
            <tr key={v._id}>
              <td>{v.name}</td>
              <td>{v.flatNumber}</td>
              <td>{v.purpose}</td>
             <td>{v.date ? new Date(v.date).toLocaleString() : "No Date"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Visitors;
