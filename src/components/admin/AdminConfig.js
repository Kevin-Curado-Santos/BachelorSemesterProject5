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
  { value: "text", label: "Text input" },
];

const AdminConfig = () => {
  const navigate = useNavigate();

  const stored =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("appConfigOverride") || "{}")
      : {};

  const [mode, setMode] = useState(stored.mode || "image");
  const [itemsPerRound, setItemsPerRound] = useState(
    stored.itemsPerRound || 5
  );
  const [feedbackMode, setFeedbackMode] = useState(
    stored.feedbackMode || "mic"
  );

  const [landscapeRounds, setLandscapeRounds] = useState(
    (stored.rounds && stored.rounds.landscapes) || 4
  );
  const [celebRounds, setCelebRounds] = useState(
    (stored.rounds && stored.rounds.celeb) || 4
  );

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    const newCfg = {
      mode,
      itemsPerRound: Number(itemsPerRound),
      feedbackMode,
      rounds: {
        landscapes: Math.max(1, Number(landscapeRounds) || 1),
        celeb: Math.max(1, Number(celebRounds) || 1),
      },
    };
    localStorage.setItem("appConfigOverride", JSON.stringify(newCfg));
    setSaved(true);
    window.location.reload();
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
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
          label="Feedback mode"
          value={feedbackMode}
          onChange={(e) => setFeedbackMode(e.target.value)}
        >
          {feedbackModes.map((m) => (
            <MenuItem key={m.value} value={m.value}>
              {m.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Landscape rounds"
          type="number"
          value={landscapeRounds}
          onChange={(e) => setLandscapeRounds(e.target.value)}
        />
        <TextField
          label="Celeb rounds"
          type="number"
          value={celebRounds}
          onChange={(e) => setCelebRounds(e.target.value)}
        />

        <Button variant="contained" onClick={handleSave}>
          Save & Reload
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate("/recording-pre-survey")}
        >
          Go to Study
        </Button>

        {saved && (
          <Typography color="green">
            Saved. The page is reloading with new config.
          </Typography>
        )}
      </Stack>
    </Container>
  );
};

export default AdminConfig;
