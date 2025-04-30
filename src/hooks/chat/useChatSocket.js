import { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../../state_managment/chatSlice";

const SPRING_SERVER_BASE_URL = process.env.REACT_APP_SPRING_SERVER_BASE_URL;

const useChatSocket = (projectId) => {
    const [stompClient, setStompClient] = useState(null);
    const [connected, setConnected] = useState(false);
    const dispatch = useDispatch();
    const messages = useSelector((state) => state.chat.messagesByProject[projectId] || []);

    useEffect(() => {
        const socket = new SockJS(`${SPRING_SERVER_BASE_URL}/ws`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                setConnected(true);
                client.subscribe(`/topic/chat/${projectId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    dispatch(addMessage({ projectId, message: newMessage }));
                },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        }
                    });
            },
            onDisconnect: () => {
                setConnected(false);
            },
        });

        setStompClient(client);
        client.activate();

        return () => {
            if (client) {
                client.deactivate();
            }
        };
    }, [projectId, dispatch]);

    const sendMessage = (message) => {
        if (stompClient && connected) {
            stompClient.publish({
                destination: `/app/chat.sendMessage/${projectId}`,
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

export default useChatSocket;
