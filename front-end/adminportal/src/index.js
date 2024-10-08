import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './Main';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Ensure this URL is correct and your GraphQL server is running
  cache: new InMemoryCache()
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Main />
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);