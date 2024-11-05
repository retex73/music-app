import React from "react";
import { Box, Modal } from "@mui/material";

const SheetMusicModal = ({ open, onClose, selectedSetting }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-sheet-music"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          bgcolor: "#FFFFFF",
          boxShadow: 24,
          p: 4,
          outline: "none",
          maxWidth: "95vw",
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: 1,
          "& svg": {
            maxWidth: "100%",
            height: "auto",
            minHeight: "200px",
            display: "block",
            overflow: "visible",
          },
        }}
      >
        {selectedSetting && (
          <div
            id={`modal-paper-${selectedSetting}`}
            style={{
              padding: "20px",
              minWidth: "900px",
              color: "#000000",
              contain: "layout paint",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflowY: "visible",
            }}
          />
        )}
      </Box>
    </Modal>
  );
};

export default SheetMusicModal;
