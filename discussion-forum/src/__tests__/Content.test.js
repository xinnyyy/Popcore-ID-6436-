import React from 'react';
import { render, screen } from '@testing-library/react';
import Content from '../Content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

// Create a new instance of QueryClient
const queryClient = new QueryClient();

// Mock the react-query useQuery hook
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}));

// Mock the useParams hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ topic: 'mock-topic' }), // Mock useParams to return a mock object
}));

// Mock the NothingHere component
jest.mock('../NothingHere', () => () => <div data-testid="mock-nothing-here">Mocked NothingHere</div>);

describe('Content Component', () => {
  test('renders Content component with mock data', async () => {
    // Mock useQuery to return loading state and empty data
    jest.spyOn(require('react-query'), 'useQuery').mockReturnValue({ isLoading: true, data: [] });

    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/questions/:topic" element={<Content />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    );
  });
});
