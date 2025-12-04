// src/Dashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Chip,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import PeopleIcon from "@mui/icons-material/People";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export default function Dashboard() {
  const [stats, setStats] = useState({
    visitorsToday: 0,
    openComplaints: 0,
    activeSos: 0,
    totalPayments: 0,
    totalNotices: 0,
  });

  const [recentNotices, setRecentNotices] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentSos, setRecentSos] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);

  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    loadStatsAndLists();
  }, []);

  async function loadStatsAndLists() {
    try {
      const visitorsPromise = axios.get(`${API_BASE}/visitors`);
      const complaintsPromise = axios.get(`${API_BASE}/complaints`);
      const sosPromise = axios.get(`${API_BASE}/sos`);
      const paymentsPromise = axios.get(`${API_BASE}/maintenance`);
      const noticesPromise = axios.get(`${API_BASE}/notices`);

      const [
        visitorsRes,
        complaintsRes,
        sosRes,
        paymentsRes,
        noticesRes,
      ] = await Promise.all([
        visitorsPromise,
        complaintsPromise,
        sosPromise,
        paymentsPromise,
        noticesPromise,
      ]);

      // VISITORS
      let vData = visitorsRes.data;
      let visitorsList = [];
      if (Array.isArray(vData)) visitorsList = vData;
      else if (vData && Array.isArray(vData.visitors)) visitorsList = vData.visitors;
      else if (vData && Array.isArray(vData.data)) visitorsList = vData.data;
      else if (vData && typeof vData === "object") {
        const arr = Object.values(vData).find((v) => Array.isArray(v));
        visitorsList = arr || [];
      }
      const activeVisitors = visitorsList.filter((v) => !v.outTime);
      const visitorsToday = activeVisitors.length;

      const latestVisitors = activeVisitors
        .slice()
        .sort((a, b) => {
          const ta = a.inTime || a.date || a.createdAt;
          const tb = b.inTime || b.date || b.createdAt;
          return new Date(tb || 0) - new Date(ta || 0);
        })
        .slice(0, 3);

      // COMPLAINTS
      let cData = complaintsRes.data;
      let complaintsList = Array.isArray(cData)
        ? cData
        : (cData && cData.complaints) || [];
      const openComplaints = complaintsList.filter(
        (c) => (c.status || "").toLowerCase() !== "resolved"
      ).length;

      const latestComplaints = complaintsList
        .slice()
        .sort((a, b) => {
          const ta = a.createdAt || a.inTime;
          const tb = b.createdAt || b.inTime;
          return new Date(tb || 0) - new Date(ta || 0);
        })
        .slice(0, 3);

      // SOS
      let sData = sosRes.data;
      let sosList = sData;
      if (!Array.isArray(sosList) && sData?.sos) sosList = sData.sos;
      if (!Array.isArray(sosList)) sosList = [];
      const activeSos = sosList.filter(
        (a) => (a.status || "").toLowerCase() !== "resolved"
      ).length;

      const latestSos = sosList
        .slice()
        .sort((a, b) => {
          const ta = a.createdAt || a.date || a.inTime;
          const tb = b.createdAt || b.date || b.inTime;
          return new Date(tb || 0) - new Date(ta || 0);
        })
        .slice(0, 3);

      // PAYMENTS
      let pData = paymentsRes.data;
      let paymentsList = [];
      if (Array.isArray(pData)) {
        paymentsList = pData;
      } else if (pData?.success && Array.isArray(pData.payments)) {
        paymentsList = pData.payments;
      } else if (Array.isArray(pData?.payments)) {
        paymentsList = pData.payments;
      } else {
        paymentsList = pData?.payments || pData?.data || [];
      }
      const totalPayments = paymentsList.length;

      const latestPayments = paymentsList
        .slice()
        .map((p) => ({
          name: p.name || p.payer || "",
          flatNumber: p.flatNumber || p.flat || p.flatNo || "",
          amount: p.amount || p.amt || 0,
          date: p.date || p.createdAt || p.timestamp,
        }))
        .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
        .slice(0, 3);

      // NOTICES
      let nData = noticesRes.data;
      let noticesList = [];
      if (Array.isArray(nData)) noticesList = nData;
      else if (Array.isArray(nData.notices)) noticesList = nData.notices;
      const totalNotices = noticesList.length;

      const latestNotices = noticesList
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
        )
        .slice(0, 5);

      setStats({
        visitorsToday,
        openComplaints,
        activeSos,
        totalPayments,
        totalNotices,
      });
      setRecentVisitors(latestVisitors);
      setRecentComplaints(latestComplaints);
      setRecentSos(latestSos);
      setRecentPayments(latestPayments);
      setRecentNotices(latestNotices);
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoadingNotices(false);
    }
  }

  const StatCard = ({ title, value, icon, gradient }) => (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0 12px 30px rgba(15,23,42,0.10)",
        overflow: "hidden",
        transition: "all 0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 18px 40px rgba(15,23,42,0.18)",
        },
        background: gradient,
        color: "#fff",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            bgcolor: "rgba(15,23,42,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" sx={{ textTransform: "uppercase" }}>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.3 }}>
            {value}
          </Typography>
        </Box>
      </Box>
    </Card>
  );

  const panelCardBase = {
    borderRadius: 3,
    boxShadow: "0 8px 22px rgba(15,23,42,0.08)",
    transition: "all 0.25s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 14px 32px rgba(15,23,42,0.18)",
    },
    background: "linear-gradient(145deg,#f9fafb,#ffffff)",
  };

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 0 0, #e0f2fe 0, transparent 40%), radial-gradient(circle at 100% 0, #fee2e2 0, transparent 45%), #eef2ff",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Box>
          <Typography
            variant="overline"
            sx={{ letterSpacing: 2, color: "#6b7280" }}
          >
            SOCIETY CONTROL PANEL
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: 0.3 }}>
            Zeecurity Dashboard
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", mt: 0.5 }}>
            Live snapshot of visitors, complaints, SOS alerts and payments.
          </Typography>
        </Box>

        <Chip
          icon={<NotificationsActiveIcon />}
          label="Live · Guard View"
          color="primary"
          sx={{
            fontWeight: 600,
            background: "rgba(37,99,235,0.08)",
            borderRadius: 999,
          }}
        />
      </Box>

      {/* Top stat cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Visitors Inside"
            value={stats.visitorsToday}
            icon={<PeopleIcon />}
            gradient="linear-gradient(135deg,#2563eb,#38bdf8)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Open Complaints"
            value={stats.openComplaints}
            icon={<ReportProblemIcon />}
            gradient="linear-gradient(135deg,#f97316,#fb7185)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Active SOS"
            value={stats.activeSos}
            icon={<WarningAmberIcon />}
            gradient="linear-gradient(135deg,#dc2626,#f97316)"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard
            title="Total Notices"
            value={stats.totalNotices}
            icon={<NotificationsActiveIcon />}
            gradient="linear-gradient(135deg,#16a34a,#22c55e)"
          />
        </Grid>
      </Grid>

      {/* Welcome card – upgraded hero style */}
<Card
  sx={{
    ...panelCardBase,
    mb: 3,
    display: "flex",
    overflow: "hidden",
    p: 0,
  }}
>
  {/* Left colorful strip */}
  <Box
    sx={{
      width: { xs: "0", md: "230px" },
      display: { xs: "none", md: "flex" },
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background:
        "radial-gradient(circle at 0 0,#38bdf8,transparent 55%), linear-gradient(180deg,#1d4ed8,#2563eb)",
      color: "#e5f0ff",
      px: 3,
      py: 4,
    }}
  >
    <Box
      sx={{
        width: 72,
        height: 72,
        borderRadius: "50%",
        border: "3px solid rgba(255,255,255,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 2,
      }}
    >
      <NotificationsActiveIcon sx={{ fontSize: 40 }} />
    </Box>
    <Typography
      variant="subtitle2"
      sx={{ textTransform: "uppercase", letterSpacing: 2 }}
    >
      Zeecurity App
    </Typography>
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, mt: 0.5, textAlign: "center" }}
    >
      Society Security Hub
    </Typography>
    <Typography
      variant="caption"
      sx={{ mt: 1.5, textAlign: "center", opacity: 0.9 }}
    >
      Designed for guards, admins & residents working together.
    </Typography>
  </Box>

  {/* Right content */}
  <CardContent
    sx={{
      flex: 1,
      px: { xs: 2.5, md: 4 },
      py: { xs: 2.5, md: 3.5 },
    }}
  >
    <Typography
      variant="h6"
      sx={{ mb: 1, fontWeight: 700, letterSpacing: 0.2 }}
    >
      Welcome to Zeecurity
    </Typography>

    <Typography variant="body2" sx={{ color: "#4b5563", mb: 2 }}>
      Use the sidebar to manage visitors, complaints, notices, payments and SOS
      alerts. This dashboard gives a live snapshot of what is happening in your
      society in real time.
    </Typography>

    {/* Tags row */}
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        mb: 2,
      }}
    >
      <Chip label="Gate Monitoring" size="small" variant="outlined" />
      <Chip label="Resident Alerts" size="small" variant="outlined" />
      <Chip label="Maintenance Tracking" size="small" variant="outlined" />
      <Chip label="Emergency SOS" size="small" variant="outlined" />
    </Box>

    {/* Small meta row */}
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mt: 0.5,
        fontSize: 12,
        color: "#6b7280",
      }}
    >
      <Box>👮 Guard Panel</Box>
      <Box>🏢 Society Admin</Box>
      <Box>🏠 Resident View</Box>
    </Box>
  </CardContent>
</Card>


      {/* Five recent cards in one row */}
      <Box
        sx={{
          mt: 1,
          display: "flex",
          gap: 2.5,
          flexWrap: { xs: "wrap", lg: "nowrap" },
        }}
      >
        {/* Recent Notices */}
        <Card
          sx={{
            ...panelCardBase,
            flex: "1 1 260px",
            maxHeight: 350,
            borderTop: "4px solid #2563eb",
          }}
        >
          <CardContent sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Recent Notices
              </Typography>
              <Button
                component={RouterLink}
                to="/notices"
                size="small"
                variant="outlined"
              >
                VIEW ALL
              </Button>
            </Box>

            {loadingNotices ? (
              <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                <CircularProgress size={24} />
              </Box>
            ) : recentNotices.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No notices yet.
              </Typography>
            ) : (
              <Box sx={{ overflowY: "auto" }}>
                <List dense>
                  {recentNotices.map((n, index) => (
                    <React.Fragment key={n._id || index}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemText
                          primary={
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: 700 }}
                            >
                              {n.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography
                                variant="body2"
                                sx={{ display: "block" }}
                                color="text.secondary"
                              >
                                {n.message?.length > 70
                                  ? n.message.slice(0, 70) + "..."
                                  : n.message}
                              </Typography>
                              {n.createdAt && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    display: "block",
                                    mt: 0.5,
                                    color: "#9ca3af",
                                  }}
                                >
                                  {new Date(n.createdAt).toLocaleString()}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {index !== recentNotices.length - 1 && (
                        <Divider component="li" sx={{ my: 0.5 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Recent Visitors */}
        <Card
          sx={{
            ...panelCardBase,
            flex: "1 1 220px",
            maxHeight: 350,
            borderTop: "4px solid #38bdf8",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              Recent Visitors
            </Typography>
            {recentVisitors.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No visitors.
              </Typography>
            ) : (
              <List dense>
                {recentVisitors.map((v, i) => {
                  const when =
                    v.inTime || v.date || v.createdAt || v.time || null;
                  return (
                    <ListItem key={v._id || i} sx={{ px: 0, py: 0.6 }}>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 600 }}
                          >
                            {v.name || "Visitor"} •{" "}
                            {v.flatNumber || v.flat || "-"}
                          </Typography>
                        }
                        secondary={
                          when
                            ? new Date(when).toLocaleTimeString()
                            : ""
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card
          sx={{
            ...panelCardBase,
            flex: "1 1 220px",
            maxHeight: 350,
            borderTop: "4px solid #fb923c",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              Recent Complaints
            </Typography>
            {recentComplaints.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No complaints.
              </Typography>
            ) : (
              <List dense>
                {recentComplaints.map((c, i) => (
                  <ListItem key={c._id || i} sx={{ px: 0, py: 0.6 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {c.name || "Resident"} •{" "}
                          {c.flatNumber || c.flat || "-"}
                        </Typography>
                      }
                      secondary={
                        <Chip
                          label={c.status || "Pending"}
                          size="small"
                          sx={{
                            mt: 0.5,
                            bgcolor:
                              (c.status || "").toLowerCase() === "resolved"
                                ? "rgba(22,163,74,0.08)"
                                : "rgba(234,179,8,0.10)",
                            color:
                              (c.status || "").toLowerCase() === "resolved"
                                ? "#166534"
                                : "#92400e",
                          }}
                        />
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Recent SOS */}
        <Card
          sx={{
            ...panelCardBase,
            flex: "1 1 220px",
            maxHeight: 350,
            borderTop: "4px solid #f97373",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              Recent SOS
            </Typography>
            {recentSos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No SOS alerts.
              </Typography>
            ) : (
              <List dense>
                {recentSos.map((a, i) => (
                  <ListItem key={a._id || i} sx={{ px: 0, py: 0.6 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {a.name || "Resident"} • {a.flatNumber || "-"}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: "#6b7280" }}
                        >
                          {a.type || "Alert"} • {a.status || "Pending"}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card
          sx={{
            ...panelCardBase,
            flex: "1 1 220px",
            maxHeight: 350,
            borderTop: "4px solid #22c55e",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
              Recent Payments
            </Typography>
            {recentPayments.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No payments.
              </Typography>
            ) : (
              <List dense>
                {recentPayments.map((p, i) => (
                  <ListItem key={i} sx={{ px: 0, py: 0.6 }}>
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {p.name || "-"} • {p.flatNumber || "-"}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: "#6b7280" }}
                        >
                          ₹{Number(p.amount || 0).toLocaleString()}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
