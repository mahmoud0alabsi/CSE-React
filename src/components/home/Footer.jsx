import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import SitemarkIcon from "./SitemarkIcon";
import { Link as RouterLink } from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
      {"Done By "}
      <Link
        color="text.secondary"
        href="https://www.linkedin.com/in/mahmoud-alabsi/"
      >
        Mahmoud Alabsi
      </Link>
      &nbsp;
      {new Date().getFullYear()}
    </Typography>
  );
}

export default function Footer() {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: { xs: 4, sm: 8 },
        py: { xs: 8, sm: 10 },
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            minWidth: { xs: "100%", sm: "60%" },
          }}
        >
          <Box
            sx={{
              width: { xs: "100%", sm: "60%" },
            }}
          >
            <SitemarkIcon />
            <Typography
              variant="h1"
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                fontSize: "clamp(1.5rem, 8vw, 0.5rem)",
                gap: 1,
              }}
            >
              CodeSpace{" "}
              <Typography
                component="span"
                variant="h1"
                sx={(theme) => ({
                  fontSize: "inherit",
                  color: "primary.main",
                  ...theme.applyStyles("dark", {
                    color: "primary.light",
                  }),
                })}
              >
                Editor
              </Typography>
              <Box
                component="img"
                src="/assets/rocket-3d.png"
                alt="Rocket Icon"
                sx={{
                  height: 30,
                  width: 30,
                  objectFit: "contain",
                }}
              />
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Product
          </Typography>
          <Link color="text.secondary" variant="body2" href="#features">
            Features
          </Link>
          <Link color="text.secondary" variant="body2" href="#highlights">
            Highlights
          </Link>
        </Box>
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "medium" }}>
            Try now
          </Typography>
          <Link component={RouterLink} to="/register" color="text.secondary" variant="body2">
            Register
          </Link>
          <Link component={RouterLink} to="/login" color="text.secondary" variant="body2">
            Login
          </Link>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          pt: { xs: 4, sm: 8 },
          width: "100%",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <div>
          <Link color="text.secondary" variant="body2">
            Privacy Policy
          </Link>
          <Typography sx={{ display: "inline", mx: 0.5, opacity: 0.5 }}>
            &nbsp;•&nbsp;
          </Typography>
          <Link color="text.secondary" variant="body2">
            Terms of Service
          </Link>
          <Copyright />
        </div>
        <Stack
          direction="row"
          spacing={1}
          useFlexGap
          sx={{ justifyContent: "left", color: "text.secondary" }}
        >
          <IconButton
            color="inherit"
            size="small"
            href="https://github.com/mahmoud0alabsi"
            target="_blank"
            aria-label="GitHub"
            sx={{ alignSelf: "center" }}
          >
            <GitHubIcon />
          </IconButton>
          <IconButton
            color="inherit"
            size="small"
            href="https://www.linkedin.com/in/mahmoud-alabsi/"
            target="_blank"
            aria-label="LinkedIn"
            sx={{ alignSelf: "center" }}
          >
            <LinkedInIcon />
          </IconButton>
        </Stack>
      </Box>
    </Container>
  );
}
