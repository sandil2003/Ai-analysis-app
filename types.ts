export enum AppTab {
  DETECTOR = 'AI Detector',
  CHATBOT = 'Chatbot',
}

export interface AnalysisResult {
  is_ai_generated_probability: number;
  explanation: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
