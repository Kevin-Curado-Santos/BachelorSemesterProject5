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

  const nextLink = modeRoutes[appConfig.mode] || modeRoutes.image;

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
        idx={0}
        theme={{ name: "miccheck" }}
        screenIdx={0}
        mediaData={appConfig.supportedModes[appConfig.mode]}
        contentType={appConfig.supportedModes[appConfig.mode].type}
        last={false}
        isMicCheck={true}
        lastScreen={false}
        state={props.state}
        nextLink={nextLink}
      />
    </Container>
  );
};
