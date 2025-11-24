import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const modes = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
  { value: "text", label: "Text (future)" },
];

const feedbackModes = [
  { value: "mic", label: "Microphone" },
  { value: "text", label: "Keyboard" },
];

const AdminConfig = () => {
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(
    typeof window !== "undefined" &&
      sessionStorage.getItem("adminAuth") === "true"
  );
  const [password, setPassword] = useState("");
  const stored =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("appConfigOverride") || "{}")
      : {};

  const [mode, setMode] = useState(stored.mode || "image");
  const [itemsPerRound, setItemsPerRound] = useState(
    stored.itemsPerRound || 6
  );
  const [feedbackMode, setFeedbackMode] = useState(
    stored.feedbackMode.label || "mic"
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const newCfg = {
      mode,
      itemsPerRound: Number(itemsPerRound),
      feedbackMode,
    };
    localStorage.setItem("appConfigOverride", JSON.stringify(newCfg));
    setSaved(true);
    window.location.reload();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      sessionStorage.setItem("adminAuth", "true");
      setAuthorized(true);
    } else {
      navigate("/");
    }
  };

  if (!authorized) {
    return (
      <Container maxWidth="xs" style={{ marginTop: 80, textAlign: "center" }}>
        <Typography variant="h5" gutterBottom>
          Admin Login
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Enter
          </Button>
        </form>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>
        Admin Config
      </Typography>
      <Stack spacing={3}>
        <TextField
          select
          label="Mode"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          {modes.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Items per round"
          type="number"
          value={itemsPerRound}
          onChange={(e) => setItemsPerRound(e.target.value)}
        />

        <TextField
          select
          label="Feedback"
          value={feedbackMode}
          onChange={(e) => setFeedbackMode(e.target.value)}
        >
          {feedbackModes.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={handleSave}>
          Save
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/introduction")}
        >
          Go to Study
        </Button>

        {saved && (
          <Typography color="green">
            Saved. Page will reload with new config.
          </Typography>
        )}
      </Stack>
    </Container>
  );
};

export default AdminConfig;
