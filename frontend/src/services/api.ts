import axios, { AxiosError } from 'axios';
import type { HealthResponse, UploadResponse, ChatResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ detail?: string }>;
    if (axiosError.response?.data?.detail) {
      return axiosError.response.data.detail;
    }
    if (axiosError.code === 'ERR_NETWORK') {
      return 'Unable to connect to StudyMate backend. Please verify that the server is running.';
    }
    if (axiosError.response?.status === 404) {
      return 'Document session not found. Please upload your document again.';
    }
    if (axiosError.response?.status === 502) {
      return axiosError.response.data?.detail || 'LLM generation failed. Please verify your OpenRouter configuration.';
    }
    return axiosError.message || 'An unexpected error occurred while communicating with the server.';
  }
  return error instanceof Error ? error.message : 'An unknown error occurred.';
};

export const getHealth = async (): Promise<HealthResponse> => {
  try {
    const response = await client.get<HealthResponse>('/health');
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await client.post<UploadResponse>('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};

export const chatWithDocument = async (
  documentId: string,
  question: string
): Promise<ChatResponse> => {
  try {
    const response = await client.post<ChatResponse>('/api/chat', {
      document_id: documentId,
      question: question.trim(),
    });
    return response.data;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
};
