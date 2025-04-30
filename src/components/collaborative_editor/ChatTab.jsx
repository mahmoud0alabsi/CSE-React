import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    List,
    ListItem,
    TextField,
    Button,
    Stack,
    Typography,
} from '@mui/material';
import useChatSocket from '../../hooks/chat/useChatSocket';
import { useSelector } from 'react-redux';

export default function ChatTab() {
    const projectId = useSelector((state) => state.collaborative.projectId);
    const { connected, messages, sendMessage } = useChatSocket(projectId);
    const [chatInput, setChatInput] = useState("");
    const scrollRef = useRef(null);
    const username = localStorage.getItem("username") || "";

    const handleSend = () => {
        if (!chatInput.trim()) return;

        const newMessage = {
            sender: username || "Anonymous",
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
                    Public Chat
                </Typography>
            </Box>

            {/* Scrollable messages area */}
            <Box sx={{ flex: 1, overflowY: "auto", p: 1, minHeight: 0 }} ref={scrollRef}>
                <List dense>
                    {messages.map((msg, i) => {
                        const isCurrentUser = msg.sender === username;
                        return (
                            <ListItem
                                key={i}
                                disableGutters
                                sx={{
                                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: isCurrentUser ? 'flex-end' : 'flex-start',
                                    maxWidth: '80%',
                                    mb: 1
                                }}>
                                    {/* Username */}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#888",
                                            fontWeight: 'bold',
                                            mb: 0.5
                                        }}
                                    >
                                        {isCurrentUser ? 'You' : msg.sender}
                                    </Typography>

                                    {/* Message Bubble */}
                                    <Box sx={{
                                        bgcolor: isCurrentUser ? '#3f51b5' : '#2a2a2a',
                                        p: 1.5,
                                        borderRadius: 2,
                                        color: '#fff',
                                        wordBreak: 'break-word'
                                    }}>
                                        <Typography variant="body2">{msg.content}</Typography>
                                    </Box>

                                    {/* Timestamp */}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#888",
                                            mt: 0.5,
                                            fontSize: '0.7rem'
                                        }}
                                    >
                                        {new Date(msg.timestamp).toLocaleString(undefined, {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </Typography>
                                </Box>
                            </ListItem>
                        );
                    })}
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
