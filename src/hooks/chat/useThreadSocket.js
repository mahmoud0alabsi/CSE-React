import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SPRING_SERVER_BASE_URL = process.env.REACT_APP_SPRING_SERVER_BASE_URL;

const useThreadSocket = (projectId, branchId, fileId) => {
    const [stompClient, setStompClient] = useState(null);
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = new SockJS(`${SPRING_SERVER_BASE_URL}/ws`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        const client = new Client({
            webSocketFactory: () => socket,
            // debug: (str) => console.log('[WS] ' + str),
            onConnect: () => {
                setConnected(true);
                client.subscribe(`/topic/thread/${projectId}/${branchId}/${fileId}`, (message) => {
                    setMessages((prevMessages) => [...prevMessages, JSON.parse(message.body)]);
                },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        }
                    });
            },
            onDisconnect: () => {
                setConnected(false);
                // console.log("Disconnected from WebSocket");
            },
        });

        setStompClient(client);
        client.activate();

        return () => {
            if (client) {
                client.deactivate();
                // console.log("[WS] WebSocket deactivated");
            }
        };
    }, [projectId]);

    const sendMessage = (message) => {
        if (stompClient && connected) {
            stompClient.publish({
                destination: `/app/thread.sendMessage/${projectId}/${branchId}/${fileId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(message),
            });
        } else {
            console.log("WebSocket is not connected.");
        }
    };

    return { connected, messages, sendMessage };
};

export default useThreadSocket;
