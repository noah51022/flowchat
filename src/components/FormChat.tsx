import { useState, useEffect } from 'react';
import { VStack, Box, Text, useToast } from '@chakra-ui/react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { useFormStore } from '../store/formStore';
import { Form } from '../types/form';

interface FormChatProps {
  formId: string;
}

export const FormChat = ({ formId }: FormChatProps) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [messages, setMessages] = useState<Array<{ text: string; isAI: boolean }>>([]);
  const [answers, setAnswers] = useState<Array<{ prompt_id: string; value: string }>>([]);
  const { getForm, currentForm, submitResponse } = useFormStore();
  const toast = useToast();

  useEffect(() => {
    const loadForm = async () => {
      await getForm(formId);
    };
    loadForm();
  }, [formId, getForm]);

  useEffect(() => {
    if (currentForm && currentPromptIndex === 0) {
      // Send the first prompt when the form loads
      setMessages([{ text: currentForm.prompts[0].text, isAI: true }]);
    }
  }, [currentForm, currentPromptIndex]);

  const handleSendMessage = async (message: string) => {
    if (!currentForm) return;

    // Add user's message to chat
    setMessages(prev => [...prev, { text: message, isAI: false }]);

    // Save the answer
    const currentPrompt = currentForm.prompts[currentPromptIndex];
    setAnswers(prev => [...prev, { prompt_id: currentPrompt.id, value: message }]);

    const nextPromptIndex = currentPromptIndex + 1;

    // If there are more prompts, send the next one
    if (nextPromptIndex < currentForm.prompts.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { text: currentForm.prompts[nextPromptIndex].text, isAI: true }]);
        setCurrentPromptIndex(nextPromptIndex);
      }, 500);
    } else {
      // Form is complete, submit responses
      try {
        await submitResponse(formId, answers);
        setTimeout(() => {
          setMessages(prev => [...prev, { text: "Thank you for completing the form!", isAI: true }]);
        }, 500);
        toast({
          title: "Form submitted successfully",
          status: "success",
          duration: 3000,
        });
      } catch (error) {
        toast({
          title: "Error submitting form",
          description: (error as Error).message,
          status: "error",
          duration: 5000,
        });
      }
    }
  };

  if (!currentForm) {
    return <Text>Loading form...</Text>;
  }

  return (
    <VStack spacing={4} w="full" maxW="container.md" mx="auto" p={4}>
      <Box w="full" overflowY="auto" maxH="calc(100vh - 200px)" p={4}>
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            message={message.text}
            isAI={message.isAI}
          />
        ))}
      </Box>
      <Box w="full" position="sticky" bottom={0} bg="white" p={4}>
        <ChatInput
          onSend={handleSendMessage}
          disabled={currentPromptIndex >= currentForm.prompts.length}
        />
      </Box>
    </VStack>
  );
}; 