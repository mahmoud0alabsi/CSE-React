import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import useThreadSocket from '../../hooks/chat/useThreadSocket';

export default function ThreadTab({ projectId, branchId, fileId, role }) {
    const [chatInput, setChatInput] = useState("");
    const { connected, messages, sendMessage } = useThreadSocket(projectId, branchId, fileId);
    const scrollRef = useRef(null);

    const handleSend = () => {
        if (!chatInput.trim()) return;

        const newMessage = {
            sender: localStorage.getItem("username") || "Anonymous",
            content: chatInput.trim(),
            timestamp: new Date().toISOString(),
        };

        sendMessage(newMessage);

        setChatInput("");
    };

    // Auto-scroll to bottom on new message
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", minHeight: 0, bgcolor: "#1e1e1e", color: "#f1f1f1" }}>
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#989898",
                    fontSize: "0.70rem",
                    borderBottom: "1px solid #444",
                }}
            >
                <Typography variant="subtitle4" sx={{ fontWeight: "bold" }}>
                    Thread Chat (File)
                </Typography>
            </Box>

            {/* Scrollable messages area */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 1, minHeight: 0 }} ref={scrollRef}>
                <List dense>
                    {messages.map((msg, i) => (
                        console.log("Rendering message:", msg),
                        <ListItem key={i} disableGutters>
                            <ListItemText
                                primary={<Typography variant="body2" sx={{ color: "#fff" }}>{msg.content}</Typography>}
                                secondary={<Typography variant="caption" sx={{ color: "#888" }}>{msg.sender}</Typography>}
                            />
                            <Typography variant="caption" sx={{ color: "#888", ml: 1 }}>{new Date(msg.timestamp).toLocaleString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                            })}</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>

            {/* Input box pinned to bottom */}
            <Stack direction="row" spacing={1} sx={{ p: 1, borderTop: "1px solid #333" }}>
                <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    sx={{
                        input: { color: "#f1f1f1" },
                        "& .MuiOutlinedInput-root": {
                            backgroundColor: "#2a2a2a",
                            borderColor: "#444",
                            "& fieldset": { borderColor: "#444" },
                            "&:hover fieldset": { borderColor: "#666" },
                            "&.Mui-focused fieldset": { borderColor: "#888" },
                        },
                    }}
                />
                <Button
                    variant="contained"
                    size="small"
                    onClick={handleSend}
                    sx={{ bgcolor: "#3f51b5", textTransform: "none" }}
                    disabled={!connected} // Disable if not connected
                >
                    Send
                </Button>
            </Stack>
        </Box>
    );
}
