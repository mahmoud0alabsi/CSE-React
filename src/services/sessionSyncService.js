import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SPRING_SERVER_BASE_URL = process.env.REACT_APP_SPRING_SERVER_BASE_URL;

const client = new Client({
    webSocketFactory: () => new SockJS(`${SPRING_SERVER_BASE_URL}/ws`),
    reconnectDelay: 5000,
    connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export const connectWebSocket = (projectId, username, onBranchReceived, onFileReceived, onInitialSync) => {
    client.onConnect = () => {
        client.subscribe(`/topic/sync/project/${projectId}/branch`, (message) => {
            onBranchReceived(JSON.parse(message.body));
        });

        client.subscribe(`/topic/sync/project/${projectId}/file`, (message) => {
            onFileReceived(JSON.parse(message.body));
        });

        client.subscribe(`/user/${username}/queue/sync/file`, (message) => {
            console.log('Initial sync file:', message.body);
            const files = JSON.parse(message.body);
            onInitialSync('files', files);
        });

        // Trigger initial sync
        // client.publish({
        //     destination: `/app/sync/project/${projectId}/init`,
        //     body: username,
        // });
    };
    client.activate();
};

export const disconnectWebSocket = () => {
    client.deactivate();
};

export const sendBranchMessage = (projectId, branchMessage) => {
    try {
        client.publish({
            destination: `/app/sync/project/${projectId}/branch`,
            body: JSON.stringify(branchMessage),
        });
    } catch (error) {
        console.error('Error sending branch message:', error);
    }
};

export const sendFileMessage = (projectId, fileMessage) => {
    try {
        client.publish({
            destination: `/app/sync/project/${projectId}/file`,
            body: JSON.stringify(fileMessage),
        });
    } catch (error) {
        console.error('Error sending file message:', error);
    }
};