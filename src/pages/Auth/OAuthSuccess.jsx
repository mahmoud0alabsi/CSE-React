import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function OAuthSuccess() {
    const navigate = useNavigate();
    const hasHandled = useRef(false); // prevent re-running

    useEffect(() => {
        if (hasHandled.current) return;
        hasHandled.current = true;

        const params = new URLSearchParams(window.location.search);
        const username = params.get("username");
        const accessToken = params.get("accessToken");
        const refreshToken = params.get("refreshToken");

        if (username && accessToken && refreshToken) {
            localStorage.setItem("username", username);
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            navigate("/workspace", { replace: true });
        } else {
            console.error("Tokens not found");
            navigate("/login", { replace: true });
        }
    }, [navigate]);

    return <div>Logging you in...</div>;
}
