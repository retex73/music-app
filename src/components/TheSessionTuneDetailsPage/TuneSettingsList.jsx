import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  CardHeader,
  Avatar,
  Link,
  Button,
} from "@mui/material";
import abcjs from "abcjs";
import TuneAudioPlayer from "../TuneAudioPlayer";
import SheetMusicModal from "./SheetMusicModal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensors,
  useSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableCard = ({ setting, children, id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const TuneSettingsList = ({ settings, onReorder, onVersionMenuClick }) => {
  const { currentUser } = useAuth();
  const [visualObjs, setVisualObjs] = useState({});
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

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

  const handleDragStart = () => {
    setIsDragging(true);
    // Smoothly scroll to show more content
    window.scrollTo({
      top: window.scrollY + 100,
      behavior: "smooth",
    });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setIsDragging(false);

    if (active.id !== over.id) {
      const oldIndex = settings.findIndex((s) => s.id === active.id);
      const newIndex = settings.findIndex((s) => s.id === over.id);
      onReorder(oldIndex, newIndex);
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        transition: "transform 0.3s ease-out",
        transform: isDragging ? "scale(0.5)" : "scale(1)",
        transformOrigin: "top center",
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={settings.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <Stack
            spacing={isDragging ? 1 : 2} // Reduce spacing while dragging
            sx={{
              transition: "all 0.3s ease-out",
              "& .MuiCard-root": {
                transition: "all 0.3s ease-out",
                transform: isDragging ? "scale(0.95)" : "scale(1)",
                opacity: isDragging ? 0.8 : 1,
              },
              // Highlight the dragged item
              "& .MuiCard-root:active": {
                opacity: 1,
                transform: "scale(1)",
                boxShadow: "0 0 20px rgba(0,0,0,0.2)",
              },
            }}
          >
            {settings.map((setting, index) => (
              <SortableCard key={setting.id} id={setting.id}>
                <Card
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
                      marginBottom: "40px",
                    },
                    cursor: "grab",
                    "&:active": {
                      cursor: "grabbing",
                    },
                    // Add a subtle hover effect
                    "&:hover": {
                      transform: !isDragging ? "translateY(-2px)" : "none",
                      boxShadow: !isDragging
                        ? "0 4px 8px rgba(0,0,0,0.1)"
                        : "none",
                    },
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar
                        sx={{
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          fontWeight: 600,
                          width: 36,
                          height: 36,
                          fontSize: "0.9rem",
                          transition: "transform 0.2s ease-in-out",
                          "&:hover": {
                            transform: "scale(1.05)",
                          },
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                    subheader={
                      <Typography
                        variant="body2"
                        sx={{
                          color: "text.secondary",
                          "& a": {
                            color: "primary.main",
                            textDecoration: "none",
                            transition: "color 0.2s ease-in-out",
                            "&:hover": {
                              color: "primary.light",
                              textDecoration: "underline",
                            },
                          },
                        }}
                      >
                        Added on{" "}
                        <Link
                          href="https://thesession.org/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          The Session
                        </Link>{" "}
                        by{" "}
                        <Typography
                          component="span"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                          }}
                        >
                          {setting.username}
                        </Typography>{" "}
                        on {new Date(setting.date).toLocaleDateString()}
                      </Typography>
                    }
                    action={
                      currentUser && (
                        <Button
                          edge="end"
                          aria-label="reorder"
                          onClick={(e) => onVersionMenuClick(e, setting)}
                          size="small"
                          sx={{
                            color: "primary.main",
                            textTransform: "none",
                            "&:hover": {
                              color: "primary.light",
                              backgroundColor: "rgba(255, 107, 53, 0.08)",
                            },
                          }}
                        >
                          Reorder
                        </Button>
                      )
                    }
                    sx={{
                      p: 1,
                      "& .MuiCardHeader-content": {
                        overflow: "hidden",
                      },
                      "& .MuiCardHeader-action": {
                        alignSelf: "center",
                        m: 0,
                      },
                      "& .MuiCardHeader-avatar": {
                        mr: 2,
                      },
                      borderBottom: 1,
                      borderColor: "divider",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      minHeight: "unset",
                      height: "auto",
                    }}
                  />
                  <CardContent
                    sx={{
                      p: 3,
                      backgroundColor: "#FFFFFF",
                    }}
                  >
                    <Stack spacing={2}>
                      <div
                        id={`paper-${setting.id}`}
                        onClick={() => handleModalToggle(setting.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleModalToggle(setting.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
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
                          borderRadius: "20px",
                        }}
                      />
                      <TuneAudioPlayer
                        visualObj={visualObjs[setting.id]}
                        settingId={setting.id}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </SortableCard>
            ))}
          </Stack>
        </SortableContext>
      </DndContext>

      {/* Add a visual indicator when in dragging mode */}
      {isDragging && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "primary.main",
            color: "white",
            padding: "8px 16px",
            borderRadius: "20px",
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            animation: "fadeIn 0.3s ease-out",
          }}
        >
          <Typography variant="body2">
            Reordering Mode - Drag items to reposition
          </Typography>
        </Box>
      )}

      <SheetMusicModal
        open={Boolean(selectedSetting)}
        onClose={() => handleModalToggle(null)}
        selectedSetting={selectedSetting}
      />
    </Box>
  );
};

export default TuneSettingsList;
