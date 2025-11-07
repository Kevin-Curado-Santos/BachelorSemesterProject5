import { Button, Typography, Stack } from '@mui/material';
import { useReactMediaRecorder } from 'react-media-recorder';
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from 'react-router-dom';

export const RecordView = (props) => {
  const navigate = useNavigate();

  const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
    useReactMediaRecorder({
      video: false,
      audio: true,
      onStop: (blobUrl) => {
        handleSave(blobUrl);
      },
    });

  const handleSave = async (blobUrl) => {
    const audioBlob = await fetch(blobUrl).then((r) => r.blob());

    const anonID = localStorage.getItem('anonId') || (props.state && props.state.uid) || 'unknown_uid';
    const ts = Date.now();
    const tag = props.isMicCheck ? 'miccheck' : 'response';
    const audioFile = new File([audioBlob], `${ts}_${tag}.webm`, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('anonId', anonID);
    formData.append('tag', tag)

    fetch(`/api/saveAudio`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .catch((error) => console.log(error));
  };


  return (
    <>
      {props.isMicCheck && (
        props.mediaData.type === 'video' ? (
          <>
            {/* Display image or video for mic check */}
            <video src={props.mediaData.src} controls style={{ width: '500px', borderRadius: '8px', marginTop: '10px' }} />
          </>
        ) : (
          <>
            {/* Display image or video for mic check */}
            <img src={props.mediaData.src} alt={'Example Image'} style={{ width: '500px', borderRadius: '8px', marginTop: '10px' }} />
          </>
        )
      )}
      <Typography variant="h4" gutterBottom>
        Recording Audio
      </Typography>
      <Stack>
        {status === 'idle' && (
          <>
            <Typography variant="body1" gutterBottom>
              When you are ready, click the button to start recording.
            </Typography>
            <Button onClick={startRecording}>Start Recording</Button>
          </>
        )}

        {status === 'recording' && (
          <>
            <LinearProgress />
            <Typography variant="body1" gutterBottom>
              You are currently recording. Click the button to stop recording.
            </Typography>
            <Button
              onClick={(e) => {
                stopRecording(e);
              }}
            >
              Stop Recording
              </Button>
            </>
        )}

        {status === 'stopped' && (
          <>
            <Typography variant="body1" gutterBottom>
              You have finished recording. You may listen to your recording if you wish. Click the
              button to continue.
            </Typography>
            <audio src={mediaBlobUrl} controls />
            {props.isMicCheck ? (
              <>
                <Button
                  onClick={() => {
                    navigate(props.nextLink);
                  }}
                >
                  I can hear my voice
                </Button>
                <Button
                  onClick={() => {
                    navigate(`/mic-check`);
                  }}
                >
                  I cannot hear my recording
                </Button>
              </>
            ) : (
              <Button
                onClick={() => {
                  if (props.last) {
                    navigate(`/thanks`);
                  } else {
                    navigate(props.nextLink);
                  }
                  clearBlobUrl();
                }}
              >
                Next
              </Button>
            )}
          </>
        )}
      </Stack>
    </>
  );
};
