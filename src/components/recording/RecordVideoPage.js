import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import { RecordView } from "./StudyRound";
import { appConfig } from "../../constants/config";

const RecordVideoPage = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const media = location.state?.media;
  const type = location.state?.type || appConfig.mode;

  if (!media) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography>No video selected. Returning…</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: 40 }}>
      <Typography variant="h5" gutterBottom>
        Tell us why you chose this video
      </Typography>

      <video
        key={media.src}
        controls
        style={{ width: "100%", borderRadius: 10, marginBottom: 20 }}
      >
        <source src={media.src} type="video/webm" />
      </video>

      <RecordView
        idx={0}
        theme={{ name: "user_selection" }}
        screenIdx={0}
        mediaData={media}
        contentType={type}
        last={true}
        feedbackMode={appConfig.feedbackMode}
        state={props.state}
        nextLink="/thanks"
      />
    </Container>
  );
};

export default RecordVideoPage;
