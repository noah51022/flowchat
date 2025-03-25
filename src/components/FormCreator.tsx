import { useState } from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useFormStore } from '../store/formStore';
import { v4 as uuidv4 } from 'uuid';

export const FormCreator = () => {
  const [prompts, setPrompts] = useState('');
  const toast = useToast();
  const { createForm } = useFormStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const promptList = prompts.split('\n').filter(p => p.trim());
      const formPrompts = promptList.map((text, index) => ({
        id: uuidv4(),
        text,
        type: index === promptList.length - 1 ? 'end' : 'text',
        next_prompt_id: index < promptList.length - 1 ? uuidv4() : undefined,
      }));

      await createForm({
        title: 'New Form',
        prompts: formPrompts,
      });

      toast({
        title: 'Form created!',
        status: 'success',
        duration: 3000,
      });

      setPrompts('');
    } catch (error) {
      toast({
        title: 'Error creating form',
        description: (error as Error).message,
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={8}>
      <VStack spacing={6}>
        <Heading size="lg">Create a New Form</Heading>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <Textarea
              value={prompts}
              onChange={(e) => setPrompts(e.target.value)}
              placeholder="Enter your prompts, one per line:
Ask their name
Ask their favorite color
Ask why they like that color
Thank them and end"
              minH="200px"
            />
            <Button type="submit" colorScheme="blue" w="full">
              Create Form
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};