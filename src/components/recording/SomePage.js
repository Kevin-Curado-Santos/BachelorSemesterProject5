import React, { useState } from 'react';
import { Button, Typography, Container, Paper, Grid } from '@mui/material';
import RandomImageDisplay from '../../constants/RandomImageDisplay';
import { RecordView } from './StudyRound'; // Import the updated StudyRound component

export const SomePage = ({ state = { uid: 'default_user' } }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '30px' }}>
      <Typography variant="h3" gutterBottom>
        Select an Image or Video & Record Your Thoughts
      </Typography>
      <Typography variant="subtitle1" color="textSecondary">
        Choose either an image or a video and then record your thoughts.
      </Typography>

      {/* Images Section */}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
        <Typography variant="h5">Select an Image</Typography>
        <RandomImageDisplay numImages={6} onSelect={setSelectedImage} selectedMedia={selectedImage} mediaType="image" />
      </Paper>

      {/* Videos Section */}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', backgroundColor: '#f9f9f9' }}>
        <Typography variant="h5">Select a Video</Typography>
        <RandomImageDisplay numImages={3} onSelect={setSelectedVideo} selectedMedia={selectedVideo} mediaType="video" />
      </Paper>

      {/* Display Selected Media */}
      {(selectedImage || selectedVideo) && (
        <div style={{ marginTop: '20px' }}>
          <Typography variant="h6">You selected:</Typography>
          {selectedImage && (
            <img src={selectedImage.src} alt="Selected Image" style={{ width: '200px', borderRadius: '8px', marginTop: '10px' }} />
          )}
          {selectedVideo && (
            <video controls style={{ width: '200px', borderRadius: '8px', marginTop: '10px' }}>
              <source src={selectedVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      )}

      {/* Recording Section */}
      {(selectedImage || selectedVideo) && (
        <RecordView
          idx={0}
          theme={{ name: "user_selection" }}
          screenIdx={0}
          mediaData={selectedImage || selectedVideo} // Prioritize image if both selected
          contentType={selectedImage ? "image" : "video"}
          last={false}
          lastScreen={true}
          state={state}
        />
      )}
    </Container>
  );
};

export default SomePage;
