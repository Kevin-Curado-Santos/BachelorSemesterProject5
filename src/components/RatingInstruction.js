import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const RatingInstruction = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <Typography variant="h4" gutterBottom>
        Rating View
      </Typography>
      <Typography variant="body1" gutterBottom>
        You are at the end of the recording study. In the second half of the study, you will be
        asked to rate the passages other users have read.
      </Typography>
      <Button
        onClick={() => {
          navigate(props.nextLink);
        }}
      >
        Continue to rating
      </Button>
    </>
  );
};
