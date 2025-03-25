import { useEffect, useState } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Form, Prompt } from '../types/form';
import { useFormStore } from '../store/formStore';

interface FormResponseProps {
  formId: string;
}

export const FormResponse = ({ formId }: FormResponseProps) => {
  const [messages, setMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const { getForm } = useFormStore();
  const [form, setForm] = useState<Form | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      const formData = await getForm(formId);
      if (formData) {
        setForm(formData);
        setCurrentPrompt(formData.prompts[0]);
        setMessages([{ text: formData.prompts[0].text, isAI: true }]);
      }
    };
    loadForm();
  }, [formId, getForm]);

  const handleSendMessage = (message: string) => {
    setMessages(prev => [...prev, { text: message, isAI: false }]);

    if (form && currentPrompt) {
      const currentIndex = form.prompts.findIndex(p => p.id === currentPrompt.id);
      if (currentIndex < form.prompts.length - 1) {
        const nextPrompt = form.prompts[currentIndex + 1];
        setCurrentPrompt(nextPrompt);
        
        setTimeout(() => {
          let promptText = nextPrompt.text;
          // Replace placeholders with actual values
          messages.forEach(msg => {
            if (!msg.isAI) {
              promptText = promptText.replace('[previous]', msg.text);
            }
          });
          setMessages(prev => [...prev, { text: promptText, isAI: true }]);
        }, 1000);
      }
    }
  };

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      <VStack flex={1} p={4} overflowY="auto" spacing={4}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isAI={message.isAI}
          />
        ))}
      </VStack>
      <Box p={4}>
        <ChatInput
          onSend={handleSendMessage}
          disabled={!currentPrompt || currentPrompt.type === 'end'}
        />
      </Box>
    </Box>
  );
};