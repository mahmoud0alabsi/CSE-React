import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { LinearProgress, Box, Stack } from '@mui/material';
import useCollaborativeCodeSession from '../../hooks/collaborative_editor/useCollaborativeCodeSession';

export default function CodeEditor({ setCode }) {
    const projectId = useSelector((state) => state.collaborative.projectId);
    const role = useSelector((state) => state.collaborative.role);
    const branchId = useSelector((state) => state.collaborative.selectedBranchId);
    const file = useSelector((state) => state.collaborative.selectedFile);
    const [mounted, setMounted] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentCode, setCurrentCode] = useState('');

    const editorRef = useRef(null);
    const monacoRef = useRef(null);

    useCollaborativeCodeSession({
        projectId,
        branchId,
        fileId: file?.id || '',
        fileStatus: file?.status || '',
        fileContent: file?.content || '',
        monacoRef,
        editorRef,
        enabled: mounted && !!file,
    });

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;
        setMounted(true);
        setLoading(false);
    };

    useEffect(() => {
        if (!file || !editorRef.current || !monacoRef.current) return;
        setShowMessage(false);
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, [file]);

    useEffect(() => {
        if (!branchId || !file) {
            setShowMessage(true);
            setLoading(false);
        } else {
            setShowMessage(false);
            setLoading(true);
        }
    }, [file, branchId]);

    useEffect(() => {
        if (editorRef.current && mounted) {
            const disposable = editorRef.current.onDidChangeModelContent(() => {
                const code = editorRef.current.getValue();
                // setCode(code);
                setCurrentCode(code);
            });
            return () => disposable.dispose();
        }
    }, [mounted, setCode]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCode(currentCode);
        }, 500);

        return () => clearInterval(interval);
    }, [currentCode, setCode]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {showMessage && (
                <Box
                    sx={{
                        padding: '20px',
                        backgroundColor: '#071035',
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
                        marginBottom: '20px',
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                        <span>Please select a file to open in the editor.</span>
                    </Stack>
                </Box>
            )}

            {!showMessage && (
                <Box sx={{ position: 'relative' }}>
                    {loading && (
                        <LinearProgress
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '4px',
                                zIndex: 1000,
                            }}
                        />
                    )}

                    <Box sx={{ opacity: loading ? 0.3 : 1 }}>
                        <Editor
                            height="100vh"
                            defaultLanguage={file?.language.toLowerCase() || 'javascript'}
                            defaultValue=""
                            theme="vs-dark"
                            onMount={handleEditorDidMount}
                            options={{
                                readOnly: role === 'VIEWER',
                                fontSize: 14,
                            }}
                        />
                    </Box>
                </Box>
            )}
        </div>
    );
}
