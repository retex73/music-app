import { Paper, styled } from "@mui/material";

export const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  background: `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.background.paper}99)`,
  backdropFilter: "blur(10px)",
  border: `1px solid ${theme.palette.divider}`,
}));
