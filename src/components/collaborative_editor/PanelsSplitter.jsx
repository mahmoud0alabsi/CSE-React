import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import {
    PanelGroup,
    Panel,
    PanelResizeHandle,
} from 'react-resizable-panels';
import SideMenu from './SideMenu';
import EditorTabs from './EditorTabs';
import CodeEditor from './CodeEditor';
import CodeExecution from './CodeExecution';
import { useRef } from 'react';

export default function PanelsSplitter({ onCodeChange }) {
    const [code, setCode] = useState('');
    const defaultSizes = {
        left: 18,
        center: 60,
        right: 22,
    };
    const horizontalPanelGroupRef = useRef();
    const verticalPanelGroupRef = useRef();

    const resetPanels = () => {
        if (horizontalPanelGroupRef.current) {
            horizontalPanelGroupRef.current.setLayout([
                defaultSizes.left,
                defaultSizes.center,
                defaultSizes.right
            ]);
        }

        if (verticalPanelGroupRef.current) {
            verticalPanelGroupRef.current.setLayout([90, 10]);
        }
    };

    const handleSetCode = (newCode) => {
        setCode(newCode);
        onCodeChange(newCode);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Scrollable main panel area */}
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                <PanelGroup ref={horizontalPanelGroupRef} direction="horizontal" style={{ height: '100%' }}>
                    {/* Left: Side Menu */}
                    <Panel defaultSize={defaultSizes.left} minSize={15} maxSize={18}>
                        <Box sx={{ height: '100%' }}>
                            <SideMenu code={code} />
                        </Box>
                    </Panel>

                    <CustomResizeHandle />

                    {/* Middle: Monaco Editor */}
                    <Panel defaultSize={defaultSizes.center} minSize={20}>
                        <PanelGroup ref={verticalPanelGroupRef} direction="vertical" style={{ height: '100%', width: '100%' }}>
                            {/* Top: Code Editor */}
                            <Panel defaultSize={90} minSize={10} maxSize={90}>
                                <Box sx={{ height: '100%' }}>
                                    <CodeEditor
                                        setCode={handleSetCode}
                                    />
                                </Box>
                            </Panel>

                            <CustomVerticalResizeHandle />

                            {/* Bottom: Code Execution */}
                            <Panel defaultSize={10} minSize={10} maxSize={90} style={{ backgroundColor: '#070c18', overflow: "auto", }}>
                                <CodeExecution code={code} />
                            </Panel>
                        </PanelGroup>
                    </Panel>

                    <CustomResizeHandle />

                    {/* Right: Tab Panel */}
                    <Panel defaultSize={defaultSizes.right} minSize={15}>
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                            }}
                        >
                            <EditorTabs />
                        </Box>
                    </Panel>
                </PanelGroup>
            </Box>


            {/* Bottom bar (footer) */}
            <Button
                variant="outlined"
                onClick={resetPanels}
                sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    borderColor: 'divider',
                    borderRadius: 0,
                    height: '20px',
                    minHeight: '18px',
                    padding: '4px 8px',
                    lineHeight: 1,
                    textTransform: 'none',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        borderColor: 'action.active',
                    },
                }}
            >
                Reset Panels
            </Button>
        </Box>
    );
}

// Custom resize handle
function CustomResizeHandle() {
    return (
        <PanelResizeHandle>
            <Box
                sx={{
                    width: '3px',
                    height: '100%',
                    backgroundColor: '#ccc',
                    '&:hover': {
                        backgroundColor: '#999',
                    },
                    cursor: 'col-resize',
                    transition: 'background-color 0.2s ease',
                }}
            />
        </PanelResizeHandle>
    );
}

// Custom resize handle for vertical panels
function CustomVerticalResizeHandle() {
    return (
        <PanelResizeHandle>
            <Box
                sx={{
                    width: '100%',
                    height: '3px',
                    backgroundColor: '#ccc',
                    '&:hover': {
                        backgroundColor: '#999',
                    },
                    cursor: 'row-resize',
                    transition: 'background-color 0.2s ease',
                }}
            />
        </PanelResizeHandle>
    );
}
