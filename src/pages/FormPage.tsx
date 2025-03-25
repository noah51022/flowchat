import { useParams } from 'react-router-dom';
import { Container, Heading, Box } from '@chakra-ui/react';
import { FormChat } from '../components/FormChat';

export const FormPage = () => {
  const { formId } = useParams<{ formId: string }>();

  if (!formId) {
    return <Heading>Form not found</Heading>;
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={8}>
        <Heading size="lg">Interactive Form</Heading>
      </Box>
      <FormChat formId={formId} />
    </Container>
  );
}; 