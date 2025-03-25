import { useState } from 'react';
import { Input, IconButton, Flex } from '@chakra-ui/react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap={2}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={disabled}
        />
        <IconButton
          type="submit"
          aria-label="Send message"
          icon={<Send />}
          colorScheme="blue"
          disabled={disabled || !message.trim()}
        />
      </Flex>
    </form>
  );
};