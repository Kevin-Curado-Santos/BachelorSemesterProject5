import React from "react";
import { RecordView } from "./StudyRound";
import { Typography, Container } from "@mui/material";
import {appConfig} from "../../constants/config";
import {modeRoutes} from "../../constants/flow";

export const MicCheck = (props) => {
  const resolveMediaData = (mode) => {

    const resolved = appConfig.supportedModes[mode];
    if (resolved) return resolved;

    console.warn(`Unsupported mode: "${mode}", falling back to "image"`);
    return appConfig.supportedModes.image;
  };

  const mediaData = resolveMediaData(appConfig.mode);


  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "30px" }}>
      <Typography variant="h4" gutterBottom>
        Mic Check
      </Typography>
      <Typography variant="body1" gutterBottom>
        Let's make sure your {appConfig.feedbackMode === "mic" ? "microphone" : "keyboard"} works. Please describe the {mediaData.type} briefly
        — your browser may ask for mic access; choose "Allow".
      </Typography>

      <RecordView
        isMicCheck
        mediaData={appConfig.supportedModes[appConfig.mode]}
        nextLink="/study/landscapes/1"
        state={props.state}
        feedbackMode={appConfig.feedbackMode}
      />
    </Container>
  );
};
