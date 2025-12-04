import React, { useState, useEffect } from "react";

function Payments() {
  const [form, setForm] = useState({
    name: "",
    flatNumber: "",
    month: "",
    amount: "",
    paymentMode: ""
  });

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch payments from backend
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/maintenance");
      const data = await res.json();

      console.log("FROM BACKEND:", data); // for debugging

      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments);
      } else {
        setPayments([]);
      }

      setLoading(false);
    } catch (err) {
      console.log("Error fetching payments:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // ✅ Update form values
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Payment recorded successfully!");

        // clear form after submit
        setForm({
          name: "",
          flatNumber: "",
          month: "",
          amount: "",
          paymentMode: ""
        });

        // reload list
        fetchPayments();
      } else {
        alert("❌ Error saving payment");
      }
    } catch (err) {
      console.log("Error:", err);
      alert("❌ Server error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Record Maintenance Payment</h2>

      {/* ✅ FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="flatNumber"
          placeholder="Flat Number"
          value={form.flatNumber}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="text"
          name="month"
          placeholder="Month (e.g. November)"
          value={form.month}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <br /><br />

        <select
          name="paymentMode"
          value={form.paymentMode}
          onChange={handleChange}
          required
        >
          <option value="">Select Payment Mode</option>
          <option value="UPI">UPI</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
        </select>
        <br /><br />

        <button type="submit">Submit Payment</button>
      </form>

      {/* ✅ PAYMENT LIST */}
      <h3>Payment Records</h3>

      {loading && <p>Loading payments...</p>}

      {!loading && payments.length === 0 && (
        <p>No payment records found.</p>
      )}

      {!loading && payments.map((p) => (
        <div
          key={p._id}
          style={{
            padding: "15px",
            border: "1px solid #ddd",
            marginBottom: "10px",
          }}
        >
          <h4>{p.name} — Flat {p.flatNumber}</h4>
          <p><strong>Month:</strong> {p.month}</p>
          <p><strong>Amount:</strong> ₹{p.amount}</p>
          <p><strong>Mode:</strong> {p.paymentMode}</p>
          <p><strong>Status:</strong> {p.status}</p>
          <small>{p.date ? new Date(p.date).toLocaleString() : "No Date"}</small>
        </div>
      ))}
    </div>
  );
}

export default Payments;
