import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { FaPlay } from "react-icons/fa";
import { handleCodeExecution } from "../../api/code_execution/handlers";
import { Box, Button, Typography, Paper, CircularProgress } from "@mui/material";

const CodeExecution = ({ code }) => {
    const selectedBranchId = useSelector((state) => state.collaborative.selectedBranchId);
    const file = useSelector((state) => state.collaborative.selectedFile);
    const [executionResult, setExecutionResult] = useState(null);
    const [executionTime, setExecutionTime] = useState(0);
    const [success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setExecutionResult(null);
        setExecutionTime(0);
        setSuccess(null);
    }, []);

    const handleRunCode = async () => {
        if (!selectedBranchId || !file || !code || code === '' || !file.language) {
            return;
        }
        const language = file.language.toLowerCase() || "javascript";

        console.log("Running code:", code, "Language:", language);
        setIsLoading(true);
        setSuccess(null);
        setExecutionResult(""); // Clear previous results

        try {
            const response = await handleCodeExecution({
                code: code,
                language
            });

            console.log("Code execution response:", response);

            if (response.success) {
                console.log("Execution result:", response.success);
                setExecutionResult(response.stdout);
                setExecutionTime(response.executionTimeMs);
                setSuccess(true);
            } else {
                setExecutionResult(response.stderr || "Unknown error");
                setSuccess(false);
            }

        } catch (error) {
            setExecutionResult("Unknown error");
            setExecutionTime(0);
            setSuccess(false);
            console.error("Error executing code:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box style={{ backgroundColor: '#070c18' }} sx={{ position: "relative", padding: 2 }}>
            {/* Header and Run Code Button */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <Typography variant="h6">Code Execution Results</Typography>

                <Box sx={{ display: "flex", alignItems: "end", justifyItems: "center", gap: 2 }}>
                    {/* Success/Failure Flag */}
                    {success !== null && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ color: success ? "green" : "red" }}>
                                <strong>{success ? "Success" : "Failed"}</strong>
                            </Typography>
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ display: "flex", alignItems: "center", borderRadius: 1 }}
                        onClick={handleRunCode}
                        disabled={isLoading}
                    >
                        {isLoading && (
                            <CircularProgress sx={{ padding: 1, color: "white", thickness: 2 }} />
                        )}
                        {!isLoading && (<FaPlay style={{ marginRight: "6px" }} />)} Run
                    </Button>
                </Box>
            </Box>

            {/* Execution Results */}
            <Paper
                sx={{
                    padding: 2,
                    mb: 2,
                    backgroundColor: "#071035",
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    boxShadow: 3,
                    minHeight: "150px",
                }}
            >
                {/* Execution Result */}
                {executionResult && (
                    <Box sx={{ marginBottom: 2 }}>
                        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                            {executionResult}
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Execution Time */}
            {executionTime >= 0 && (
                <Box sx={{ marginBottom: 2 }}>
                    <Typography variant="subtitle2">Execution Time: {executionTime} ms</Typography>
                </Box>
            )}
        </Box>
    );

};

export default CodeExecution;
