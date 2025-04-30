import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import ForgotPassword from "../../components/auth/ForgotPassword";
import AppTheme from "../../theme/AppTheme";
import { GoogleIcon, GithubIcon, SitemarkIcon } from "../../components/auth/CustomIcons";
import { Link as RouterLink } from 'react-router-dom';
import { handleLogin } from "../../api/auth/handlers";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from 'react-redux';
import { showLoading } from '../../state_managment/store';

const SPRING_SERVER_BASE_URL = process.env.REACT_APP_SPRING_SERVER_BASE_URL;

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    minHeight: "100vh", // Ensure it stretches to screen height
    width: "100%",
    padding: theme.spacing(2),
    position: "relative", // Needed for ::before background
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
    },
    "&::before": {
        content: '""',
        position: "absolute",
        zIndex: -1,
        inset: 0,
        display: "block",
        backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        ...theme.applyStyles("dark", {
            backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
        }),
    },
}));


export default function LoginPage(props) {
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOAuthLogin = (provider) => {
        window.location.href = `${SPRING_SERVER_BASE_URL}/oauth2/authorization/${provider}`;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validateInputs();
        if (!isValid) return;

        setLoading(true);

        try {
            const data = new FormData(event.currentTarget);

            const response = await handleLogin({
                username: data.get("username"),
                password: data.get("password"),
            });

            if (response.success) {
                dispatch(showLoading());
                navigate("/workspace", { replace: true });
            } else {
                setUsernameError(true);
                setUsernameErrorMessage(response.message || "Invalid credentials.");
            }
        } catch (err) {
            setUsernameError(true);
            setUsernameErrorMessage("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = () => {
        const username = document.getElementById("username");
        const password = document.getElementById("password");

        let isValid = true;

        if (!username.value || username.value.length < 3) {
            setUsernameError(true);
            setUsernameErrorMessage("Username must be at least 3 characters long.");
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password must be at least 6 characters long.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        return isValid;
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SitemarkIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{
                            fontSize: "clamp(2rem, 10vw, 2.15rem)",
                            fontWeight: 600,
                        }}
                    >
                        Login
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        noValidate
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "100%",
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <TextField
                                required
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Jon Snow"
                                autoComplete="username"
                                autoFocus
                                fullWidth
                                variant="outlined"
                                color={usernameError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl
                            sx={{
                                mb: 1,
                            }}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? "error" : "primary"}
                            />
                        </FormControl>
                        {/* <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        /> */}
                        <ForgotPassword open={open} handleClose={handleClose} />
                        {!loading ? (
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress color="dark" size={24} />
                                ) : (
                                    "Login"
                                )}
                            </Button>) : (
                            <Button
                                fullWidth
                                variant="contained"
                            >
                                <CircularProgress color="dark" size={24} />
                            </Button>
                        )}

                        <Link
                            component="button"
                            type="button"
                            onClick={handleClickOpen}
                            variant="body2"
                            sx={{ alignSelf: "center" }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>
                    <Divider>or</Divider>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleOAuthLogin('google')}
                            startIcon={<GoogleIcon />}
                        >
                            Sign in with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleOAuthLogin('github')}
                            startIcon={<GithubIcon />}
                        >
                            Sign in with Github
                        </Button>
                        <Typography sx={{ textAlign: "center" }}>
                            Don&apos;t have an account?{" "}
                            <Link
                                component={RouterLink}
                                to="/register"
                                variant="body2"
                                sx={{ alignSelf: "center" }}
                            >
                                Register
                            </Link>

                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </AppTheme>
    );
}