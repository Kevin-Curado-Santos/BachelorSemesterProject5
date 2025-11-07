import React, { useState, useEffect } from "react";
import { Typography, Container } from "@mui/material";
import RandomImageDisplay from "../../constants/RandomImageDisplay";
import { RecordView } from "./StudyRound";
import { appConfig } from "../../constants/config";

export const SelectImagePage = (props) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/images")
      .then((r) => r.json())
      .then((data) => {
        const total = appConfig.itemsPerRound;
        const half = Math.floor(total / 2);

        const ai = Array.isArray(data.ai) ? data.ai : [];
        const human = Array.isArray(data.human) ? data.human : [];

        const shuffledHuman = human.slice().sort(() => Math.random() - 0.5);
        const shuffledAi = ai.slice().sort(() => Math.random() - 0.5);

        const pickedHuman = shuffledHuman.slice(0, half);
        const pickedAi = shuffledAi.slice(0, total - pickedHuman.length);

        const merged = [
          ...pickedHuman.map((src) => ({
            src,
            type: "image",
            label: "human",
          })),
          ...pickedAi.map((src) => ({
            src,
            type: "image",
            label: "ai",
          })),
        ].sort(() => Math.random() - 0.5);

        // log that these were shown
        const anonId = localStorage.getItem("anonId") || "unknown";
        fetch("/api/logMedia", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            anonId,
            studyType: "image",
            shownMedia: merged.map(({ src, label }) => ({ src, label })),
          }),
        }).catch(console.error);

        setImages(merged);
      })
      .catch(console.error);
  }, []);

  const handleSelect = (img) => {
    setSelectedImage(img);
    const anonId = localStorage.getItem("anonId") || "unknown";
    fetch("/api/logMedia", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        anonId,
        studyType: "image",
        selectedMedia: { src: img.src, label: img.label },
      }),
    }).catch(console.error);
  };

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: 30 }}>
      <Typography variant="h3" gutterBottom>
        Select an Image & Record Your Thoughts
      </Typography>

      {!selectedImage ? (
        <>
          <Typography variant="subtitle1" color="textSecondary">
            Click on an image you like the most, then explain why.
          </Typography>

          {appConfig.mode === "image" && images.length > 0 && (
            <RandomImageDisplay
              images={images}
              numImages={images.length}
              onSelect={handleSelect}
              selectedMedia={selectedImage}
            />
          )}
        </>
      ) : (
        <>
          <Typography variant="h6">You selected:</Typography>
          <img
            src={selectedImage.src}
            alt="Selected"
            style={{ width: 500, borderRadius: 8, marginTop: 10 }}
          />
          <RecordView
            idx={0}
            theme={{ name: "user_selection" }}
            screenIdx={0}
            contentType="image"
            last={true}
            state={props.state}
            feedbackMode={appConfig.feedbackMode}
            mediaData={selectedImage} 
          />
        </>
      )}
    </Container>
  );
};

export default SelectImagePage;
