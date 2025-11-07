import React, { useState, useEffect, useRef } from "react";
import { Typography, Container, Paper, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import loadMedia from "../../constants/loadMedia";
import { appConfig } from "../../constants/config";

export const FinalVideoSelection = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const videoRefs = useRef([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const media = await loadMedia("video"); // 👈 force video
      const onlyVideos = Array.isArray(media)
        ? media.filter((m) => m.type === "video")
        : [];
      setVideos(onlyVideos.slice(0, appConfig.itemsPerRound));
    };
    fetchVideos();
  }, []);

  return (
    <Container maxWidth="lg" style={{ textAlign: "center", marginTop: 50 }}>
      <Typography variant="h4" gutterBottom>
        Choose the Video You Like the Most
      </Typography>

      <Paper elevation={3} style={{ padding: 30, background: "#f9f9f9" }}>
        <Grid container spacing={3} justifyContent="center">
          {videos.length > 0 ? (
            videos.map((media, i) => (
              <Grid item key={i}>
                <Box
                  sx={{
                    width: 250,
                    height: 150,
                    borderRadius: 2,
                    overflow: "hidden",
                    cursor: "pointer",
                    position: "relative",
                    background: "#000",
                  }}
                  onClick={() => {
                    document.querySelectorAll("video").forEach((v) => v.pause());
                    navigate("/record-video", {
                      state: { media, type: "video" },
                    });
                  }}
                >
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    src={media.src}
                    muted
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onCanPlay={(e) => e.currentTarget.pause()}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      pointerEvents: "none",
                      color: "white",
                      fontWeight: "bold",
                      background: "rgba(0,0,0,0.15)",
                    }}
                  >
                    ▶
                  </Box>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography>No videos available.</Typography>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default FinalVideoSelection;
