// src/components/__tests__/Home.test.js

import React from 'react';
import { render, fireEvent, waitFor, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Home from '../../pages/Home'; // Correct relative path

// Mock axios
jest.mock('axios');

// Mock localStorage
const mockUser = {
  _id: '1234',
  name: 'Test User',
  email: 'test@example.com',
  profileImage: 'https://example.com/profile.jpg',
};
localStorage.setItem('user', JSON.stringify(mockUser));

// Mock environment variable
process.env.REACT_APP_BACKEND_URL = 'http://localhost:5000';

const mockPosts = [
  {
    _id: '1',
    question: 'What is your favorite Netflix show?',
    description: 'I love Stranger Things. What about you?',
    upvote: [1, 2, 3],
    author: { profileImage: '', name: 'User1' },
    createdAt: '2023-01-01T00:00:00.000Z',
    replies: [
      {
        _id: '101',
        reply: 'I love Stranger Things too!',
        author: { profileImage: '', name: 'User2' },
        createdAt: '2023-01-01T00:00:00.000Z',
      },
    ],
  },
];

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<Home />);
  });

  test('renders posts after fetching', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPosts });

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/questions`);
    });

    expect(screen.getByText('What is your favorite Netflix show?')).toBeInTheDocument();
    expect(screen.getByText('I love Stranger Things. What about you?')).toBeInTheDocument();
    expect(screen.getByText('I love Stranger Things too!')).toBeInTheDocument();
  });

  test('submits a comment', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPosts });
    axios.post.mockResolvedValueOnce({ data: { message: 'Comment submitted successfully' } });

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/questions`);
    });

    // Toggle reply section
    fireEvent.click(screen.getByText('Reply'));

    // Submit comment
    const replyInput = screen.getByPlaceholderText('Type your reply here...');
    fireEvent.change(replyInput, { target: { value: 'Great post!' } });
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/comments`, {
        replyText: 'Great post!',
        postId: '1',
      });
    });
  });

  test('toggles reply section correctly', async () => {
    axios.get.mockResolvedValueOnce({ data: mockPosts });

    await act(async () => {
      render(<Home />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/questions`);
    });

    // Toggle reply section
    const replyButton = screen.getByText('Reply');
    fireEvent.click(replyButton);
    expect(screen.getByPlaceholderText('Type your reply here...')).toBeInTheDocument();

    // Toggle off
    fireEvent.click(replyButton);
    expect(screen.queryByPlaceholderText('Type your reply here...')).not.toBeInTheDocument();
  });

});
