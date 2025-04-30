import * as React from "react";
import {
    Box,
    Button,
    CssBaseline,
    Divider,
    FormLabel,
    FormControl,
    Link,
    TextField,
    Typography,
    Stack,
    Card as MuiCard,
    Snackbar,
    Alert,
    CircularProgress,
    styled,
} from "@mui/material";
import {
    useNavigate,
    Link as RouterLink
} from "react-router-dom";
import AppTheme from "../../theme/AppTheme";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { handleRegister } from "../../api/auth/handlers";
import { GoogleIcon, GithubIcon, SitemarkIcon } from "../../components/auth/CustomIcons";


const SPRING_SERVER_BASE_URL = process.env.REACT_APP_SPRING_SERVER_BASE_URL;

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    [theme.breakpoints.up("sm")]: {
        width: "450px",
    },
    ...theme.applyStyles("dark", {
        boxShadow:
            "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    minHeight: "100vh", // Ensures full height
    width: "100%",
    padding: theme.spacing(2),
    position: "relative", // Enables ::before background
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


export default function RegisterPage(props) {
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState("");
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");

    const [showSnackbar, setShowSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleOAuthLogin = (provider) => {
        window.location.href = `${SPRING_SERVER_BASE_URL}/oauth2/authorization/${provider}`;
    };

    const validateInputs = () => {
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const username = document.getElementById("username");

        let isValid = true;

        if (!username.value || username.value.length < 3) {
            setUsernameError(true);
            setUsernameErrorMessage("Username is required.");
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage("");
        }

        if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        const isValid = validateInputs();
        if (!isValid) return;

        setLoading(true);

        try {
            const data = new FormData(event.currentTarget);

            const response = await handleRegister({
                username: data.get("username"),
                email: data.get("email"),
                password: data.get("password"),
            });

            if (response.success) {
                setSnackbarMessage("Registration successful!, redirecting to login...");
                setShowSnackbar(true);
                setTimeout(() => {
                    navigate("/login", { replace: true });
                }, 3000);
            } else {
                if (response.message.includes("Email")) {
                    setEmailError(true);
                    setEmailErrorMessage(response.message || "Registration failed. Try again.");
                } else {
                    setUsernameError(true);
                    setUsernameErrorMessage(response.message || "Registration failed. Try again.");
                }
            }
        } catch (err) {
            console.error(err);
            setUsernameError(true);
            setUsernameErrorMessage("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSnackabrClose = () => {
        setShowSnackbar(false);
    }

    return (
        <AppTheme {...props}>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackabrClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackabrClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <CssBaseline enableColorScheme />
            <SignUpContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <SitemarkIcon />
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
                    >
                        Register
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                    >
                        <FormControl>
                            <FormLabel htmlFor="name">Username</FormLabel>
                            <TextField
                                autoComplete="username"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                placeholder="Jon Snow"
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                color={usernameError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                placeholder="your@email.com"
                                name="email"
                                autoComplete="email"
                                variant="outlined"
                                error={emailError}
                                helperText={emailErrorMessage}
                                color={emailError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl
                            sx={{
                                mb: 1,
                            }}
                        >
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                variant="outlined"
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                color={passwordError ? "error" : "primary"}
                            />
                        </FormControl>
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
                                    "Register"
                                )}
                            </Button>) : (
                            <Button
                                fullWidth
                                variant="contained"
                            >
                                <CircularProgress color="dark" size={24} />
                            </Button>
                        )}
                    </Box>
                    <Divider>
                        <Typography sx={{ color: "text.secondary" }}>or</Typography>
                    </Divider>
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
                            Already have an account?{" "}
                            <Link
                                component={RouterLink}
                                to="/login"
                                variant="body2"
                                sx={{ alignSelf: "center" }}
                            >
                                Login
                            </Link>
                        </Typography>
                    </Box>
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}
