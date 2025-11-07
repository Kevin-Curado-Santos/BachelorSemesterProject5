import { Typography } from '@mui/material';

export const End = (props) => {
  return (
    props.success ? (
      <>
        <Typography variant="h4" gutterBottom>
          Completed
        </Typography>
        <Typography variant="body1" gutterBottom>
          Thank you for your participation in this study. You may close this window now.
        </Typography>
      </>
    ) : (
      <>
        <Typography variant="h4" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1" gutterBottom>
          There was an error with your submission. Please try again or contact the study administrator.
        </Typography>
      </>
    )
  );
};
