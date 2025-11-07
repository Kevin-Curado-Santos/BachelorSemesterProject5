import React from "react";
import { RecordView } from "./StudyRound";
import { Typography, Container } from "@mui/material";
import micCheckImg from "../../data/mic-check.jpg";
import micCheckVideo from "../../data/mic-check.webm";
import {appConfig} from "../../constants/config";
import {modeRoutes} from "../../constants/flow";

export const MicCheck = (props) => {
  const mediaData = {
    src: appConfig.mode === "video" ? micCheckVideo : micCheckImg,
    type: appConfig.mode === "video" ? "video" : "image",
    label: "miccheck",
  };

  const nextLink = modeRoutes[appConfig.mode] || modeRoutes.image;

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Mic Check
      </Typography>
      <Typography variant="body1" gutterBottom>
        Let's make sure your microphone works. Please describe the image briefly
        — your browser may ask for mic access; choose "Allow".
      </Typography>

      <RecordView
        idx={0}
        theme={{ name: "miccheck" }}
        screenIdx={0}
        mediaData={mediaData}
        contentType={mediaData.type}
        last={false}
        isMicCheck={true}
        lastScreen={false}
        state={props.state}
        nextLink={nextLink}
      />
    </Container>
  );
};
