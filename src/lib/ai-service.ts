import { apiClient } from './api';

export interface ImproveTextRequest {
  text: string;
  context?: string;
}

export interface ImproveTextResponse {
  success: boolean;
  improvedText?: string;
  error?: string;
}

export const aiService = {
  async improveText(request: ImproveTextRequest): Promise<ImproveTextResponse> {
    try {
      const response = await apiClient.post('/api/improve-text', request);
      
      if (response.success) {
        return {
          success: true,
          improvedText: response.improvedText
        };
      } else {
        return {
          success: false,
          error: response.error || 'Falha ao melhorar texto'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro ao processar solicitação'
      };
    }
  }
};