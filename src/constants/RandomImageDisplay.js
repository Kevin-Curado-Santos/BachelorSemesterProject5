import React from "react";
import { Grid } from "@mui/material";

const RandomImageDisplay = ({ images = [], numImages, onSelect, selectedMedia }) => {
  const items = images.slice(0, numImages || images.length);

  return (
    <Grid container spacing={2} justifyContent="center">
      {items.length > 0 ? (
        items.map((media, index) => (
          <Grid item key={media.src || index}>
            <img
              src={media.src}
              alt={`option-${index + 1}`}
              style={{
                width: 250,
                height: 250,
                objectFit: "cover",
                borderRadius: 12,
                cursor: "pointer",
                boxShadow:
                  selectedMedia && selectedMedia.src === media.src
                    ? "0 0 10px 4px #007bff"
                    : "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
              onClick={() => onSelect && onSelect(media)}
            />
          </Grid>
        ))
      ) : (
        <p>No images found</p>
      )}
    </Grid>
  );
};

export default RandomImageDisplay;
