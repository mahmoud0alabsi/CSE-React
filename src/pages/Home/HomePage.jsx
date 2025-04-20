import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../../theme/AppTheme";
import AppAppBar from "../../components/home/AppAppBar";
import Hero from "../../components/home//Hero";
import Highlights from "../../components/home/Highlights";
import Features from "../../components/home/Features";
import Footer from "../../components/home/Footer";

export default function HomePage() {
    return (
        <>
            <CssBaseline enableColorScheme />
            <AppAppBar />
            <Hero />
            <div>
                <Features />
                <Divider />
                <Highlights />
                <Divider />
                <Footer />
            </div>
        </>
    );
}
