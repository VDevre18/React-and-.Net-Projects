import React from "react";
import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
      <Typography variant="h4">Dashboard</Typography>
      <Typography variant="body1">Welcome to your dashboard!</Typography>
      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: "20px" }}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;
