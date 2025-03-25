import { create } from 'zustand';
import { Form, FormResponse } from '../types/form';
import { supabase } from '../lib/supabase';

interface FormState {
  forms: Form[];
  currentForm: Form | null;
  responses: FormResponse[];
  loading: boolean;
  error: string | null;
  fetchForms: () => Promise<void>;
  createForm: (form: Partial<Form>) => Promise<Form>;
  getForm: (id: string) => Promise<Form | null>;
  getResponses: (formId: string) => Promise<FormResponse[]>;
}

export const useFormStore = create<FormState>((set, get) => ({
  forms: [],
  currentForm: null,
  responses: [],
  loading: false,
  error: null,

  fetchForms: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ forms: data, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  createForm: async (form) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('forms')
        .insert([form])
        .select()
        .single();

      if (error) throw error;
      set(state => ({ forms: [data, ...state.forms], loading: false }));
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      throw error;
    }
  },

  getForm: async (id) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      set({ currentForm: data, loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return null;
    }
  },

  getResponses: async (formId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('form_responses')
        .select('*')
        .eq('form_id', formId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ responses: data, loading: false });
      return data;
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
      return [];
    }
  },
}));