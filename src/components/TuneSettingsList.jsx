import React, { useEffect, useRef } from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import abcjs from "abcjs";

const TuneSettingsList = ({ settings }) => {
  useEffect(() => {
    settings.forEach((setting) => {
      // Construct complete ABC notation with headers
      const completeAbc = `X:${setting.id}
M:4/4
L:1/8
K:${setting.key.replace("major", "").replace("minor", "m")}
${setting.abc}`;

      console.log("Complete ABC:", completeAbc); // For debugging

      abcjs.renderAbc(`paper-${setting.id}`, completeAbc, {
        responsive: "resize",
        staffwidth: 600,
        scale: 2.2,
        paddingleft: 10,
        paddingright: 10,
        staffsep: 60,
        systemsep: 80,
        foregroundColor: "#000000",
        backgroundColor: "#FFFFFF",
      });
    });
  }, [settings]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        ABC Notations ({settings.length})
      </Typography>
      <Stack spacing={2}>
        {settings.map((setting) => (
          <Card
            key={setting.id}
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              "& svg": {
                maxWidth: "100%",
                height: "auto",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Key: {setting.key}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Added by: {setting.member.name} on{" "}
                    {new Date(setting.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <div
                  id={`paper-${setting.id}`}
                  style={{
                    backgroundColor: "#FFFFFF",
                    padding: "20px",
                    overflowX: "auto",
                  }}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default TuneSettingsList;
