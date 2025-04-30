import { useEffect } from 'react';
import useYjsConnection from './useYjsConnection';
import useMonacoBinding from './useMonacoBinding';
import useCursorTracking from './useCursorTracking';

export default function useCollaborativeCodeSession({
  projectId,
  branchId,
  fileId,
  fileStatus,
  fileContent,
  role,
  monacoRef,
  editorRef,
  enabled,
}) {
  const isReady =
    enabled &&
    !!projectId &&
    !!branchId &&
    !!fileId &&
    editorRef.current &&
    monacoRef.current &&
    editorRef.current.getModel(); // ensure model is ready

  const docName = isReady ? `${projectId}/${branchId}/${fileId}` : '';

  const { ydoc, provider, yText, meta } = useYjsConnection({
    docName,
    enabled: isReady,
    projectId,
    branchId,
    fileId,
    fileStatus,
    fileContent,
  });

  useMonacoBinding({
    yText,
    editorRef,
    monacoRef,
    provider,
    enabled: isReady,
  });

  useCursorTracking({
    editorRef,
    monacoRef,
    provider,
    enabled: isReady,
    role,
  });

  useEffect(() => {
    if (!isReady || !ydoc || !provider) return;

    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, [ydoc, provider, isReady, docName]);

  return;
}
