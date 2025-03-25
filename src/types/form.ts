export interface Form {
  id: string;
  created_at: string;
  title: string;
  prompts: Prompt[];
  user_id: string;
}

export interface Prompt {
  id: string;
  text: string;
  type: 'text' | 'choice' | 'end';
  options?: string[];
  next_prompt_id?: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  created_at: string;
  answers: Answer[];
}

export interface Answer {
  prompt_id: string;
  value: string;
  created_at: string;
}