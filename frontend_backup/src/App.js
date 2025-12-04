import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Visitors from "./Visitors";
import Notices from "./Notices";
import Complaints from "./Complaints";
import Payments from "./Payments";
import SOS from "./SOS";

function Home() {
  return <h2 style={{ padding: 20 }}>Welcome to Zeecurity App</h2>;
}

function App() {
  return (
    <Router>
      <Navbar />

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/visitors" element={<Visitors />} />
  <Route path="/complaints" element={<Complaints />} />
  <Route path="/sos" element={<SOS />} />
  <Route path="/notices" element={<Notices />} />
  <Route path="/payments" element={<Payments />} />
</Routes>


    </Router>
  );
}

export default App;
