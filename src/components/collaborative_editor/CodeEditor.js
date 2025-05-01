import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Editor from '@monaco-editor/react';
import { LinearProgress, Box, Stack } from '@mui/material';
import useCollaborativeCodeSession from '../../hooks/collaborative_editor/useCollaborativeCodeSession';
import { setCode, setEditorLoading } from '../../state_managment/collaborativeSlice';

const CodeEditor = () => {
    const {
        projectId,
        role,
        selectedBranchId: branchId,
        selectedFile: file,
        editorLoading: isLoading,
    } = useSelector((state) => state.collaborative);

    const [mounted, setMounted] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [currentCode, setCurrentCode] = useState('');
    const [editorReady, setEditorReady] = useState(false);

    const currentCodeRef = useRef(currentCode);
    const editorRef = useRef(null);
    const monacoRef = useRef(null);
    const debounceTimerRef = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        currentCodeRef.current = currentCode;
    }, [currentCode]);

    useCollaborativeCodeSession({
        projectId,
        branchId,
        fileId: file?.id || '',
        fileStatus: file?.status || '',
        fileContent: file?.content || '',
        role,
        monacoRef,
        editorRef,
        enabled: mounted && !!file,
    });

    const handleEditorDidMount = useCallback((editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        setMounted(true);
        setEditorReady(true);
        dispatch(setEditorLoading(false));

        // Set initial content
        const content = editor.getValue();
        setCurrentCode(content);
    }, [dispatch]);

    // Handle file changes
    useEffect(() => {
        if (!file || !editorRef.current) {
            setCurrentCode('');
            return;
        }

        setShowMessage(false);
        setEditorReady(false);
        dispatch(setEditorLoading(true));

        const timer = setTimeout(() => {
            const content = editorRef.current.getValue();
            setCurrentCode(content);
            setEditorReady(true);
            dispatch(setEditorLoading(false));
        }, 500);

        return () => clearTimeout(timer);
    }, [file, dispatch]);

    // Handle branch/file selection
    useEffect(() => {
        if (!branchId || !file) {
            setShowMessage(true);
            setEditorReady(false);
            editorRef.current?.setValue('');
            setCurrentCode('');
        } else {
            setShowMessage(false);
            if (!editorReady) {
                dispatch(setEditorLoading(true));
            }
        }
    }, [file, branchId, dispatch, editorReady]);

    // Debounced dispatch handler
    const dispatchCodeUpdate = useCallback((code) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            dispatch(setCode({ code }));
        }, 500);
    }, [dispatch]);

    // Editor content change listener
    useEffect(() => {
        if (!editorRef.current || !mounted) return;

        const disposable = editorRef.current.onDidChangeModelContent(() => {
            const code = editorRef.current.getValue();
            setCurrentCode(code);
            dispatchCodeUpdate(code);
        });

        return () => {
            disposable.dispose();
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [mounted, dispatchCodeUpdate]);

    const containerStyles = {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    };

    const messageStyles = {
        display: showMessage && !isLoading ? 'block' : 'none',
        backgroundColor: '#071035',
        textAlign: 'center',
        fontSize: '18px',
        fontWeight: 'bold',
        padding: '20px',
        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
        marginBottom: '16px',
        flexShrink: 0
    };

    const editorContainerStyles = {
        flex: 1,
        opacity: isLoading ? 0.3 : showMessage ? 0.0 : 1,
        overflow: 'hidden',
        minHeight: 0
    };

    return (
        <Box sx={containerStyles}>
            {isLoading && (
                <LinearProgress sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    zIndex: 1000
                }} />
            )}

            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {showMessage && (
                    <Box sx={messageStyles}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                            <span>Please select a file to open in the editor.</span>
                        </Stack>
                    </Box>
                )}

                <Box sx={editorContainerStyles}>
                    <Editor
                        height="100%"
                        language={file?.language.toLowerCase() || 'javascript'}
                        value={currentCode}
                        theme="vs-dark"
                        onMount={handleEditorDidMount}
                        options={{
                            readOnly: role === 'VIEWER' || !file || showMessage,
                            fontSize: 14,
                            minimap: { enabled: false }
                        }}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default React.memo(CodeEditor);