import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import GlobalStyles from './components/GlobalStyles';
import AppProvider from './Context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GlobalStyles>
      <AppProvider>
       <App />
      </AppProvider>
    </GlobalStyles>
  </StrictMode>,
);