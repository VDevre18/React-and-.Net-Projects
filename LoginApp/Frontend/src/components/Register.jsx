import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5226/api/Auth/register",
        {
          username,
          email,
          password,
        }
      );
      setMessage(response.data);
    } catch (err) {
      setMessage("Failed to register");
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth type="submit">
          Register
        </Button>
        {message && (
          <Typography variant="body2" color="primary" className="link">
            {message}
          </Typography>
        )}
      </form>
    </div>
  );
};

export default Register;
