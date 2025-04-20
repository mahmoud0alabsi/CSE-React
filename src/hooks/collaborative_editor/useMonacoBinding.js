import { useEffect } from 'react';
import { MonacoBinding } from 'y-monaco';

export default function useMonacoBinding({
  yText,
  editorRef,
  monacoRef,
  provider,
  enabled
}) {
  useEffect(() => {
    if (
      !enabled ||
      !yText ||
      !editorRef.current ||
      !monacoRef.current ||
      !provider
    ) {
      return;
    }

    const model = editorRef.current.getModel();
    if (!model) {
      console.warn('Monaco editor model is not yet available.');
      return;
    }

    try {
      const binding = new MonacoBinding(
        yText,
        model,
        new Set([editorRef.current]),
        provider.awareness
      );

      return () => {
        binding.destroy();
      };
    } catch (error) {
      console.error('Error in MonacoBinding:', error);
    }
  }, [yText, editorRef, monacoRef, provider, enabled]);
}