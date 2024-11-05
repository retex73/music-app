import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Card, CardContent, Stack } from "@mui/material";
import abcjs from "abcjs";
import TuneAudioPlayer from "../TuneAudioPlayer";
import SheetMusicModal from "./SheetMusicModal";

const TuneSettingsList = ({ settings }) => {
  const [visualObjs, setVisualObjs] = useState({});
  const [selectedSetting, setSelectedSetting] = useState(null);

  useEffect(() => {
    const newVisualObjs = {};

    settings.forEach((setting) => {
      const completeAbc = `X:${setting.id}
M:4/4
L:1/8
K:${setting.key.replace("major", "").replace("minor", "m")}
${setting.abc}`;

      const container = document.getElementById(`paper-${setting.id}`);
      const containerWidth = container?.clientWidth || 800;

      const visualObj = abcjs.renderAbc(`paper-${setting.id}`, completeAbc, {
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
        add_classes: true,
      })[0];

      newVisualObjs[setting.id] = visualObj;
    });

    setVisualObjs(newVisualObjs);
  }, [settings]);

  const handleModalToggle = (settingId) => {
    setSelectedSetting(settingId);

    if (settingId) {
      setTimeout(() => {
        const setting = settings.find((s) => s.id === settingId);
        const completeAbc = `X:${setting.id}
M:4/4
L:1/8
K:${setting.key.replace("major", "").replace("minor", "m")}
${setting.abc}`;

        abcjs.renderAbc(`modal-paper-${setting.id}`, completeAbc, {
          scale: 2.0,
          staffwidth: 900,
          wrap: {
            minSpacing: 1.8,
            maxSpacing: 2.7,
            preferredMeasuresPerLine: 4,
          },
          paddingright: 20,
          paddingleft: 20,
          format: {
            headerfont: "Arial 18px",
            gchordfont: "Arial 18px",
            vocalfont: "Arial 18px",
          },
          add_classes: true,
        });
      }, 100);
    }
  };

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
                overflow: "visible",
                marginBottom: "20px",
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
                    Added by: {setting.username} on{" "}
                    {new Date(setting.date).toLocaleDateString()}
                  </Typography>
                </Box>
                <div
                  id={`paper-${setting.id}`}
                  onClick={() => handleModalToggle(setting.id)}
                  style={{
                    cursor: "pointer",
                    backgroundColor: "#FFFFFF",
                    color: "#000000",
                    padding: "20px",
                    overflowX: "auto",
                    width: "100%",
                    contain: "layout paint",
                    minHeight: "300px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflowY: "visible",
                    marginBottom: "20px",
                  }}
                />
                <TuneAudioPlayer
                  visualObj={visualObjs[setting.id]}
                  settingId={setting.id}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <SheetMusicModal
        open={Boolean(selectedSetting)}
        onClose={() => handleModalToggle(null)}
        selectedSetting={selectedSetting}
      />
    </Box>
  );
};

export default TuneSettingsList;
