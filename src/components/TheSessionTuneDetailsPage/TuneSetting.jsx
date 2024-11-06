import { Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";

const TuneSetting = React.memo(({ setting, visualObj, onModalToggle }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        foregroundColor: "#000000",
        contain: "layout paint",
        "&:hover": {
          backgroundColor: "#FFFFFF",
          transform: "none",
        },
        "& svg": {
          width: "100%",
          height: "auto",
          display: "block",
        },
      }}
    >
      <CardContent>
        <Box
          onClick={() => onModalToggle(setting)}
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "transparent",
            },
            "& svg": {
              width: "100%",
              height: "auto",
              display: "block",
            },
          }}
        >
          {visualObj && (
            <div
              dangerouslySetInnerHTML={{
                __html: visualObj,
              }}
            />
          )}
        </Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(`/member/${setting.member.id}`)}
        >
          Added by {setting.member.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {setting.date}
        </Typography>
      </CardContent>
    </Card>
  );
});

export default TuneSetting;
