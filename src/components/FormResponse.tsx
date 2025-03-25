import { useParams } from 'react-router-dom';
import { Box, Text } from '@chakra-ui/react';
import { useFormStore } from '../store/formStore';
import { useEffect } from 'react';

export const FormResponse = () => {
  const { formId } = useParams<{ formId: string }>();
  const { getResponses, responses, loading } = useFormStore();

  useEffect(() => {
    if (formId) {
      getResponses(formId);
    }
  }, [formId, getResponses]);

  if (loading) {
    return <Text>Loading responses...</Text>;
  }

  return (
    <Box>
      {responses.map((response, index) => (
        <Box key={index} p={4} mb={4} bg="white" borderRadius="md" shadow="sm">
          {response.answers.map((answer, answerIndex) => (
            <Text key={answerIndex}>
              {answer.value}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
};