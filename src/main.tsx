import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import client from './apollo/client.ts'
import { ChatProvider } from './context/chatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ChatProvider>
        <App />
      </ChatProvider>
    </ApolloProvider>
  </StrictMode>,
)
