import React, { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import loadMedia from "./loadMedia";

const RandomImageDisplay = ({
  images,                
  numImages = 6,
  onSelect,
  selectedMedia,
}) => {
  const [available, setAvailable] = useState([]);
  const [randomMedia, setRandomMedia] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    let ignore = false;

    const init = async () => {
      if (Array.isArray(images) && images.length > 0) {
        if (!ignore) setAvailable(images);
      } else {
        const mediaItems = await loadMedia(); // async now
        const onlyImages = Array.isArray(mediaItems)
          ? mediaItems.filter((m) => m.type === "image")
          : [];
        if (!ignore) setAvailable(onlyImages);
      }
    };

    init();

    return () => {
      ignore = true;
    };
  }, [images]);

  useEffect(() => {
    if (available.length > 0) {
      const shuffled = [...available].sort(() => Math.random() - 0.5);
      setRandomMedia(shuffled.slice(0, numImages));
    }
  }, [available, numImages]);

  return (
    <Grid container spacing={2} justifyContent="center">
      {randomMedia.length > 0 ? (
        randomMedia.map((media, index) => (
          <Grid
            item
            key={media.key || media.src || index}
            style={{
              position: "relative",
              zIndex: hoveredIndex === index ? 10 : 1,
            }}
          >
            <img
              src={media.src}
              alt={`Random image ${index + 1}`}
              style={{
                width: "250px",
                height: "250px",
                objectFit: "cover",
                borderRadius: "12px",
                boxShadow:
                  selectedMedia?.src === media.src
                    ? "0 0 10px 4px #007bff"
                    : "0 4px 8px rgba(0, 0, 0, 0.2)",
                cursor: "pointer",
                transition: "transform 0.3s ease-in-out",
                transform: hoveredIndex === index ? "scale(1.3)" : "scale(1)",
              }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
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
