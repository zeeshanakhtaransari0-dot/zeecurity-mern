import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={styles.nav}>
      <h2 style={styles.logo}>Zeecurity</h2>

      <ul style={styles.menu}>
        <li><Link style={styles.link} to="/">Home</Link></li>
        <li><Link style={styles.link} to="/visitors">Visitors</Link></li>
        <li><Link style={styles.link} to="/notices">Notices</Link></li>
        <li><Link style={styles.link} to="/complaints">Complaints</Link></li>
        <li><Link style={styles.link} to="/payments">Payments</Link></li>
        <li><Link style={styles.link} to="/sos">SOS</Link></li>
      </ul>
    </nav>
  );
}

const styles = {
  nav: {
    background: "#111",
    padding: "15px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    color: "#61dafb",
    margin: 0
  },
  menu: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    margin: 0,
    padding: 0
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px"
  }
};

export default Navbar;
