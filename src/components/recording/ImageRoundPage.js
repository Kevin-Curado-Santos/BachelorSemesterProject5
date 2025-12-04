// src/components/recording/ImageRoundPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Typography, Container } from "@mui/material";
import RandomImageDisplay from "../../constants/RandomImageDisplay";
import { RecordView } from "./StudyRound";
import { appConfig } from "../../constants/config";

export const ImageRoundPage = (props) => {
  const { domain, round } = useParams();
  const roundNum = parseInt(round, 10) || 1;

  // get rounds for current domain from config (fallback 4)
  const totalRounds =
    (appConfig.rounds && appConfig.rounds[domain]) ||
    (domain === "landscapes" ? 4 : 4);

  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    setSelectedImage(null);
    setImages([]);

    const load = async () => {
      const res = await fetch(`/api/images?domain=${domain}`);
      const data = await res.json();
      let merged = [];

      if (domain === "landscapes") {
        const human = Array.isArray(data.human) ? data.human : [];
        const models = data.models || {};
        if (!human.length || !Object.keys(models).length) return;

        const humanPick =
          human[Math.floor(Math.random() * human.length)];

        const allAi = Object.entries(models).flatMap(
          ([modelName, urls]) => urls.map((src) => ({ src, modelName }))
        );
        const aiPicks = allAi.sort(() => Math.random() - 0.5).slice(0, 4);

        merged = [
          { src: humanPick, type: "image", label: "human" },
          ...aiPicks.map(({ src, modelName }) => ({
            src,
            type: "image",
            label: "ai",
            model: modelName,
          })),
        ].sort(() => Math.random() - 0.5);
      } else if (domain === "celeb") {
        const human = Array.isArray(data.human) ? data.human : [];
        const fake = Array.isArray(data.fake) ? data.fake : [];
        if (!human.length || !fake.length) return;

        const humanPick =
          human[Math.floor(Math.random() * human.length)];
        const fakePicks = fake.sort(() => Math.random() - 0.5).slice(0, 4);

        merged = [
          { src: humanPick, type: "image", label: "human" },
          ...fakePicks.map((src) => ({
            src,
            type: "image",
            label: "ai",
            model: "fake_face",
          })),
        ].sort(() => Math.random() - 0.5);
      }

      setImages(merged);
    };

    load().catch(console.error);
  }, [domain, roundNum]);

  const handleSelect = (img) => {
    setSelectedImage(img);

    const anonId = localStorage.getItem("anonId") || "unknown";

    const packet = {
      anonId,
      studyType: domain,
      round: roundNum,
      shown: images.map((i) => ({
        src: i.src,
        label: i.label,
        model: i.model || null,
      })),
      selected: {
        src: img.src,
        label: img.label,
        model: img.model || null,
      },
      // user now asked to pick HUMAN
      correctGuess: img.label === "human",
      timestamp: Date.now(),
    };

    fetch("/api/logRound", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(packet),
    }).catch(console.error);
  };

  // navigation based on per-domain totalRounds
  let nextLink = "/thanks";
  let last = false;

  if (domain === "landscapes") {
    if (roundNum < totalRounds) {
      nextLink = `/study/landscapes/${roundNum + 1}`;
    } else {
      // move to first celeb round
      nextLink = `/study/celeb/1`;
    }
  } else if (domain === "celeb") {
    if (roundNum < totalRounds) {
      nextLink = `/study/celeb/${roundNum + 1}`;
    } else {
      last = true;
    }
  }

  const title =
    domain === "landscapes"
      ? `Which Landscape Image Do You Think Is HUMAN?`
      : `Which Face Do You Think Is HUMAN?`;

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: 30 }}>
      <Typography variant="h4" gutterBottom>
        {title} (Round {roundNum} / {totalRounds})
      </Typography>

      {!selectedImage ? (
        <>
          <Typography variant="subtitle1" color="textSecondary">
            Click the image you believe is a REAL human photo, then explain why.
          </Typography>

          {images.length > 0 && (
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
            theme={{ name: `${domain}_human_guess_round_${roundNum}` }}
            screenIdx={0}
            contentType="image"
            last={last}
            state={props.state}
            feedbackMode={appConfig.feedbackMode}
            mediaData={selectedImage}
            nextLink={nextLink}
          />
        </>
      )}
    </Container>
  );
};

export default ImageRoundPage;
