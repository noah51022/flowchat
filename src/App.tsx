import { ChakraProvider, Box, CSSReset, extendTheme, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FormCreator } from './components/FormCreator';
import { FormResponse } from './components/FormResponse';
import { isSupabaseConfigured } from './lib/supabase';

// Create a custom theme with some base styles
const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

function App() {
  const isConfigured = isSupabaseConfigured();

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Router>
        <Box minH="100vh" p={4}>
          {!isConfigured ? (
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              height="200px"
              borderRadius="md"
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Supabase Configuration Required
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                Please connect to Supabase using the "Connect to Supabase" button in the top right corner to start using the application.
              </AlertDescription>
            </Alert>
          ) : (
            <Routes>
              <Route path="/" element={<FormCreator />} />
              <Route path="/form/:id" element={
                <FormResponse formId={window.location.pathname.split('/')[2]} />
              } />
            </Routes>
          )}
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;