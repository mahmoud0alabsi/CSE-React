import { useEffect, useRef } from 'react';

export default function useCursorTracking({
    editorRef,
    monacoRef,
    provider,
    enabled,
    role
}) {
    const decorationIdsRef = useRef([]);
    const widgetsRef = useRef(new Map());
    const styleRef = useRef(null);

    const usernameColors = [
        '#2563eb', // Blue
        '#16a34a', // Green
        '#7c3aed', // Purple
        '#d97706', // Amber
        '#dc2626', // Red
        '#0891b2', // Cyan
        '#db2777', // Pink
        '#ca8a04'  // Yellow
    ];

    useEffect(() => {
        if (!enabled || !editorRef.current || !monacoRef.current || !provider) {
            return;
        }

        const editor = editorRef.current;
        const monaco = monacoRef.current;

        // Update local cursor position on change
        const handleCursorChange = () => {
            if (role === 'VIEWER') return;
            const position = editor.getPosition();
            if (position) {
                provider.awareness.setLocalStateField('user', {
                    ...provider.awareness.getLocalState().user,
                    cursor: {
                        lineNumber: position.lineNumber,
                        column: position.column
                    }
                });
            }
        };

        // Track cursor movements
        const cursorDisposable = role !== 'VIEWER'
            ? editor.onDidChangeCursorPosition(handleCursorChange)
            : { dispose: () => { } };

        // Render remote cursors and usernames
        const updateCursors = () => {
            const states = provider.awareness.getStates();
            const newDecorations = [];
            const newWidgets = new Map();

            states.forEach((state, clientId) => {
                if (clientId === provider.awareness.clientID) return; // Skip local user
                if (!state.user || !state.user.cursor || !state.user.name) return;

                const { cursor, name, color } = state.user;
                const { lineNumber, column } = cursor;

                // Create cursor decoration
                newDecorations.push({
                    range: new monaco.Range(lineNumber, column, lineNumber, column),
                    options: {
                        className: `cursor-decoration-${clientId}`,
                        isWholeLine: false,
                        stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
                        hoverMessage: { value: `${name}'s cursor` },
                        glyphMarginClassName: `cursor-glyph-${clientId}`,
                        zIndex: 1000
                    }
                });

                // Create username widget
                const widgetId = `cursor-widget-${clientId}`;
                newWidgets.set(clientId, {
                    getId: () => widgetId,
                    getDomNode: () => {
                        const domNode = document.createElement('div');
                        domNode.className = `cursor-widget cursor-widget-${clientId}`;
                        domNode.textContent = name;
                        return domNode;
                    },
                    getPosition: () => ({
                        position: { lineNumber, column },
                        preference: [monaco.editor.ContentWidgetPositionPreference.ABOVE]
                    })
                });
            });

            // Update decorations
            decorationIdsRef.current = editor.deltaDecorations(
                decorationIdsRef.current,
                newDecorations
            );

            // Update widgets
            widgetsRef.current.forEach((widget, clientId) => {
                if (!newWidgets.has(clientId)) {
                    editor.removeContentWidget(widget);
                }
            });
            newWidgets.forEach((widget, clientId) => {
                if (!widgetsRef.current.has(clientId)) {
                    editor.addContentWidget(widget);
                } else {
                    // Force reposition
                    editor.layoutContentWidget(widget);
                }
            });
            widgetsRef.current = newWidgets;

            // Add CSS for cursor decorations and widgets
            const style = document.createElement('style');
            style.textContent = `
      ${Array.from(provider.awareness.getStates().keys())
                    .map(
                        (clientId) => {
                            const colorIndex = clientId % usernameColors.length;
                            const backgroundColor = usernameColors[colorIndex];
                            return `
              .cursor-decoration-${clientId} {
                width: 2px !important;
                background: ${provider.awareness.getStates().get(clientId)?.user?.color || '#ff0000'
                                };
              }
              .cursor-glyph-${clientId} {
                background: ${provider.awareness.getStates().get(clientId)?.user?.color || '#ff0000'
                                };
                width: 4px;
                height: 16px;
                margin-left: 2px;
              }
              .cursor-widget-${clientId} {
                background: ${backgroundColor};
                color: white;
                padding: 2px 4px;
                border-radius: 3px;
                font-size: 12px;
                opacity: 0.9;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
                white-space: nowrap;
                z-index: 101;
              }
            `;
                        }
                    )
                    .join('\n')}
    `;
            document.head.appendChild(style);
            styleRef.current = style;
        };

        // Listen for awareness changes
        provider.awareness.on('change', updateCursors);

        // Initial render
        updateCursors();

        return () => {
            cursorDisposable.dispose();
            provider.awareness.off('change', updateCursors);
            decorationIdsRef.current = editor.deltaDecorations(decorationIdsRef.current, []);
            widgetsRef.current.forEach((widget) => {
                editor.removeContentWidget(widget);
            });
            widgetsRef.current.clear();
            if (styleRef.current) {
                document.head.removeChild(styleRef.current);
            }
        };
    }, [editorRef, monacoRef, provider, enabled, usernameColors, role]);
}