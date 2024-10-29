import React, { useEffect, useRef } from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import abcjs from "abcjs";

const TuneSettingsList = ({ settings }) => {
  useEffect(() => {
    settings.forEach((setting) => {
      const completeAbc = `X:${setting.id}
M:4/4
L:1/8
K:${setting.key.replace("major", "").replace("minor", "m")}
${setting.abc}`;

      const container = document.getElementById(`paper-${setting.id}`);
      const containerWidth = container?.clientWidth || 800;

      abcjs.renderAbc(`paper-${setting.id}`, completeAbc, {
        scale: 1.5,
        staffwidth: Math.min(containerWidth - 40, 800),
        wrap: {
          minSpacing: 1.8,
          maxSpacing: 2.7,
          preferredMeasuresPerLine: 4,
        },
        paddingright: 10,
        paddingleft: 10,
        format: {
          headerfont: "Arial 16px",
          gchordfont: "Arial 16px",
          vocalfont: "Arial 16px",
        },
      });
    });
  }, [settings]);

  return (
    <Box sx={{ mt: 4 }}>
      <Stack spacing={2}>
        {settings.map((setting) => (
          <Card
            key={setting.id}
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
              foregroundColor: "#000000",
              contain: "layout paint",
              "& svg": {
                maxWidth: "100%",
                height: "auto",
                minHeight: "200px",
                display: "block",
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
                    color: "#000000",
                    padding: "20px",
                    overflowX: "auto",
                    width: "100%",
                    contain: "layout paint",
                    minHeight: "200px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
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
