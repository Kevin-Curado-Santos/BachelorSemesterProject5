import React, { useState } from "react";
import { Button, Typography, Stack, TextField } from "@mui/material";
import { useReactMediaRecorder } from "react-media-recorder";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../constants/config";

export const RecordView = (props) => {
  const navigate = useNavigate();
  const feedbackMode = props.feedbackMode || appConfig.feedbackMode || "mic";

  // ---- MIC MODE ----
  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      video: false,
      audio: true,
      onStop: (blobUrl) => {
        handleSaveAudio(blobUrl);
      },
    });

  const handleSaveAudio = async (blobUrl) => {
    const audioBlob = await fetch(blobUrl).then((r) => r.blob());
    const anonId =
      localStorage.getItem("anonId") || (props.state && props.state.uid) || "unknown_uid";
    const tag = props.isMicCheck ? "miccheck" : "response";
    const audioFile = new File([audioBlob], `${anonId}_${tag}.webm`, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("anonId", anonId);
    formData.append("tag", tag);
    formData.append("mediaSrc", appConfig.supportedModes[props.mediaData.label]?.src || "");
    formData.append("mediaLabel", appConfig.supportedModes[props.mediaData.label]?.label || "");

    fetch(`/api/saveAudio`, { method: "POST", body: formData })
      .then((res) => res.json())
      .catch(console.error);
  };

  // ---- TEXT MODE ----
  const [textValue, setTextValue] = useState("");
  const handleSaveText = async () => {
    const anonId = localStorage.getItem("anonId") || props.state?.uid || "unknown";
    const tag = props.isMicCheck ? "miccheck" : "response";

    const blob = new Blob([textValue], { type: "text/plain;charset=utf-8" });
    const file = new File([blob], `${anonId}_${tag}.txt`, { type: "text/plain" });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("anonId", anonId);
    formData.append("tag", tag);
    formData.append("mediaSrc", appConfig.supportedModes[props.mediaData.label]?.src || "");
    formData.append("mediaLabel", appConfig.supportedModes[props.mediaData.label]?.label || "");

    await fetch("/api/saveText", { method: "POST", body: formData })
      .then((res) => res.json())
      .catch(console.error);
  };

  const goNext = () => {
    if (props.isMicCheck) return navigate(props.nextLink);
    if (props.last) navigate(`/thanks`);
    else navigate(props.nextLink);
    clearBlobUrl?.();
  };

  // optional stimulus preview on mic-check
  const Stimulus =
  props.isMicCheck && props.mediaData ? (
    props.mediaData.type === "video" ? (
      <video
        src={props.mediaData.src}
        controls
        style={{ width: 500, borderRadius: 8, marginTop: 10 }}
      />
    ) : (
      <img
        src={props.mediaData.src}
        alt="Example"
        style={{ width: 500, borderRadius: 8, marginTop: 10 }}
      />
    )
  ) : null;


  return (
    <>
      {Stimulus}
      <Typography variant="h4" gutterBottom>
        {feedbackMode === "mic" ? "Recording Audio" : "Share Your Thoughts"}
      </Typography>

      {/* MIC MODE */}
      {feedbackMode === "mic" && (
        <Stack>
          {status === "idle" && (
            <>
              <Typography gutterBottom>When you are ready, start recording.</Typography>
              <Button onClick={startRecording}>Start Recording</Button>
            </>
          )}
          {status === "recording" && (
            <>
              <LinearProgress />
              <Typography gutterBottom>You are currently recording. Click to stop.</Typography>
              <Button onClick={stopRecording}>Stop Recording</Button>
            </>
          )}
          {status === "stopped" && (
            <>
              <Typography gutterBottom>You may listen before continuing.</Typography>
              <audio src={mediaBlobUrl} controls />
              {props.isMicCheck ? (
                <>
                  <Button onClick={goNext}>I can hear my voice</Button>
                  <Button onClick={() => navigate(`/mic-check`)}>I cannot hear my recording</Button>
                </>
              ) : (
                <Button onClick={goNext}>Next</Button>
              )}
            </>
          )}
        </Stack>
      )}

      {/* TEXT MODE */}
      {feedbackMode === "text" && (
        <Stack spacing={2} sx={{ mt: 2, maxWidth: 700, mx: "auto" }}>
          <Typography variant="body1">
            Please type why you preferred the selected {props.contentType || "item"}.
          </Typography>
          <TextField
            multiline
            minRows={5}
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Write your thoughts here…"
            fullWidth
          />
          <Button
            variant="contained"
            onClick={async () => {
              await handleSaveText();
              goNext();
            }}
            disabled={!textValue.trim()}
          >
            Next
          </Button>
        </Stack>
      )}
    </>
  );
};
