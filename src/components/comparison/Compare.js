import { useEffect, useState } from 'react';
import { Button, Box, Typography, RadioGroup, FormControlLabel, Radio, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const CompareAudio = (props) => {
  const [src, setSrc] = useState([]);
  const [fnameList, setFnameList] = useState([]);
  const [preferredOption, setPreferredOption] = useState(null);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/api/saveComparisons?uid=${props.state.uid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([fnameList, preferredOption]),
    })
      .then((response) => {
        response.json();

        // reset the state after saving to db
        setFnameList([]);
        setPreferredOption(null);
        if (props.state.compare_idx >= props.state.max_compare_idx) {
          navigate('/thanks');
        }
      })
      .catch((error) => console.log(error));

    [0, 1].map((i) => {
      fetch(`/api/getCandidates?compare_idx=${props.state.compare_idx}&pair_idx=${i}`, {
        method: 'GET',
        responseType: 'blob',
      }).then((response) => {
        if (!response.ok) {
          navigate('/thanks');
        }
        const filename = response.headers.get('Content-Disposition').split('filename=')[1];

        response.blob().then((blob) => {
          setSrc((src) => [...src, URL.createObjectURL(blob)]);
          setFnameList((fnameList) => [...fnameList, filename]);
        });
      });
    });
  }, [props.state.compare_idx]);

  // disable the button for 10 seconds to make sure participants listen to both recordings
  useEffect(() => {
    setTimeout(() => {
      setButtonEnabled(true);
    }, 0e3);
  }, []);

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          Compare Recordings
        </Typography>
        <Typography variant="body1" gutterBottom>
          Listen to both recordings in full, and select the speaker that sounds more fluent. Please
          only consider how fluent each speaker sounds, not the audio quality of the recording.
        </Typography>
        <Typography variant="body1" gutterBottom>
          Progress: comparison {props.state.compare_idx + 1}/{props.state.max_compare_idx}
        </Typography>

        <RadioGroup direction="column">
          {[0, 1].map((i) => (
            <Stack direction="row" spacing={2} marginBottom={'5px'}>
              <audio id={`audio${i}`} controls src={src[i]} />
              <FormControlLabel
                value={fnameList[i]}
                control={<Radio />}
                onClick={() => setPreferredOption(fnameList[i])}
                label={`This speaker sounds more fluent`}
              />
            </Stack>
          ))}
          <FormControlLabel
            value={'cannot_decide'}
            control={<Radio />}
            onClick={() => setPreferredOption('cannot_decide')}
            label={`I cannot decide`}
          />
        </RadioGroup>
        <Button
          variant="contained"
          disabled={!buttonEnabled || preferredOption === null}
          onClick={() => {
            props.dispatch({
              type: 'update',
              controlName: 'compare_idx',
              newVal: props.state.compare_idx + 1,
            });
            navigate('/compare-audio');
            console.log('compare_idx', props.state.compare_idx);
          }}
        >
          Next
        </Button>
        <Typography variant="body1" fontSize={12} gutterBottom>
          We record all interactions with the website and may use them to validate participation.
        </Typography>
      </Box>
    </>
  );
};
