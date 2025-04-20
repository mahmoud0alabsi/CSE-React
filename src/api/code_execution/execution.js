import api from "../api";

export const executeCode = async ({ code, language }) => {
    const response = await api.post("/execute", { code, language, args: [], sessionId: "" });
    return response.data;
};