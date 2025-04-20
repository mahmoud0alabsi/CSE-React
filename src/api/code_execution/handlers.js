import { executeCode } from './execution.js';

export const handleCodeExecution = async ({ code, language }) => {
  try {
    const response = await executeCode({ code, language });
    return response
  } catch (error) {
    return error.message || 'An error occurred while executing the code.';
  }
};
