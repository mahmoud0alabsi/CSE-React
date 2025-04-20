import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import SyncAltRoundedIcon from "@mui/icons-material/SyncAltRounded";
import GroupsIcon from "@mui/icons-material/Groups";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import SecurityRoundedIcon from "@mui/icons-material/SecurityRounded";
import CommitIcon from "@mui/icons-material/Commit";

const items = [
  {
    icon: <GroupsIcon fontSize="large" color="primary" />,
    title: "Seamless Collaboration",
    description:
      "Join coding sessions with your team in real time. Edit together, review together, succeed together.",
  },
  {
    icon: <CodeRoundedIcon fontSize="large" color="primary" />,
    title: "Smart Code Environment",
    description:
      "Write, format, and navigate code with Monaco-powered editing — powered by intelligence.",
  },
  {
    icon: <SyncAltRoundedIcon fontSize="large" color="primary" />,
    title: "Live Sync Across Sessions",
    description:
      "Your edits are synced instantly across branches and files. Switch context without losing flow.",
  },
  {
    icon: <SpeedRoundedIcon fontSize="large" color="primary" />,
    title: "Performance That Scales",
    description:
      "Optimized for low latency and large files. Code smoothly even in big projects.",
  },
  {
    icon: <SecurityRoundedIcon fontSize="large" color="primary" />,
    title: "Secure & Role-Based Access",
    description:
      "OAuth2 + role-based access ensure your codebase is safe while collaboration is seamless.",
  },
  {
    icon: <CommitIcon fontSize="large" color="primary" />,
    title: "Commit & Version Review",
    description:
      "Create commits, review changes, and track project history — all inside the editor.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 6, sm: 12 },
        pb: { xs: 10, sm: 16 },
        color: "white",
        bgcolor: "grey.900",
      }}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 4, sm: 6 },
        }}
      >
        <Box
          sx={{
            textAlign: { sm: "left", md: "center" },
            width: { xs: "100%", md: "70%" },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Built for Developers. Designed for Teams.
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            Discover what makes <strong>CodeSpace Editor</strong> a powerful
            platform for real-time collaborative development — secure,
            intelligent, and built to scale with your team.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: "inherit",
                  p: 3,
                  height: "100%",
                  borderColor: "hsla(220, 25%, 25%, 0.3)",
                  backgroundColor: "grey.800",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
