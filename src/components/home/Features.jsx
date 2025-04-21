import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import MuiChip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import GroupRoundedIcon from "@mui/icons-material/GroupRounded";
import MergeTypeRoundedIcon from "@mui/icons-material/MergeTypeRounded";
import HistoryEduRoundedIcon from "@mui/icons-material/HistoryEduRounded";

const items = [
  {
    icon: <GroupRoundedIcon fontSize="large" color="primary" />,
    title: "Real-Time Collaboration",
    description:
      "Work with your team on the same codebase in real time, with instant syncing across sessions.",
    imageLight: "/assets/collaborate.png",
    imageDark: "/assets/collaborate.png",
  },
  {
    icon: <MergeTypeRoundedIcon fontSize="large" color="primary" />,
    title: "Branch & File Management",
    description:
      "Navigate branches and files easily. Switch between sessions by simply selecting a file.",
    imageLight: "/assets/branchs.png",
    imageDark: "/assets/branchs.png",
  },
  {
    icon: <HistoryEduRoundedIcon fontSize="large" color="primary" />,
    title: "Version Control & Commits",
    description:
      "Track every change. Commit with context. Review history and stay in control of your project.",
    imageLight: "/assets/commits.png",
    imageDark: "/assets/commits.png",
  },
];

const Chip = styled(MuiChip, {
  shouldForwardProp: (prop) => prop !== "selected",
})(({ theme, selected }) => ({
  ...(selected && {
    background:
      "linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))",
    color: "#fff",
    borderColor: (theme.vars || theme).palette.primary.light,
    "& .MuiChip-label": { color: "#fff" },
    ...theme.applyStyles?.("dark", {
      borderColor: (theme.vars || theme).palette.primary.dark,
    }),
  }),
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  return (
    <Box
      sx={{
        display: { xs: "flex", sm: "none" },
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, overflow: "auto" }}>
        {items.map((item, index) => (
          <Chip
            key={index}
            size="medium"
            label={item.title}
            onClick={() => handleItemClick(index)}
            selected={selectedItemIndex === index}
          />
        ))}
      </Box>

      <Card variant="outlined">
        <Box
          sx={(theme) => ({
            mb: 2,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 280,
            backgroundImage: "var(--items-imageLight)",
            ...theme.applyStyles?.("dark", {
              backgroundImage: "var(--items-imageDark)",
            }),
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          })}
          style={{
            "--items-imageLight": `url(${selectedFeature.imageLight})`,
            "--items-imageDark": `url(${selectedFeature.imageDark})`,
          }}
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography variant="h6">{selectedFeature.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box
        sx={{
          mx: "auto",
          textAlign: { sm: "left", md: "center" },
          width: { xs: "100%", md: "70%" },
        }}
      >
        <Typography
          component="h2"
          variant="h4"
          gutterBottom
          sx={{ color: "text.primary" }}
        >
          CodeSpace features
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: { xs: 2, sm: 4 } }}
        >
          Provide a brief overview of the key features of the product. For
          example, you could list the number of features, their types or
          benefits, and add-ons.
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row-reverse" },
          gap: 2,
        }}
      >
        <div>
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              flexDirection: "column",
              gap: 2,
              height: "100%",
            }}
          >
            {items.map(({ icon, title, description }, index) => (
              <Box
                key={index}
                component={Button}
                onClick={() => handleItemClick(index)}
                sx={[
                  (theme) => ({
                    p: 2,
                    height: "100%",
                    width: "100%",
                    "&:hover": {
                      backgroundColor: (theme.vars || theme).palette.action
                        .hover,
                    },
                  }),
                  selectedItemIndex === index && {
                    backgroundColor: "action.selected",
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "left",
                      gap: 1,
                      textAlign: "left",
                      textTransform: "none",
                      color: "text.secondary",
                    },
                    selectedItemIndex === index && {
                      color: "text.primary",
                    },
                  ]}
                >
                  {icon}

                  <Typography variant="h6">{title}</Typography>
                  <Typography variant="body2">{description}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
          <MobileLayout
            selectedItemIndex={selectedItemIndex}
            handleItemClick={handleItemClick}
            selectedFeature={selectedFeature}
          />
        </div>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            width: { xs: "100%", md: "70%" },
            height: "var(--items-image-height)",
          }}
        >
          <Card
            variant="outlined"
            sx={{
              height: "100%",
              width: "100%",
              display: { xs: "none", sm: "flex" },
              pointerEvents: "none",
            }}
          >
            <Box
              sx={(theme) => ({
                m: "auto",
                width: "100%",
                height: 500,
                borderRadius: 1,
                backgroundSize: "contain",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundImage: "var(--items-imageLight)",
                ...theme.applyStyles("dark", {
                  backgroundImage: "var(--items-imageDark)",
                }),
              })}
              style={
                items[selectedItemIndex]
                  ? ({
                    "--items-imageLight": `url(${items[selectedItemIndex].imageLight})`,
                    "--items-imageDark": `url(${items[selectedItemIndex].imageDark})`,
                  })
                  : {}
              }
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
