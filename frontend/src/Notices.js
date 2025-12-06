// frontend/src/Notices.js
import React, { useEffect, useState } from "react";
import axios from "axios";
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
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  "https://zeecurity-backend.onrender.com/api";

export default function Notices() {
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

      if (Array.isArray(data)) setNotices(data);
      else if (Array.isArray(data.notices)) setNotices(data.notices);
      else setNotices([]);
    } catch (err) {
      console.error("Failed to fetch notices:", err);
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
      // ✅ use API_BASE here
      await axios.post(`${API_BASE}/notices`, { title, message });
      setSnack({
        open: true,
        severity: "success",
        text: "Notice added",
      });
      setTitle("");
      setMessage("");
      fetchNotices();
    } catch (err) {
      console.error("Add notice error:", err);
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
    if (!delId) {
      setConfirmOpen(false);
      return;
    }
    try {
      // ✅ and here
      await axios.delete(`${API_BASE}/notices/${delId}`);
      setSnack({
        open: true,
        severity: "success",
        text: "Notice deleted",
      });
      fetchNotices();
    } catch (err) {
      console.error("delete notice error:", err);
      setSnack({
        open: true,
        severity: "error",
        text: "Failed to delete notice",
      });
    } finally {
      setConfirmOpen(false);
      setDelId(null);
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* --- Add Notice form --- */}
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
        Notices
      </Typography>

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
              <Button type="submit" variant="contained" color="primary">
                Add Notice
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* --- Table --- */}
      <Typography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
        Notice Board
      </Typography>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ py: 4, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : notices.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No notices found.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Message</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, textAlign: "right" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notices.map((n) => (
                  <TableRow key={n._id}>
                    <TableCell>
                      <Typography sx={{ fontWeight: 600 }}>
                        {n.title}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 400 }}>
                      <Typography variant="body2">{n.message}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {n.createdAt
                          ? new Date(n.createdAt).toLocaleString()
                          : ""}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => confirmDelete(n._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert severity={snack.severity}>{snack.text}</Alert>
      </Snackbar>

      {/* Delete confirm dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete this notice?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={doDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
