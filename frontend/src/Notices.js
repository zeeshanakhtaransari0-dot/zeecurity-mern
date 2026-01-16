// frontend/src/Notices.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

export default function Notices() {
  const location = useLocation();
  const isResident = location.pathname.startsWith("/resident");

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [snack, setSnack] = useState({
    open: false,
    severity: "info",
    text: "",
  });
  const [delId, setDelId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/notices`);
      const data = res.data;

      let list = [];
      if (Array.isArray(data)) list = data;
      else if (data?.notices) list = data.notices;
      else if (data?.data) list = data.data;

      setNotices(list);
    } catch (err) {
      setSnack({
        open: true,
        severity: "error",
        text: "Failed to fetch notices",
      });
      setNotices([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!title || !message) {
      setSnack({
        open: true,
        severity: "warning",
        text: "Title and message required",
      });
      return;
    }

    try {
      await axios.post(`${API_BASE}/notices`, { title, message });
      setSnack({
        open: true,
        severity: "success",
        text: "Notice added",
      });
      setTitle("");
      setMessage("");
      fetchNotices();
    } catch {
      setSnack({
        open: true,
        severity: "error",
        text: "Failed to add notice",
      });
    }
  }

  function confirmDelete(id) {
    setDelId(id);
    setConfirmOpen(true);
  }

  async function doDelete() {
    try {
      await axios.delete(`${API_BASE}/notices/${delId}`);
      setSnack({
        open: true,
        severity: "success",
        text: "Notice deleted",
      });
      fetchNotices();
    } catch {
      setSnack({
        open: true,
        severity: "error",
        text: "Delete failed",
      });
    } finally {
      setConfirmOpen(false);
      setDelId(null);
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Notices
      </Typography>

      {/* ADD NOTICE – GUARD ONLY */}
      {!isResident && (
        <Card sx={{ mb: 3 }}>
          <CardContent component="form" onSubmit={handleAdd}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Notice Title"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Notice Message"
                  fullWidth
                  multiline
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Button type="submit" variant="contained">
                  Add Notice
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* NOTICE LIST */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : notices.length === 0 ? (
            <Typography>No notices found.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Title</b></TableCell>
                  <TableCell><b>Message</b></TableCell>
                  <TableCell><b>Date</b></TableCell>
                  {!isResident && (
                    <TableCell align="right"><b>Actions</b></TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.map((n) => (
                  <TableRow key={n._id}>
                    <TableCell>{n.title}</TableCell>
                    <TableCell>{n.message}</TableCell>
                    <TableCell>
                      {n.createdAt
                        ? new Date(n.createdAt).toLocaleString()
                        : ""}
                    </TableCell>
                    {!isResident && (
                      <TableCell align="right">
                        <Button
                          color="error"
                          size="small"
                          variant="contained"
                          onClick={() => confirmDelete(n._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* CONFIRM DELETE */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete this notice?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={doDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.text}</Alert>
      </Snackbar>
    </Box>
  );
}