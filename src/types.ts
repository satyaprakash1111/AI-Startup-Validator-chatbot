export type Role = "user" | "assistant";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
}

export interface EvaluationPillar {
  name: string;
  score: number;
  pros: string[];
  cons: string[];
  analysis: string;
  recommendation: string;
}

export interface EvaluationResult {
  overallScore: number;
  executiveSummary: string;
  constructiveFeedback: string;
  pillars: EvaluationPillar[];
  nextSteps: string[];
}

export interface SavedIdea {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  evaluation: EvaluationResult | null;
  messages: Message[];
}
