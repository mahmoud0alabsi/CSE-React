import { useEffect, useState } from 'react';
import * as Y from 'yjs';
import { fetchFileContent } from '../../api/FileApi';
import { WebsocketProvider } from 'y-websocket';

const YJS_SOCKET = process.env.REACT_APP_YJS_SERVER_URL;

export default function useYjsConnection({
    docName,
    enabled,
    projectId,
    branchId,
    fileId,
    fileStatus = 'fetched',
    fileContent = ''
}) {
    const [ydoc, setYdoc] = useState(null);
    const [provider, setProvider] = useState(null);
    const [yText, setYText] = useState(null);
    const [meta, setMeta] = useState(null);

    useEffect(() => {
        if (!enabled || !docName || !projectId || !branchId || !fileId) {
            return;
        }

        const newYdoc = new Y.Doc();
        const newYText = newYdoc.getText('monaco');
        const newMeta = newYdoc.getMap('meta');

        const newProvider = new WebsocketProvider(
            YJS_SOCKET,
            docName,
            newYdoc,
            {
                connect: true,
                params: { doc: docName },
                maxBackoffTime: 10000,
                WebSocketPolyfill: typeof WebSocket !== 'undefined' ? undefined : require('ws')
            }
        );

        // Initialize user awareness with cursor position
        const id = Math.floor(Math.random() * 1000);
        newProvider.awareness.setLocalStateField('user', {
            clientId: localStorage.getItem('username') || `user-${id}`,
            name: localStorage.getItem('username') || `User ${id}`,
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
            cursor: null // Initialize cursor as null
        });

        // Handle sync and initial content
        newProvider.on('sync', async (isSynced) => {
            if (!isSynced) return;


            // Check WebSocket state before fetching content
            if (newProvider.ws?.readyState !== WebSocket.OPEN) {
                return;
            }

            const initialized = newMeta.get('initialized');

            if (!initialized && fileStatus !== 'new') {
                try {
                    newYdoc.transact(() => {
                        newYText.delete(0, newYText.length);
                        newYText.insert(0, fileContent);
                        newMeta.set('initialized', true);
                    });
                    // const content = await fetchFileContent(projectId, branchId, fileId);
                    // newYdoc.transact(() => {
                    //     newYText.delete(0, newYText.length);
                    //     newYText.insert(0, content);
                    //     newMeta.set('initialized', true);
                    // });
                } catch (err) {
                    console.error(`[Yjs Client] Failed to fetch content: ${err.message}`);
                }
            } else {
                // console.log(`[Yjs Client] Already initialized. Skipping fetch.`);
            }
        });

        // Detailed connection status logging
        newProvider.on('status', (event) => {
            // console.log(`[Yjs Client] Connection status: ${event.status}`);
        });

        newProvider.on('message', (message) => {
            console.log(`[Yjs Client sock] Message received:`, message);
        });

        newProvider.on('error', (error) => {
            console.error(`[Yjs Client] Error:`, error);
        });

        // Log connection errors
        newProvider.on('connection-error', (error) => {
            console.error(`[Yjs Client] Connection error:`, error);
        });

        // Log when connection is closed with safeguards
        newProvider.on('connection-close', (event) => {
            // console.log(`[Yjs Client] Connection closed:`, {
            //     code: event?.code ?? 'Unknown',
            //     reason: event?.reason ?? 'No reason provided',
            //     wasClean: event?.wasClean ?? false
            // });
            // Clear cursor on disconnect
            newProvider.awareness.setLocalStateField('user', null);
        });

        setYdoc(newYdoc);
        setProvider(newProvider);
        setYText(newYText);
        setMeta(newMeta);

        return () => {
            if (newProvider.ws?.readyState === WebSocket.OPEN) {
                newProvider.disconnect();
            }
            newProvider.destroy();
            newYdoc.destroy();
        };
    }, [docName, enabled, fileStatus, projectId, branchId, fileId]);

    return { ydoc, provider, yText, meta };
}