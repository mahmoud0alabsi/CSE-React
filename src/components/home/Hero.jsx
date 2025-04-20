import * as React from "react";
import { Box, Button, Container, Link, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const StyledBox = styled("div")(({ theme }) => ({
  alignSelf: "center",
  width: "100%",
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: "6px solid",
  outlineColor: "hsla(220, 25%, 80%, 0.2)",
  border: "1px solid",
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: "0 0 12px 8px hsla(220, 25%, 80%, 0.2)",
  backgroundImage: `url(/assets/code_editor_screenshot.png)`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  [theme.breakpoints.up("sm")]: {
    marginTop: theme.spacing(10),
    height: 650,
  },
  ...theme.applyStyles("dark", {
    boxShadow: "0 0 24px 12px hsla(210, 100%, 25%, 0.2)",
    backgroundImage: `url(/assets/code_editor_screenshot.png)`,
    outlineColor: "hsla(220, 20%, 42%, 0.1)",
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: "100%",
        backgroundRepeat: "no-repeat",
        backgroundImage:
          "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)",
        ...theme.applyStyles("dark", {
          backgroundImage:
            "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)",
        }),
      })}
    >
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
        >
          <Typography
            variant="h1"
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              fontSize: "clamp(3rem, 10vw, 3.5rem)",
              gap: 1,
            }}
          >
            <Box
              component="img"
              src="/assets/rocket-3d.png"
              alt="Rocket Icon"
              sx={{
                height: 50,
                width: 50,
                objectFit: "contain",
              }}
            />
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
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              color: "text.secondary",
              width: { sm: "100%", md: "80%" },
            }}
          >
            Real-time collaborative code editing, branching, version control,
            commit history, and chat — all in one futuristic coding space.
          </Typography>

          <Box sx={{ pt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              endIcon={<RocketLaunchIcon />}
            >
              Let’s Take Off
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            By clicking &quot;Let’s Take Off&quot; you agree to our&nbsp;
            <Link href="#" color="primary">
              Terms & Conditions
            </Link>
            .
          </Typography>
        </Stack>

        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
