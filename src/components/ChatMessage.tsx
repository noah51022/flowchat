import { Box, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

interface ChatMessageProps {
  message: string;
  isAI: boolean;
}

export const ChatMessage = ({ message, isAI }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        maxW="80%"
        ml={isAI ? 0 : 'auto'}
        mr={isAI ? 'auto' : 0}
        bg={isAI ? 'blue.500' : 'gray.100'}
        color={isAI ? 'white' : 'black'}
        p={4}
        borderRadius="lg"
        mb={4}
      >
        <Text>{message}</Text>
      </Box>
    </motion.div>
  );
};