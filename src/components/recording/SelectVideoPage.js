import React, { useState, useEffect } from "react";
import { Typography, Container, Paper, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import loadMedia from "../../constants/loadMedia";
import { appConfig } from "../../constants/config";

export const SelectVideoPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchVideos = async () => {
      const media = await loadMedia("video");
      const onlyVideos = Array.isArray(media)
        ? media.filter((m) => m.type === "video")
        : [];
      setVideos(onlyVideos);
    };
    fetchVideos();
  }, []);

  const { itemsPerRound } = appConfig;
  const videosToShow = videos.slice(0, itemsPerRound);

  const handleNext = () => {
    if (currentIndex < videosToShow.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      navigate("/final-video-selection");
    }
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 6 }}>
      <Typography variant="h4" gutterBottom>
        Watch the Videos & Choose Your Favorite
      </Typography>

      <Paper elevation={3} sx={{ p: 3, backgroundColor: "#f9f9f9" }}>
        {videosToShow.length > 0 ? (
          <video
            key={videosToShow[currentIndex]?.src}
            controls
            style={{ width: "100%", borderRadius: 10 }}
          >
            {/* we don't know extension, so let browser sniff */}
            <source src={videosToShow[currentIndex]?.src} />
            Your browser does not support the video tag.
          </video>
        ) : (
          <Typography>No videos available.</Typography>
        )}
      </Paper>

      {videosToShow.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          sx={{ mt: 3 }}
        >
          {currentIndex < videosToShow.length - 1
            ? "Next Video"
            : "Go to Selection"}
        </Button>
      )}
    </Container>
  );
};

export default SelectVideoPage;
