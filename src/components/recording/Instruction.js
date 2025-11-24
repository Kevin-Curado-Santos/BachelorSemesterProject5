import { Button, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { appConfig } from "../../constants/config";

export const Instruction = ({ nextLink }) => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>
        Instructions
      </Typography>

      <Typography gutterBottom>
        You will be asked to choose the {appConfig.mode} you like the most from
        a set of examples.
      </Typography>

      <Typography gutterBottom>
        Then describe why you preferred that {appConfig.mode} using your {appConfig.feedbackMode}.
      </Typography>

      <Typography color="textSecondary" gutterBottom>
        • Don’t use the browser’s back button — it invalidates your results.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate(nextLink)}
        sx={{ marginTop: 2 }}
      >
        Continue
      </Button>
    </Container>
  );
};
