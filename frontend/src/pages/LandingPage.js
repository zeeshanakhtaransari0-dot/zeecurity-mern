import React, { useState } from "react";
import { Box, Typography, Button, IconButton, Menu, MenuItem, Grid,Dialog,DialogTitle,DialogContent,DialogActions } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import BackgroundParticles from "../components/BackgroundParticles";
import logo from "../assets/zeecurity_logo.png";
import cityBg from "../assets/city_background_hd.png";
import Fade from "@mui/material/Fade";
import VerifiedIcon from "@mui/icons-material/Verified";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";







export default function LandingPage() {
   

const navigate = useNavigate();

const [anchorEl, setAnchorEl] = useState(null);

const openMenu = (event) => {
setAnchorEl(event.currentTarget);
};

const closeMenu = () => {
setAnchorEl(null);
};
const [openDialog, setOpenDialog] = React.useState(false);
const [dialogType, setDialogType] = React.useState("");
const handleMenuClick = (type) => {
 setDialogType(type);
 setOpenDialog(true);
};
const handleClose = () => {
 setOpenDialog(false);
};

return (
<Box
 sx={{
  minHeight: "100vh",
  backgroundImage: `url(${cityBg})`,
  backgroundSize: "cover",
  backgroundPosition: "right bottom",
  backgroundRepeat: "no-repeat",
  position: "relative",
  overflow: "hidden",
  textAlign: "center",
  color: "#fff"
 }}
>
    <BackgroundParticles />
    

  {/* NAVBAR */}
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      mb: 8
    }}
  >
    <Typography fontSize={26} fontWeight={800}>
        ZeeCurity Live
        
    </Typography>
    <Box
  sx={{
    position: "absolute",
    left: 25,
    top: 60,
    display: "flex",
    flexDirection: "column",
    gap: 1,
    color: "white",
    opacity: 0.8
  }}
>

{/* Shield */}
<SecurityIcon  sx={{ fontSize: 20, mb: 1 }}  />
<VerifiedIcon sx={{ fontSize: 20, mb: 1 }} />
  <QrCodeScannerIcon sx={{ fontSize: 20 }} />
  <GroupsIcon sx={{ fontSize: 20 }} />
  <HomeIcon sx={{ fontSize: 20 }} />
  <NotificationsActiveIcon sx={{ fontSize: 20 }} />
  <ChatIcon sx={{ fontSize: 20 }} />


</Box>

    <IconButton onClick={openMenu} sx={{ color: "#fff" }}>
      <MenuIcon />
    </IconButton>

    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeMenu}
    >
     <MenuItem onClick={() => handleMenuClick("aboutApp")}>
 About the App
</MenuItem>

<MenuItem onClick={() => handleMenuClick("aboutUs")}>
 About Us
</MenuItem>

<MenuItem onClick={() => handleMenuClick("terms")}>
 Terms & Conditions
</MenuItem>
    </Menu>
  </Box>

  {/* HERO SECTION */}
 <img
 src={logo}
 alt="ZeeCurity"
 style={{
  width: "100px",
  marginBottom: "10px",
  borderRadius: "10px"
 }}
/>
  <Typography variant="h2" fontWeight={800} mb={2}>
    ZeeCurity Live
  </Typography>

  <Typography variant="h6" sx={{ maxWidth: 650, mx: "auto", mb: 4 }}>
Smart Security App for modern communities. Monitor guards, visitors, residents and emergencies
    in one powerful platform.
  </Typography>

  <Button
 variant="contained"
 sx={{
  mt: 3,
  px: 4,
  py: 1.5,
  fontWeight: 600,
  borderRadius: "30px",
  background: "#fbfaf8",
  color: "#000",
  transition: "all 0.3s ease",
  "&:hover": {
   background: "#ffffff",
   transform: "scale(1.05)"
  }
 }}
    onClick={() => navigate("/login")}
  >
    Get Started
  </Button>


  {/* FEATURES SECTION */}
<Box sx={{ mt: 12 }}
>
  <Typography variant="h4" fontWeight={700} mb={5}>
    Key Features
  </Typography>

  <Grid container spacing={4} justifyContent="center">

    <Grid item xs={12} md={3}>
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          opacity: 1,
          backdropFilter: "blur(10px)",
          
          background: "rgba(255,255,255,0.08)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            background: "rgba(255,255,255,0.15)"
          }
        }}
      >
        <SecurityIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography fontWeight={600}>Visitor Management</Typography>
        <Typography variant="body2">
          Pre-approved visitors and secure entry monitoring.
        </Typography>
      </Box>
    </Grid>


    <Grid item xs={12} md={3}>
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          opacity: 1, 
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.08)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            background: "rgba(255,255,255,0.15)"
          }
        }}
      >
        <GroupsIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography fontWeight={600}>Guard Tracking</Typography>
        <Typography variant="body2">
          Manage guard shifts and duties easily.
        </Typography>
      </Box>
    </Grid>


    <Grid item xs={12} md={3}>
      <Box
        sx={{
          p: 3,
          borderRadius: 4,
          opacity: 1,
          backdropFilter: "blur(10px)",
          background: "rgba(255,255,255,0.08)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            background: "rgba(255,255,255,0.15)"
          }
        }}
      >
        <NotificationsActiveIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography fontWeight={600}>SOS Alerts</Typography>
        <Typography variant="body2">
          Emergency alerts instantly reach security staff.
        </Typography>
      </Box>
    </Grid>

  </Grid>

  {/* PLATFORM CAPABILITIES */}

<Box sx={{ mt: 12, textAlign: "center", color: "white" }}>

<Typography variant="h4" fontWeight={700} mb={5}>
Platform Capabilities
</Typography>

<Grid container spacing={4} justifyContent="center">

{/* Resident */}
<Grid item xs={12} md={3}>
<Box sx={{
   p: 3,
  borderRadius: 4,
  background: "rgba(0, 0, 0, 0.55)",   // darker glass effect
  backdropFilter: "blur(12px)",
  color: "#fff",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-6px)",
    background: "rgba(0, 0, 0, 0.7)"
  }
}}>
<Typography fontWeight={700}>Resident Panel</Typography>
<Typography variant="body2">
Manage visitors, complaints and payments
</Typography>
</Box>
</Grid>

{/* Guard */}
<Grid item xs={12} md={3}>
<Box sx={{
   p: 3,
  borderRadius: 4,
  background: "rgba(0, 0, 0, 0.55)",   // darker glass effect
  backdropFilter: "blur(12px)",
  color: "#fff",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-6px)",
    background: "rgba(0, 0, 0, 0.7)"
  }
}}>
<Typography fontWeight={700}>Guard Panel</Typography>
<Typography variant="body2">
Verify visitors and manage entry logs
</Typography>
</Box>
</Grid>

{/* Admin */}
<Grid item xs={12} md={3}>
<Box sx={{
  p: 3,
  borderRadius: 4,
  background: "rgba(0, 0, 0, 0.55)",   // darker glass effect
  backdropFilter: "blur(12px)",
  color: "#fff",
  transition: "0.3s",
  "&:hover": {
    transform: "translateY(-6px)",
    background: "rgba(0, 0, 0, 0.7)"
  }
}}>
<Typography fontWeight={700}>Admin Control</Typography>
<Typography variant="body2">
Monitor entire society system in real-time
</Typography>
</Box>
</Grid>

</Grid>

</Box>


  {/* HOW IT WORKS */}

<Box sx={{ mt: 10, textAlign: "center", color: "white" }}
>

<Typography variant="h3" fontWeight={400} mb={5}>
How It Works
</Typography>

<Grid container spacing={6} justifyContent="center">

<Grid item xs={12} md={3}>
<Typography variant="h4">1</Typography>
<Typography variant="body1">
Guard registers visitor entry
</Typography>
</Grid>

<Grid item xs={12} md={3}>
<Typography variant="h4">2</Typography>
<Typography variant="body1">
Resident approves visitor
</Typography>
</Grid>

<Grid item xs={12} md={3}>
<Typography variant="h4">3</Typography>
<Typography variant="body1">
Admin monitors activity
</Typography>
</Grid>

</Grid>

</Box>
{/* SOCIAL PROOF */}

<Box sx={{ mt: 12, textAlign: "center", color: "white" }}
>

<Typography variant="h3" fontWeight={400} mb={5}>
Trusted by Communities
</Typography>

<Grid container spacing={8} justifyContent="center">

<Grid item>
<Typography variant="h5"
sx={{ textShadow: "0 0 10px rgba(0,255,255,0.7)" }}>50+</Typography>
<Typography>Residents Connected</Typography>
</Grid>

<Grid item>
<Typography variant="h5"
sx={{ textShadow: "0 0 10px rgba(0,255,255,0.7)" }}>200+</Typography>
<Typography>Visitors Managed</Typography>
</Grid>

<Grid item>
<Typography variant="h5"
sx={{ textShadow: "0 0 10px rgba(0,255,255,0.7)" }}>24/7</Typography>
<Typography>Security Monitoring</Typography>
</Grid>

</Grid>

</Box>
</Box>


  {/* TRUST SECTION */}
  <Box sx={{ mt: 12 }}>
    <Typography variant="h4" fontWeight={400} mb={2}>
      Secure Community Platform
    </Typography>

    <Typography>
      ✓ Real-time monitoring
    </Typography>

    <Typography>
      ✓ Smart access control
    </Typography>

    <Typography>
      ✓ Reliable security management
    </Typography>
    <h5><i>By continuing, you agree to our Terms & Privacy Policy</i></h5>
  </Box>


  {/* FOOTER */}
  <Box sx={{ mt: 14, opacity: 0.7 }}>
    <Typography variant="body2">
          
       ZeeCurity Live © 2026 — Smart Community Security Platform
       
    </Typography>
  </Box>


 <Dialog
 open={openDialog}
 onClose={handleClose}
 TransitionComponent={Fade}
 transitionDuration={400}
 maxWidth="sm"
 fullWidth
>

 <DialogTitle>
  {dialogType === "aboutApp" && "About ZeeCurity"}
  {dialogType === "aboutUs" && "About Us"}
  {dialogType === "terms" && "Terms & Conditions"}
 </DialogTitle>

 <DialogContent>

  {dialogType === "aboutApp" && (
   <>
   ZeeCurity Live is a smart security platform designed for
   residential communities. It allows guards, residents,
   and administrators to manage visitors, emergencies,
   and security monitoring in one centralized system.
   </>
  )}

  {dialogType === "aboutUs" && (
   <>
   ZeeCurity Live was developed as a modern security
   solution for smart residential societies. The goal
   is to improve safety, visitor tracking, and emergency
   response using a simple digital platform.
   </>
  )}

  {dialogType === "terms" && (
   <>
   This application is intended for security management
   within residential communities. Users must ensure
   accurate data entry for visitors and residents.
   The system should be used responsibly by guards
   and administrators for monitoring purposes.
   </>
  )}

 </DialogContent>

 <DialogActions>
  <Button onClick={handleClose}>Close</Button>
 </DialogActions>

</Dialog>
 

</Box>


);
}